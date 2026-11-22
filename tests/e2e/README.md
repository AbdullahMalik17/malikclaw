# MalikClaw v2.0.0 — Opaque-Box E2E Verification Suite

Requirement-driven, opaque-box E2E test suite covering Requirements **R1–R4** across **Tiers 1–4** (60 total tests).

## Architecture

- **Language / Runtime:** Python 3.14 (`unittest` + `pytest`-compatible `test_*.py`, `pyyaml`, stdlib `urllib.request`).
- **Zero Go CI Interference:** Contains zero `.go` files so `go test ./...`, `go vet ./...`, and `golangci-lint` remain completely isolated. Cross-module Go contract tests compile temporary modules in `tempfile.TemporaryDirectory()` via `go.mod` `replace`.
- **Windows Safety:** Always uses `sys.executable` / `python` (never `python3`), stdlib `urllib.request` (never `curl.exe` or `node fetch`), and PowerShell AST parser (`[System.Management.Automation.Language.Parser]::ParseFile`).

## Files

| File | Purpose | Count |
|---|---|---:|
| `helpers.py` | Repo locator (`MALIKCLAW_E2E_REPO_ROOT`), cached GitHub REST client, GoReleaser 35-asset matrix generator, pure-Python PNG/GIF binary reader, isolated Go/CLI runners, Next.js build & `next start` lifecycle | — |
| `run_e2e.py` | Unified CLI runner with `--tier`, `--area`, `--json-report`, and `-v` | — |
| `test_tier1_feature_coverage.py` | Tier 1: Feature Coverage (6 each for R1–R4) | 24 |
| `test_tier2_boundaries.py` | Tier 2: Boundary, Corner-Case & Negative Checks (6 each for R1–R4) | 24 |
| `test_tier3_pairwise.py` | Tier 3: Cross-Feature Pairwise Contracts (`T3-01` .. `T3-07`) | 7 |
| `test_tier4_scenarios.py` | Tier 4: Real-World Acceptance Scenarios (`T4-01` .. `T4-05`) | 5 |
| **Total** | | **60** |

## Running the Suite

```powershell
# Unified runner (all 60 tests)
python tests/e2e/run_e2e.py -v

# Filter by tier or requirement area
python tests/e2e/run_e2e.py --tier 1 -v
python tests/e2e/run_e2e.py --area r2 -v
python tests/e2e/run_e2e.py --tier 4 --json-report e2e-report.json -v

# Standard pytest & unittest discovery
python -m pytest tests/e2e -v
python -m unittest discover -s tests/e2e -p "test_*.py" -v
```

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `MALIKCLAW_E2E_REPO_ROOT` | Repo root (`d:\WEB DEVELOPMENT\malikclaw`) | Override target repository path for isolated testing against temporary copies |
| `GITHUB_TOKEN` / `GH_TOKEN` | Unset | Optional GitHub REST API Bearer token to raise rate limit above 60 req/hr |
| `VERCEL_TEST_URL` | `https://malikclaw.vercel.app` | Live Vercel deployment URL override |
| `E2E_REQUIRE_LIVE_UPDATED` | `0` | Set to `1` to require `VERCEL_TEST_URL` to serve post-M2 release links live |
| `E2E_REQUIRE_CDN_DOWNLOAD` | `0` | Set to `1` to require direct binary download from `release-assets.githubusercontent.com` instead of `302` + API `sha256` digest + tagged source CLI verification when sandbox blocks CDN (`HTTP 403`) |
| `E2E_REQUIRE_EXTERNAL_URLS` | `0` | Set to `1` to require direct `HTTP 200` on external non-GitHub URLs (`mcpmarket.com`, `pkg.go.dev`) even behind sandbox policy proxies |

## 60-Test Matrix

