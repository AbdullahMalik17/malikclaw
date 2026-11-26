#!/usr/bin/env node
"use strict";

/**
 * Pre-publish safety guard for both `npm/cli` and `npm/platforms/*`.
 *
 * Wired via `"prepublishOnly"` so `npm publish` refuses to ship:
 *   - template manifests still at version `0.0.0`
 *   - `malikclaw` without populated `optionalDependencies` (or with accidental runtime `dependencies`)
 *   - `@malikclaw/cli-*` without a real, non-empty native binary on disk
 */

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  SCOPE,
  BINARY_FIELD,
  PLATFORMS,
  packageName,
} = require("./platforms.js");

function fail(lines) {
  const msg = Array.isArray(lines) ? lines.join("\n") : String(lines);
  console.error(`\ncheck-publish: ${msg}\n`);
  process.exit(1);
}

// 1. Run global packaging consistency checks first.
const verifyRes = spawnSync(
  process.execPath,
  [path.join(__dirname, "verify.js")],
  { stdio: "inherit" }
);
if (verifyRes.status !== 0) {
  fail("verify.js failed; aborting publish.");
}

// 2. Inspect the specific package directory currently being published.
const pkgDir = process.cwd();
const manifestPath = path.join(pkgDir, "package.json");
if (!fs.existsSync(manifestPath)) {
  fail(`no package.json found in ${pkgDir}`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

if (!manifest.version || manifest.version === "0.0.0") {
  fail([
    `refusing to publish ${manifest.name}@${manifest.version || "(unset)"}.`,
    `"0.0.0" is the committed template placeholder.`,
    "Build the release packages first:",
    "  node npm/scripts/build-npm-packages.js --version <semver> --dir <dist>",
  ]);
}

if (manifest.name === "malikclaw") {
  const runtimeDeps = Object.keys(manifest.dependencies || {});
  if (runtimeDeps.length > 0) {
    fail([
      `refusing to publish "malikclaw" with runtime dependencies (${runtimeDeps.join(", ")}).`,
      "bin/malikclaw.js must remain zero-dependency on bare Node >=18.",
    ]);
  }

  const optDeps = manifest.optionalDependencies || {};
  const optNames = Object.keys(optDeps).sort();
  const expectedNames = PLATFORMS.map(packageName).sort();
  if (optNames.length === 0) {
    fail([
      `refusing to publish "malikclaw" with empty optionalDependencies!`,
      "Publishing now would ship the JS wrapper without any @malikclaw/cli-* native binary packages.",
      "",
      "Fix:",
      "  1. node npm/scripts/build-npm-packages.js --version <semver> --dir <dist>",
      "  2. Publish every ./npm/platforms/* package FIRST (--access public)",
      "  3. Publish ./npm/cli LAST",
    ]);
  }
  if (JSON.stringify(optNames) !== JSON.stringify(expectedNames)) {
    fail([
      `"malikclaw" optionalDependencies do not match PLATFORMS in scripts/platforms.js.`,
      `Expected: ${expectedNames.join(", ")}`,
      `Got:      ${optNames.join(", ")}`,
    ]);
  }

  console.log(
    `check-publish: OK (${manifest.name}@${manifest.version} pins ${optNames.length} platform packages).`
  );
  process.exit(0);
}

const platformEntry = PLATFORMS.find((p) => packageName(p) === manifest.name);
if (platformEntry) {
  const relBin = manifest[BINARY_FIELD];
  if (typeof relBin !== "string" || !relBin) {
    fail(`${manifest.name} is missing the "${BINARY_FIELD}" binary field.`);
  }
  const binPath = path.resolve(pkgDir, relBin);
  let stat;
  try {
    stat = fs.statSync(binPath);
  } catch {
    stat = null;
  }
  if (!stat || !stat.isFile() || stat.size === 0) {
    fail([
      `refusing to publish ${manifest.name}@${manifest.version}: native binary is missing or empty.`,
      `Expected file: ${binPath}`,
      "",
      "Populate platform binaries first:",
      "  node npm/scripts/build-npm-packages.js --version <semver> --dir <dist>",
    ]);
  }

  console.log(
    `check-publish: OK (${manifest.name}@${manifest.version}, binary ${relBin} = ${stat.size} bytes).`
  );
  process.exit(0);
}

fail(
  `unrecognised package "${manifest.name}" (expected "malikclaw" or "${SCOPE}/cli-*").`
);
