# MalikClaw on npm

How `npm install -g malikclaw` works, which platforms are covered, and how the
packages are built and published.

## Layout

```
npm/
├── cli/                      # the `malikclaw` wrapper package
│   ├── package.json          # version 0.0.0 in git; packager rewrites it at release
│   └── bin/malikclaw.js      # dependency-free CJS shim: resolve → spawnSync → exit
├── platforms/                # one package per os/cpu, e.g. @malikclaw/cli-linux-x64
│   └── <os>-<cpu>/package.json + bin/malikclaw[.exe] (bin/ is gitignored)
└── scripts/
    ├── platforms.js          # single source of truth: GoReleaser archive → npm package
    ├── build-npm-packages.js # extracts GoReleaser archives into the packages above
    └── verify.js             # consistency checks (shim table ↔ platforms.js ↔ manifests)
```

## What gets installed

`malikclaw` declares every `@malikclaw/cli-<os>-<cpu>` package in
`optionalDependencies` at the exact same version. npm evaluates each one's
`os`/`cpu` manifest fields against the host and installs **exactly one**; the
rest are skipped as "not supported on this platform", which is expected, not
an error. Users download one Go binary, nothing is fetched at install time,
there is no `postinstall`, and `npm install --ignore-scripts` works.

The shim resolves the binary as:
`$MALIKCLAW_BIN` → `$MALIKCLAW_PKG` package → the `malikclaw` field of the
matching `@malikclaw/cli-<process.platform>-<process.arch>` package →
`bin/malikclaw[.exe]` inside it. It spawns with `stdio: "inherit"` (so the
agent/TUI keeps the real terminal), forwards all argv, propagates the exit
code, and re-raises fatal signals (SIGINT/SIGTERM → `128+signum`). Missing
platform packages produce an actionable message, never a stack trace.

## Platform coverage (os / cpu as npm sees them)

| npm package                  | `os`       | `cpu`     | GoReleaser archive               |
| ---------------------------- | ---------- | --------- | -------------------------------- |
| `@malikclaw/cli-linux-x64`   | linux      | x64       | `malikclaw_Linux_x86_64.tar.gz`  |
| `@malikclaw/cli-linux-arm64` | linux      | arm64     | `malikclaw_Linux_arm64.tar.gz`   |
| `@malikclaw/cli-linux-arm`   | linux      | arm       | `malikclaw_Linux_armv6.tar.gz`   |
| `@malikclaw/cli-linux-riscv64` | linux    | riscv64   | `malikclaw_Linux_riscv64.tar.gz` |
| `@malikclaw/cli-linux-s390x` | linux      | s390x     | `malikclaw_Linux_s390x.tar.gz`   |
| `@malikclaw/cli-darwin-x64`  | darwin     | x64       | `malikclaw_Darwin_x86_64.tar.gz` |
| `@malikclaw/cli-darwin-arm64` | darwin    | arm64     | `malikclaw_Darwin_arm64.tar.gz`  |
| `@malikclaw/cli-win32-x64`   | win32      | x64       | `malikclaw_Windows_x86_64.zip`   |
| `@malikclaw/cli-freebsd-x64` | freebsd    | x64       | `malikclaw_Freebsd_x86_64.tar.gz` |
| `@malikclaw/cli-freebsd-arm64` | freebsd  | arm64     | `malikclaw_Freebsd_arm64.tar.gz` |

npm's `cpu` vocabulary differs from `GOARCH` (`amd64`→`x64`, `arm`+v6/v7→`arm`)
and the archive names use a third spelling (`x86_64`, `armv6`). Every
translation is explicit in [`scripts/platforms.js`](scripts/platforms.js).

`linux-arm` ships the **ARMv6** build on purpose: npm has no ARM-version
granularity, ARMv7 CPUs run ARMv6 userland code, but not the reverse — a v7
binary would SIGILL on a Pi Zero/1.

## GoReleaser targets deliberately NOT on npm

| Target | Why absent |
| ------ | ---------- |
| NetBSD (any arch) | No official Node.js builds for NetBSD, so the wrapper itself cannot be installed there. |
| `loong64` (linux/windows/darwin) | `loong64` is not a valid npm `cpu` value; a package declaring it could never be selected. |
| `mipsle` | npm spells it `mipsel` and there are no official Node.js mipsel releases. |
| `Windows_arm64` | Built by GoReleaser, but not in the initial npm set; use the GitHub release. Adding `win32-arm64` to `PLATFORMS` is a one-entry change. |
| `Linux_armv7` / `Freebsd_armv6/7` | Superseded/out of scope: `linux-arm` covers ARMv6+ARMv7; FreeBSD is x64/arm64 only. |
| `malikclaw-launcher`, `malikclaw-launcher-tui` | The npm packages ship only the primary `malikclaw` binary; the desktop launcher ships via archives, brew, winget, Docker. |

Everything else from the release (including the excluded targets above) stays
available on the [GitHub releases page](https://github.com/AbdullahMalik17/malikclaw/releases).

## Building and publishing

The packager is driven entirely by GoReleaser's release artifacts — run it
against a `dist/` (or a `gh release download` directory):

```sh
node npm/scripts/build-npm-packages.js --version 0.2.4 --dir dist
node npm/scripts/verify.js
npm publish npm/platforms/linux-x64   # ...one per platform, FIRST
npm publish npm/cli                   # wrapper LAST
```

- `--only <dir,...>` builds a subset (local smoke tests).
- Missing archives in full mode, or an unmappable `.tar.gz`/`.zip` name (e.g.
  someone edited the archive `name_template`), fail loudly.
- Versions and `optionalDependencies` pins are rewritten on every run; output
  is deterministic/idempotent.

CI: the `npm` job in
[`.github/workflows/release.yml`](../.github/workflows/release.yml) runs after
the `release` job, downloads the fresh archives, runs the packager and
publishes with `--provenance` using `NPM_TOKEN`. Do not publish manually.

## Local end-to-end check (no publish)

```sh
go build -o /tmp/malikclaw.exe ./cmd/malikclaw
mkdir -p /tmp/npm-dist && (cd /tmp && /c/Windows/System32/tar.exe -a -cf /tmp/npm-dist/malikclaw_Windows_x86_64.zip malikclaw.exe)
node npm/scripts/build-npm-packages.js --version 0.0.0-smoke --dir /tmp/npm-dist --only win32-x64
# imitate the npm-installed layout:
mkdir -p npm/cli/node_modules/@malikclaw
powershell -NoProfile -Command "New-Item -ItemType Junction -Path npm\cli\node_modules\@malikclaw\cli-win32-x64 -Target npm\platforms\win32-x64"
node npm/cli/bin/malikclaw.js version
```

## Conventions

- Committed platform/wrapper manifests keep `"version": "0.0.0"` and empty
  `optionalDependencies`; only the packager (in CI) materializes real values.
- Never add dependencies to `bin/malikclaw.js` — it must run on bare Node ≥18.
- `.goreleaser.yaml`'s archive `name_template` is a contract: brew, winget and
  `install.sh` parse those names; `platforms.js` mirrors them, do not rename.
