#!/usr/bin/env node
"use strict";

/**
 * Consistency checks for the npm packaging layer - no network, no build tools.
 *
 *   node npm/scripts/verify.js
 *
 * 1. The hard-coded SUPPORTED table in npm/cli/bin/malikclaw.js stays in sync
 *    with PLATFORMS in platforms.js (the shim cannot require() platforms.js:
 *    it is not part of the published wrapper's `files`).
 * 2. Every npm/platforms/<dir>/package.json exists and agrees with platforms.js
 *    on name, os, cpu, and the `malikclaw` binary-path field the shim reads.
 * 3. The wrapper's optionalDependencies either pin every platform package at
 *    one exact version (post-packaging) or are still empty (committed state).
 */

const fs = require("node:fs");
const path = require("node:path");
const {
  PLATFORMS,
  BINARY_FIELD,
  packageName,
} = require("./platforms.js");

const NPM_ROOT = path.resolve(__dirname, "..");
const problems = [];
const err = (m) => problems.push(m);

// 1. shim SUPPORTED table -----------------------------------------------
const shimSrc = fs.readFileSync(path.join(NPM_ROOT, "cli", "bin", "malikclaw.js"), "utf8");
const match = shimSrc.match(/const SUPPORTED = \[[\s\S]*?\];/);
if (!match) err("could not find `const SUPPORTED = [...]` in npm/cli/bin/malikclaw.js");
else {
  // The literal is plain data; evaluating it keeps this check honest without
  // exporting internals from a shebang'd bin script.
  const literal = match[0].slice(match[0].indexOf("["), match[0].lastIndexOf("]") + 1);
  const supported = new Function(`return ${literal};`)();
  const expected = new Map();
  for (const p of PLATFORMS) {
    for (const o of p.os) {
      if (!expected.has(o)) expected.set(o, new Set());
      for (const c of p.cpu) expected.get(o).add(c);
    }
  }
  const got = new Map(supported.map((s) => [s.os, new Set(s.cpus)]));
  for (const [o, cpus] of expected) {
    const g = got.get(o);
    if (!g) err(`shim SUPPORTED is missing os "${o}"`);
    else for (const c of cpus) if (!g.has(c)) err(`shim SUPPORTED is missing ${o}-${c}`);
  }
  for (const [o, cpus] of got) {
    const e = expected.get(o);
    if (!e) err(`shim SUPPORTED lists unknown os "${o}" not in platforms.js`);
    else for (const c of cpus) if (!e.has(c)) err(`shim SUPPORTED lists unknown ${o}-${c} not in platforms.js`);
  }
}

// 2. platform manifests ---------------------------------------------------
for (const p of PLATFORMS) {
  const file = path.join(NPM_ROOT, "platforms", p.dir, "package.json");
  if (!fs.existsSync(file)) {
    err(`missing ${file}`);
    continue;
  }
  let m;
  try {
    m = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    err(`${file} is not valid JSON: ${e.message}`);
    continue;
  }
  if (m.name !== packageName(p)) err(`${file}: name should be ${packageName(p)}`);
  if (JSON.stringify(m.os) !== JSON.stringify(p.os)) err(`${file}: os should be ${JSON.stringify(p.os)}`);
  if (JSON.stringify(m.cpu) !== JSON.stringify(p.cpu)) err(`${file}: cpu should be ${JSON.stringify(p.cpu)}`);
  if (m[BINARY_FIELD] !== `bin/${p.binary}`) err(`${file}: ${BINARY_FIELD} should be "bin/${p.binary}"`);
  if (!/^\d+\.\d+\.\d+/.test(m.version || "")) err(`${file}: bad version ${m.version}`);
  if (m[BINARY_FIELD] && !m.files?.some((f) => f.startsWith("bin"))) err(`${file}: files must include bin/`);
  if (m.scripts?.prepublishOnly !== "node ../../scripts/check-publish.js") {
    err(`${file}: scripts.prepublishOnly must be "node ../../scripts/check-publish.js"`);
  }
}

// 3. wrapper optionalDependencies & zero-dependency invariant -------------
const wrapper = JSON.parse(fs.readFileSync(path.join(NPM_ROOT, "cli", "package.json"), "utf8"));
if (Object.keys(wrapper.dependencies || {}).length > 0) {
  err(`wrapper must have no runtime dependencies, got: ${Object.keys(wrapper.dependencies).join(", ")}`);
}
if (wrapper.scripts?.prepublishOnly !== "node ../scripts/check-publish.js") {
  err(`wrapper scripts.prepublishOnly must be "node ../scripts/check-publish.js"`);
}
const deps = wrapper.optionalDependencies || {};
const names = Object.keys(deps).sort();
const all = PLATFORMS.map(packageName).sort();
if (names.length && JSON.stringify(names) !== JSON.stringify(all)) {
  err(`wrapper optionalDependencies must cover exactly:\n  ${all.join("\n  ")}`);
}
const versions = new Set(names.map((n) => deps[n]));
if (versions.size > 1) err(`wrapper pins must all be the same version, got: ${[...versions].join(", ")}`);
if (names.length && wrapper.version !== [...versions][0]) {
  err(`wrapper version ${wrapper.version} must equal its platform pins ${[...versions][0]}`);
}

if (problems.length) {
  console.error(`verify: ${problems.length} problem(s)\n - ${problems.join("\n - ")}\n`);
  process.exit(1);
}
console.log(
  `verify: OK (${PLATFORMS.length} platform packages, shim table in sync, wrapper pins consistent).`
);
