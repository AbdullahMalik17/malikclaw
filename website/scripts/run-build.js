const { spawnSync } = require("node:child_process");
const path = require("node:path");

const env = { ...process.env };
if (process.platform === "win32") {
  const fixPath = path.join(__dirname, "win-mkdir-fix.cjs").replace(/\\/g, "/");
  const flag = `--require "${fixPath}"`;
  env.NODE_OPTIONS = env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ${flag}` : flag;
}

const nextBin = require.resolve("next/dist/bin/next");
const result = spawnSync(process.execPath, [nextBin, "build", ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
});

process.exit(result.status ?? 1);
