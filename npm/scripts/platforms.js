"use strict";

/**
 * Single source of truth for the MalikClaw npm native-binary packages.
 *
 * Each entry maps one GoReleaser archive onto exactly one npm package, keyed by
 * the (`os`, `cpu`) pair that npm matches against `process.platform` /
 * `process.arch` when deciding which `optionalDependencies` to install.
 *
 * IMPORTANT: npm's `cpu` vocabulary is NOT Go's `GOARCH` vocabulary, and
 * GoReleaser's archive names use a third vocabulary (`x86_64`, `armv7`, ...).
 * Both translations are spelled out explicitly below rather than guessed:
 *
 *   GOARCH   npm cpu    archive token
 *   -------- ---------- -------------
 *   amd64    x64        x86_64
 *   arm64    arm64      arm64
 *   arm      arm        armv6 / armv7   (npm has no ARM-version granularity)
 *   riscv64  riscv64    riscv64
 *   s390x    s390x      s390x
 *
 * `archive` below is the full GoReleaser archive basename produced by the
 * `archives[0].name_template` in .goreleaser.yaml
 * (`malikclaw_<Title Os>_<x86_64|arm64|armvN|...>`, `.zip` on Windows).
 * Do not change those names here; other tooling (brew tap, winget,
 * install.sh) parses them.
 */

/** npm packages are `@malikclaw/cli-<dir>`. */
const SCOPE = "@malikclaw";

/**
 * Custom manifest field the bin shim reads to locate the binary inside a
 * platform package. Keeping the path in the manifest means the layout can
 * change without shipping a new wrapper.
 */
const BINARY_FIELD = "malikclaw";

const PLATFORMS = [
  {
    dir: "linux-x64",
    package: "cli-linux-x64",
    os: ["linux"],
    cpu: ["x64"],
    archive: "malikclaw_Linux_x86_64.tar.gz",
    binary: "malikclaw",
  },
  {
    dir: "linux-arm64",
    package: "cli-linux-arm64",
    os: ["linux"],
    cpu: ["arm64"],
    archive: "malikclaw_Linux_arm64.tar.gz",
    binary: "malikclaw",
  },
  {
    // npm exposes a single `arm` cpu value, so one package must cover every
    // ARMv7 device as well. We therefore ship the GoReleaser `armv6` build:
    // ARMv7 CPUs execute ARMv6 user-mode code, but not the reverse, so v6 is
    // the only choice that cannot SIGILL on a Raspberry Pi Zero / 1.
    dir: "linux-arm",
    package: "cli-linux-arm",
    os: ["linux"],
    cpu: ["arm"],
    archive: "malikclaw_Linux_armv6.tar.gz",
    binary: "malikclaw",
  },
  {
    dir: "linux-riscv64",
    package: "cli-linux-riscv64",
    os: ["linux"],
    cpu: ["riscv64"],
    archive: "malikclaw_Linux_riscv64.tar.gz",
    binary: "malikclaw",
  },
  {
    dir: "linux-s390x",
    package: "cli-linux-s390x",
    os: ["linux"],
    cpu: ["s390x"],
    archive: "malikclaw_Linux_s390x.tar.gz",
    binary: "malikclaw",
  },
  {
    dir: "darwin-x64",
    package: "cli-darwin-x64",
    os: ["darwin"],
    cpu: ["x64"],
    archive: "malikclaw_Darwin_x86_64.tar.gz",
    binary: "malikclaw",
  },
  {
    dir: "darwin-arm64",
    package: "cli-darwin-arm64",
    os: ["darwin"],
    cpu: ["arm64"],
    archive: "malikclaw_Darwin_arm64.tar.gz",
    binary: "malikclaw",
  },
  {
    dir: "win32-x64",
    package: "cli-win32-x64",
    os: ["win32"],
    cpu: ["x64"],
    archive: "malikclaw_Windows_x86_64.zip",
    binary: "malikclaw.exe",
  },
  {
    dir: "freebsd-x64",
    package: "cli-freebsd-x64",
    os: ["freebsd"],
    cpu: ["x64"],
    archive: "malikclaw_Freebsd_x86_64.tar.gz",
    binary: "malikclaw",
  },
  {
    dir: "freebsd-arm64",
    package: "cli-freebsd-arm64",
    os: ["freebsd"],
    cpu: ["arm64"],
    archive: "malikclaw_Freebsd_arm64.tar.gz",
    binary: "malikclaw",
  },
];

/**
 * GoReleaser targets that are deliberately NOT published to npm.
 *
 * An archive matching one of these patterns is recognised and skipped quietly:
 * seeing it is expected. Anything else that cannot be mapped is a hard error in
 * build-npm-packages.js, so a genuine typo or a change to the archive
 * `name_template` still fails loudly instead of silently dropping a platform.
 */
const EXCLUDED_REASONS = [
  {
    pattern: /^malikclaw_Netbsd_/,
    reason:
      "NetBSD: npm's `os` matching relies on a supported Node.js runtime, and " +
      "there is no official Node build to install the wrapper with.",
  },
  {
    pattern: /_loong64\.(tar\.gz|zip)$/,
    reason:
      "loong64 is not a recognised npm `cpu` value, so a package declaring it " +
      "could never be selected by npm.",
  },
  {
    pattern: /_mipsle\.(tar\.gz|zip)$/,
    reason:
      "mipsle: npm spells this `mipsel`, and there are no official Node.js " +
      "mipsel releases to run the wrapper.",
  },
  {
    pattern: /^malikclaw_Linux_armv7\.tar\.gz$/,
    reason:
      "Superseded by the linux-arm package, which ships the ARMv6 build so it " +
      "runs on ARMv6 and ARMv7 alike.",
  },
  {
    pattern: /^malikclaw_Freebsd_armv[67]\.tar\.gz$/,
    reason: "FreeBSD/arm is out of the supported set; x64 and arm64 only.",
  },
  {
    pattern: /^malikclaw_Windows_arm64\.zip$/,
    reason:
      "Windows on ARM is built by GoReleaser but is not in the initial npm " +
      "set; grab it from the GitHub release or add a win32-arm64 entry to " +
      "PLATFORMS.",
  },
];

/** Archive basenames this module maps to a publishable package. */
const KNOWN_ARCHIVES = new Set(PLATFORMS.map((p) => p.archive));

/** Full npm package name for a platform entry. */
function packageName(entry) {
  return `${SCOPE}/${entry.package}`;
}

/** Look up the platform entry for a host (`process.platform`, `process.arch`). */
function forHost(platform, arch) {
  return (
    PLATFORMS.find((p) => p.os.includes(platform) && p.cpu.includes(arch)) ||
    null
  );
}

/** Why a GoReleaser archive is deliberately not published to npm, or null. */
function isExcluded(name) {
  return EXCLUDED_REASONS.find((e) => e.pattern.test(name)) || null;
}

/** The primary `malikclaw` binary for this host, respecting Windows suffix. */
function hostBinaryName(platform) {
  return platform === "win32" ? "malikclaw.exe" : "malikclaw";
}

module.exports = {
  SCOPE,
  BINARY_FIELD,
  PLATFORMS,
  EXCLUDED_REASONS,
  KNOWN_ARCHIVES,
  packageName,
  forHost,
  isExcluded,
  hostBinaryName,
};
