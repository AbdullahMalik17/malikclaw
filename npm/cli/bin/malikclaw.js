#!/usr/bin/env node
"use strict";

/**
 * malikclaw - npm launcher shim.
 *
 * `npm install -g malikclaw` installs this tiny wrapper plus exactly one
 * `@malikclaw/cli-<os>-<cpu>` package holding the real Go binary. npm picks the
 * right one by matching each optional dependency's `os`/`cpu` fields against
 * the host, then we exec the binary and get out of the way.
 *
 * Deliberately dependency-free and CommonJS: this file runs before anyone has
 * installed anything else, on whatever Node the user happens to have.
 */

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

/** Custom manifest field in each platform package naming its binary path. */
const BINARY_FIELD = "malikclaw";

/** npm scope holding the platform packages. */
const SCOPE = "@malikclaw";

const IS_WINDOWS = process.platform === "win32";
/**
 * Host (os, cpu) combinations we publish platform packages for. This table is
 * intentionally a copy of npm/scripts/platforms.js rather than a require():
 * that script lives outside this package's `files` list, so it is not present
 * in the published tarball. npm/scripts/verify.js asserts the two stay in sync.
 */
const SUPPORTED = [
  { os: "linux", cpus: ["x64", "arm64", "arm", "riscv64", "s390x"] },
  { os: "darwin", cpus: ["x64", "arm64"] },
  { os: "win32", cpus: ["x64"] },
  { os: "freebsd", cpus: ["x64", "arm64"] },
];

const requireFromHere = createRequire(__filename);

function isSupported(platform, arch) {
  const row = SUPPORTED.find((s) => s.os === platform);
  return Boolean(row && row.cpus.includes(arch));
}

/**
 * The `@malikclaw/cli-*` package that should hold this host's binary.
 * ARM is folded onto the single `arm` package, which ships an ARMv6 build so it
 * also runs on ARMv7 hardware.
 */
function platformPackageFor(platform, arch) {
  return `${SCOPE}/cli-${platform}-${arch}`;
}

/** Write a friendly, actionable message (never a stack) and exit non-zero. */
function die(lines, code = 1) {
  process.stderr.write(`\nmalikclaw: ${lines.join("\n")}\n\n`);
  process.exit(code);
}

function describeHost() {
  return `platform=${process.platform} arch=${process.arch}`;
}

/**
 * Resolve the packaged platform manifest, returning its absolute directory.
 * Throws when the package is not installed at all.
 */
function locatePlatformPackage(pkg) {
  const manifestPath = requireFromHere.resolve(`${pkg}/package.json`);
  return path.dirname(manifestPath);
}

/**
 * Find the native binary to run.
 *
 * Resolution order:
 *   1. $MALIKCLAW_BIN - explicit path to a binary (dev builds, unsupported hosts)
 *   2. $MALIKCLAW_PKG - explicit platform package name
 *   3. the `malikclaw.binary` field of the matching platform package
 *   4. bin/malikclaw[.exe] inside that package
 *
 * @returns {string} absolute path to an existing file
 */
function resolveBinary() {
  const override = process.env.MALIKCLAW_BIN;
  if (override) {
    const abs = path.resolve(override);
    if (!fileExists(abs)) {
      die([
        `MALIKCLAW_BIN points at "${override}", but no such file exists.`,
        "Unset MALIKCLAW_BIN to use the installed native binary.",
      ]);
    }
    return abs;
  }

  const pkg =
    process.env.MALIKCLAW_PKG ||
    platformPackageFor(process.platform, process.arch);

  let pkgDir;
  try {
    pkgDir = locatePlatformPackage(pkg);
  } catch {
    if (process.env.MALIKCLAW_PKG) {
      die([
        `could not resolve the platform package "${pkg}" from MALIKCLAW_PKG.`,
        `Install it with: npm install -g ${pkg}`,
      ]);
    }
    if (!isSupported(process.platform, process.arch)) {
      die([
        `there is no MalikClaw binary for ${describeHost()}.`,
        "Supported combinations:",
        ...SUPPORTED.flatMap((s) =>
          s.cpus.map((c) => `  - ${s.os}-${c}`)
        ),
        "",
        "The Go binary for your platform may still be available from",
        "https://github.com/AbdullahMalik17/malikclaw/releases",
        "If so, point the wrapper at it directly:",
        "  MALIKCLAW_BIN=/path/to/malikclaw malikclaw --help",
      ]);
    }
    die([
      `the optional dependency "${pkg}" is missing, so no native binary could`,
      `be found for ${describeHost()}.`,
      "",
      "This usually means optional dependencies were skipped. Fix with:",
      "  npm install -g malikclaw",
      `or explicitly: npm install -g ${pkg}`,
      "",
      "If you use a custom registry or an offline mirror, confirm that",
      `"${pkg}" has been mirrored there.`,
      "If it persists, file an issue:",
      "  https://github.com/AbdullahMalik17/malikclaw/issues",
    ]);
  }

  const candidates = [];
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(pkgDir, "package.json"), "utf8")
    );
    const declared = manifest && manifest[BINARY_FIELD];
    if (typeof declared === "string") {
      candidates.push(path.resolve(pkgDir, declared));
    }
  } catch {
    /* manifest unreadable - fall through to the conventional path */
  }
  candidates.push(path.join(pkgDir, "bin", IS_WINDOWS ? "malikclaw.exe" : "malikclaw"));

  for (const candidate of candidates) {
    if (fileExists(candidate)) {
      return candidate;
    }
  }

  die([
    `the package "${pkg}" is installed but its binary is missing.`,
    `Looked for: ${candidates.join("\n           ")}`,
    `Expected ${describeHost()}.`,
    "",
    "Reinstall to repair it:",
    `  npm install -g ${pkg}`,
  ]);
}

function fileExists(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

/**
 * On POSIX, re-raise the signal that killed the child so our own exit status is
 * 128 + signum. That is what a TUI/agent CLI needs: the shell, tmux, `&&`
 * chains and supervisors upstream see an honest "interrupted", and terminal
 * state stays consistent.
 */
function exitViaSignal(signal) {
  try {
    process.removeAllListeners(signal);
    process.kill(process.pid, signal);
    // Some signals cannot be re-raised reliably; degrade to a sane status.
    process.exit(1);
  } catch {
    process.exit(1);
  }
}

function main() {
  const binary = resolveBinary();
  const args = process.argv.slice(2);

  // stdio "inherit" is essential: the TUI/agent sessions must share our
  // console (no windowsHide, no pipes) and no timeout may cut them short.
  const result = spawnSync(binary, args, {
    stdio: "inherit",
    windowsHide: false,
  });

  if (result.error) {
    const e = result.error;
    if (e.code === "ENOENT") {
      die([`the native binary vanished before it could run: ${binary}`]);
    }
    if (e.code === "EACCES") {
      die([
        `permission denied running ${binary}.`,
        "On macOS/Linux try: chmod 755 \"" + binary + "\"",
      ]);
    }
    die([
      `failed to run the native binary: ${binary}`,
      `${e.name}: ${e.message}`,
      `Tried with ${describeHost()}.`,
    ]);
  }

  if (typeof result.status === "number") {
    process.exit(result.status);
  }

  if (result.signal) {
    exitViaSignal(result.signal);
    return;
  }

  die([`the native binary exited without a status code: ${binary}`]);
}

main();
