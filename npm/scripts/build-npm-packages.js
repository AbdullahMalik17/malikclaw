#!/usr/bin/env node
"use strict";

/**
 * Assembles the publishable npm packages from GoReleaser release archives.
 *
 * Usage:
 *   node npm/scripts/build-npm-packages.js --version <semver> --dir <dist> [--only <dir,dir>]
 *
 *   --version  Release version WITHOUT the leading "v" (e.g. 0.2.3). A "v" is
 *              accepted and stripped for convenience.
 *   --dir      Directory holding GoReleaser archives, e.g.
 *                malikclaw_Linux_x86_64.tar.gz  malikclaw_Darwin_arm64.tar.gz
 *                malikclaw_Windows_x86_64.zip   ...
 *   --only     Optional comma-separated platform dirs (e.g. win32-x64) to
 *              process for a local smoke test, instead of the full matrix.
 *              Without it, a missing archive is a hard error: a release that
 *              silently drops a platform is worse than one that fails CI.
 *
 * What it does, per mapped platform:
 *   1. Extracts the archive into a temp dir (system tar / unzip - the archives
 *      hold several binaries; we only take the primary `malikclaw` one).
 *   2. Copies the binary to npm/platforms/<dir>/bin/malikclaw[.exe], chmod 755.
 *   3. Pins npm/platforms/<dir>/package.json to the release version.
 * Finally it rewrites npm/cli/package.json with the release version and
 * optionalDependencies pinning EVERY platform package at that exact version.
 *
 * Idempotent: re-running with the same inputs produces byte-identical output.
 * Fails loudly on any unmappable .tar.gz/.zip archive (typo, or someone
 * changed the archive name_template) and skips known-excluded targets with a
 * printed reason (see EXCLUDED_REASONS in platforms.js).
 */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const {
  PLATFORMS,
  BINARY_FIELD,
  packageName,
  isExcluded,
} = require("./platforms.js");

const NPM_ROOT = path.resolve(__dirname, "..");
const CLI_MANIFEST = path.join(NPM_ROOT, "cli", "package.json");

function fail(msg) {
  console.error(`\nbuild-npm-packages: ${msg}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { version: null, dir: null, only: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--version") args.version = argv[++i];
    else if (a === "--dir") args.dir = argv[++i];
    else if (a === "--only") args.only = argv[++i];
    else fail(`unknown argument "${a}" (see header comment for usage)`);
  }
  if (!args.version || !args.dir) {
    fail("both --version <semver> and --dir <archive-dir> are required");
  }
  args.version = args.version.replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(args.version)) {
    fail(`"--version ${args.version}" is not a valid semver (no leading v needed)`);
  }
  if (!fs.existsSync(args.dir) || !fs.statSync(args.dir).isDirectory()) {
    fail(`--dir "${args.dir}" is not a directory`);
  }
  if (args.only) {
    args.only = args.only.split(",").map((s) => s.trim()).filter(Boolean);
    for (const dir of args.only) {
      if (!PLATFORMS.some((p) => p.dir === dir)) {
        fail(`--only: "${dir}" is not a known platform dir`);
      }
    }
  }
  return args;
}

/** Run an extractor; returns the temp dir the archive was unpacked into. */
function extract(archivePath) {
  const dest = fs.mkdtempSync(path.join(os.tmpdir(), "malikclaw-npm-"));
  const isZip = archivePath.endsWith(".zip");
  let cmd;
  let argv;
  if (!isZip) {
    cmd = "tar";
    argv = ["-xzf", archivePath, "-C", dest];
  } else if (process.platform === "win32") {
    // Git Bash ships GNU tar (no zip support); Windows' bundled bsdtar does.
    cmd = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe");
    argv = ["-xf", archivePath, "-C", dest];
  } else {
    cmd = "unzip";
    argv = ["-qq", "-o", archivePath, "-d", dest];
  }
  const res = spawnSync(cmd, argv, { encoding: "utf8" });
  if (res.error || res.status !== 0) {
    fs.rmSync(dest, { recursive: true, force: true });
    fail(
      `failed to extract ${path.basename(archivePath)} with \`${cmd} ${argv.join(" ")}\`: ` +
      (res.error ? res.error.message : (res.stderr || "").trim() || `exit ${res.status}`)
    );
  }
  return dest;
}