### Tier 1 — Feature Coverage (24)
- **R1 (`TestTier1R1Release`, 6):** Clean git state & `v2.0.0` tag alignment; `.github/workflows/pr.yml` lint action semver & zero conflicts; `.goreleaser.yaml` v2 schema & no broken `winget` upload; `website/src/lib/version.ts` `v2.0.0`; `install.sh`/`install.ps1` release URLs match `.goreleaser.yaml` archives; live `api.github.com` `v2.0.0` release + CI/release workflows green + 35 uploaded assets.
- **R2 (`TestTier1R2Submissions`, 6):** `server.json` valid JSON & `2025-12-11` schema; `smithery.yaml` valid YAML & `configSchema`/`exampleConfig` consistency; `software-malikclaw.yml` valid YAML & `awesome-selfhosted-data` compliance; `mcp-directories.md` GEO word counts & valid CLI commands; `awesome-list-prs.md` 6 targets & accurate `v2.0.0` tag status; all 5 `docs/submissions/*` files free of `picoclaw`/`sipeed` leaks & using valid `https://` URLs.
- **R3 (`TestTier1R3Marketing`, 6):** `MARKETING_CAMPAIGN_V2.md` 10 required sections; Show HN title `<=80` chars & hook `<=12` words; all 9 X/Twitter tweets `<=280` chars; Product Hunt tagline `<=60` chars, short desc `<=260` chars & 5 slides; 14-day launch calendar Days 1–14 complete with zero unexpected placeholders in Days 1–13; all 4 visual assets verified via raw PNG IHDR / GIF89a headers.
- **R4 (`TestTier1R4Website`, 6):** `npx tsc --noEmit` exits 0; `npm run lint` exits 0; `npm run build` exits 0 & creates `.next/BUILD_ID`; self-contained `website/docs/` exists; `.next/server/app/` prerendered HTML for static routes, `STATIC_MAPPING` doc routes, and 12 `/docs/channels/*` routes; `website/package.json` `2.0.0`, `version.ts` `v2.0.0`, and `DEPLOYMENT.md` documents `GEMINI_API_KEY`.

### Tier 2 — Boundary & Negative Cases (24)
- **R1 (`TestTier2R1Boundaries`, 6):** Compiled CLI `version` vs `--invalid-e2e-flag`; installer/demo version flags executed on built CLI; `demo.sh` avoids unsupported `agent --timeout`; `install.ps1` PowerShell AST + `-Help` exit 0; isolated `HOME`/`MALIKCLAW_HOME` leaves real `~/.malikclaw` untouched; no `malikclaw_amd64.deb` or raw archive naming leaks.
- **R2 (`TestTier2R2Boundaries`, 6):** `server.json` description `<=100` chars & strict SemVer; `software-malikclaw.yml` description `<=250` chars, uppercase start, trailing `.`, zero promo words; zero stale `v0.2.x`/`M6` claims in `docs/submissions/*`; gated manifests absent at repo root while `malikclaw mcp serve` is absent; immediate vs gated distinction; zero unresolved placeholders in Part A immediate blocks.
- **R3 (`TestTier2R3Boundaries`, 6):** X/Twitter UTF-8/RTL Tweet 8 & tight 277–279 boundaries; zero `v0.2.x` or `picoclaw` leaks in `MARKETING_CAMPAIGN_V2.md`; `README.md`/`README.ur.md` local image resolution; `render-banners.ps1` PowerShell AST check; zero forbidden `HowTo`/`FAQPage`/`FID` recommendations; visual assets `>10KB` & valid magic bytes.
- **R4 (`TestTier2R4Boundaries`, 6):** Unknown route `/docs/nonexistent-e2e-probe` -> 404; `/api/chat` malformed JSON -> 500 without crash; `/api/chat` empty API key clean error & healthy `/`; zero `malikclaw_amd64.deb` or raw `malikclaw_Linux_arm64` links in built `.next` HTML/JS; `robots.txt`, `sitemap.xml`, `llms.txt`, `manifest.json`, `sw.js`, `favicon.ico` & 9 `/assets/*` -> 200; zero `v0.2.` stale strings in `website/`.

### Tier 3 — Cross-Feature Pairwise (7)
- `T3-01`: `install.sh` & `install.ps1` <-> `.goreleaser.yaml` <-> live `v2.0.0` release assets.
- `T3-02`: `website/` download pages & built `.next` HTML/JS <-> `.goreleaser.yaml` <-> live `v2.0.0` release assets.
- `T3-03`: `docs/submissions/mcp-directories.md` JSON snippet <-> Go `pkg/config.LoadConfig` + `Tools.MCP` contract.
- `T3-04`: `docs/submissions/smithery.yaml` env vars <-> `pkg/config` & `cmd/` bound `MALIKCLAW_*` env tags.
- `T3-05`: `docs/submissions/server.json` OCI tag (`:v2.0.0`) <-> `.goreleaser.yaml` `dockers_v2` tags.
- `T3-06`: `docs/MARKETING_CAMPAIGN_V2.md` Go snippet (`agentloop`), `pkg/security`/`pkg/routing` symbols, 21 channels, installer scripts & `website/src/app/layout.tsx` OG `1200x630`.
- `T3-07`: `docs/submissions/software-malikclaw.yml` `website_url` & `documentation_url` <-> `website/` built routes.

### Tier 4 — End-to-End Real-World Scenarios (5)
- `T4-01`: Adopter Installer & Isolated CLI Flow.
- `T4-02`: Maintainer `v2.0.0` Release, CI & Tag Audit.
- `T4-03`: Ecosystem Curator Submissions Audit.
- `T4-04`: Launch Operator Marketing Kit Audit.
- `T4-05`: Web Operator Full Build, `next start` 34-Route Sitemap Sweep & Live Vercel / Deployment Package Audit.