/** First file named `name` anywhere under `root` (archives may wrap contents). */
function findFile(root, name) {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (ent.isFile() && ent.name === name) return full;
    }
  }
  return null;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    fail(`cannot read ${file}: ${e.message}`);
  }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const distDir = path.resolve(args.dir);
  const files = fs.readdirSync(distDir).sort();

  const archives = files.filter((f) => /\.(tar\.gz|zip)$/.test(f));
  const byArchive = new Map(PLATFORMS.map((p) => [p.archive, p]));

  const selected = PLATFORMS.filter(
    (p) => !args.only || args.only.includes(p.dir)
  );

  // Classify every archive first so an unmappable name fails before we mutate
  // any package directory.
  const unknown = [];
  for (const f of archives) {
    if (byArchive.has(f)) continue;
    const excluded = isExcluded(f);
    if (excluded) {
      console.log(`skip (intentional): ${f}\n    reason: ${excluded.reason}`);
      continue;
    }
    if (f.startsWith("malikclaw_")) unknown.push(f);
    // anything else in the dir (source tarballs, etc.) is not ours to care about
  }
  if (unknown.length) {
    fail(
      "unmappable GoReleaser archive(s) found - add them to PLATFORMS or " +
      `EXCLUDED_REASONS in npm/scripts/platforms.js:\n  ${unknown.join("\n  ")}`
    );
  }

  // Full-matrix mode: every mapped platform must have its archive present.
  if (!args.only) {
    const missing = PLATFORMS.filter(
      (p) => !fs.existsSync(path.join(distDir, p.archive))
    );
    if (missing.length) {
      fail(
        "release archives missing for mapped platforms:\n  " +
        missing.map((p) => p.archive).join("\n  ")
      );
    }
  }

  let built = 0;
  for (const platform of selected) {
    const archivePath = path.join(distDir, platform.archive);
    if (!fs.existsSync(archivePath)) {
      if (args.only) {
        console.log(`skip (--only, archive absent): ${platform.dir}`);
        continue;
      }
      fail(`missing ${platform.archive}`);
    }

    const pkgDir = path.join(NPM_ROOT, "platforms", platform.dir);
    const manifestPath = path.join(pkgDir, "package.json");
    if (!fs.existsSync(manifestPath)) {
      fail(`${manifestPath} is missing - platform manifests are committed files`);
    }

    const tmp = extract(archivePath);
    try {
      const src = findFile(tmp, platform.binary);
      if (!src) {
        fail(
          `${platform.archive} does not contain a "${platform.binary}" binary - ` +
          "did goreleaser change the build ids or binary names?"
        );
      }
      const binDir = path.join(pkgDir, "bin");
      fs.mkdirSync(binDir, { recursive: true });
      const dest = path.join(binDir, platform.binary);
      fs.copyFileSync(src, dest);
      fs.chmodSync(dest, 0o755);

      const manifest = readJson(manifestPath);
      if (manifest[BINARY_FIELD] !== `bin/${platform.binary}`) {
        fail(
          `${platform.dir}/package.json field "${BINARY_FIELD}" must be ` +
          `"bin/${platform.binary}" (what the bin shim reads)`
        );
      }
      manifest.version = args.version;
      writeJson(manifestPath, manifest);
      built += 1;
      console.log(`built: ${packageName(platform)}@${args.version} <- ${platform.archive}`);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }

  // The wrapper always pins the FULL platform set at the exact release version:
  // npm skips optionalDependencies whose os/cpu do not match the host, so users
  // still download exactly one binary, and partial publishes can never strand
  // a host on an old platform package.
  const wrapper = readJson(CLI_MANIFEST);
  wrapper.version = args.version;
  wrapper.optionalDependencies = Object.fromEntries(
    PLATFORMS.map((p) => [packageName(p), args.version]).sort()
  );
  writeJson(CLI_MANIFEST, wrapper);

  console.log(
    `\nOK: ${built}/${PLATFORMS.length} platform package(s) built, ` +
    `wrapper ${wrapper.name}@${args.version} pins ${
      Object.keys(wrapper.optionalDependencies).length
    } optionalDependencies.`
  );
  console.log(`Publish with: npm publish npm/platforms/*  then  npm publish npm/cli`);
}

main();
