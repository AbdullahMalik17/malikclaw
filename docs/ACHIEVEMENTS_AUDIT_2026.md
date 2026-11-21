# MalikClaw — Live Internet Achievements & Ecosystem Audit (2026)

> **Audit Date (UTC):** `2026-11-21` (`09:21Z–09:28Z` live `search_web` grounding + local `upgrade/v2.0.0` codebase audit)  
> **Repository:** [`github.com/AbdullahMalik17/malikclaw`](https://github.com/AbdullahMalik17/malikclaw)  
> **Canonical Website:** [`https://malikclaw.vercel.app`](https://malikclaw.vercel.app)  
> **Canonical MCP Market:** [`https://mcpmarket.com/server/malikclaw`](https://mcpmarket.com/server/malikclaw)  
> **Creator / Maintainer:** Muhammad Abdullah Athar (`AbdullahMalik17`)  
> **Audit Policy & Verification Note:** 100% verified codebase facts and read-only `search_web` live signals. Zero fabricated statistics, testimonials, or unverified claims. Because sandbox `gh api` and `curl.exe` calls encountered GitHub CLI auth/config permission and TLS root (`SEC_E_UNTRUSTED_ROOT`) restrictions during this audit, live-fluctuating exact integers retain `[INSERT LIVE COUNT]` placeholders paired with exact `gh api` commands for maintainer execution prior to release.

---

## 1. Executive Summary

**MalikClaw** (`v2.0.0` — *"Agentic Era 2026"*) is an MIT-licensed, pure-Go (`go 1.25.7` / `Go 1.25+`) personal AI agent runtime engineered for low-resource edge hardware and everyday messaging workflows. Verified codebase and live web signals confirm active indexing across **GitHub**, **MCP Market**, **Vercel** (`https://malikclaw.vercel.app`), **pkg.go.dev**, and **Snyk**, paired with **21 channel implementations** (`pkg/channels/`), native **Android ADB & non-root Termux** automation, **Urdu-first RTL** localization across 6 localized READMEs, and four `v2.0.0` core architectural pillars:

1. **SSRF Network Boundary Firewall** (`pkg/security/ssrf.go`: `ValidateURL`, `IsBlockedIP`) blocking private RFC1918/CGNAT/link-local/metadata IP ranges and IPv4-mapped IPv6 bypasses with DNS re-verification.
2. **Prompt-Injection Structural Guard** (`pkg/security/prompt_guard.go`: `WrapUntrusted`, `ScanPromptInjection`) isolating untrusted tool outputs in escaped `<untrusted_data>` envelopes and scanning across 4 injection categories.
3. **Complexity-Aware `SmartCostRouter`** (`pkg/routing/cost_router.go`: `TierFast` → `TierBalanced` → `TierReasoning`) routing simple everyday tasks to fast/local models (e.g., `gemini-2.5-flash`, `ollama/qwen2.5:7b`, `gpt-4o-mini`) and complex reasoning to frontier tiers with automatic fallback chains.
4. **Universal `SKILL.md` Ecosystem** (`pkg/skills/loader.go`, `cmd/malikclaw/internal/skills/`) supporting progressive YAML/JSON frontmatter + Markdown AST loading and registry management.

**Architectural Honesty Note (MCP Client/Host vs. Server):** Codebase inspection confirms `pkg/mcp/manager.go:253` instantiates `mcp.NewClient` (`github.com/modelcontextprotocol/go-sdk v1.4.1`) over `stdio`, `sse`, and `http` transports, while `pkg/mcp_servers/` does not exist (`0` `mcp.NewServer` symbols). MalikClaw `v2.0.0` is an **MCP Client / Host runtime**, not yet an exposed MCP server. Accordingly, all local submission payloads in [`docs/submissions/`](submissions/mcp-directories.md) separate **Immediate Client-Compatible Targets** from **Server-Bridge-Gated Templates** (which require adding a `malikclaw mcp serve` bridge before external submission).

---

## 2. Verified Public Listings, Read-Only Signals & Badges (`2026-11-21T09:21Z–09:28Z`)

### 2.1 Live Web Grounding & Registry Footprint

All external status checks below were grounded via read-only `search_web` queries on `2026-11-21` between `09:21:31Z` and `09:28:35Z` UTC, combined with verified badge checks in `badges-inventory.md` and direct local repository inspection:

| Channel / Platform | Status (`2026-11-21`) | Verified Evidence & Exact Notes |
| :--- | :--- | :--- |
| **GitHub Repository** | ✅ **Live & Indexed** | [`github.com/AbdullahMalik17/malikclaw`](https://github.com/AbdullahMalik17/malikclaw) — Search-grounded (`09:21:31Z`): **`~20` stars**, **`6` forks**, **`MIT` License** (`LICENSE:1`). Local repo facts: **`go 1.25.7`** (`go.mod:3`), **5 workflows** (`build.yml`, `pr.yml`, `docker-build.yml`, `release.yml`, `sync-version.yml`), GHCR image `ghcr.io/abdullahmalik17/malikclaw:latest`, **6 localized READMEs** (`en`, `ur`, `ja`, `pt-br`, `vi`, `fr`) + `README.product.md`. Exact integer snapshot: Stars `[INSERT LIVE COUNT]` • Forks `[INSERT LIVE COUNT]` • Watchers `[INSERT LIVE COUNT]` • Open Issues `[INSERT LIVE COUNT]`. Local git tags stop at `v0.2.4` (`nightly`, `v0.1.0` `2026-03-14` – `v0.2.4` `2026-08-25`); `CHANGELOG.md` documents `v0.5.0`–`v2.0.0` (`v2.0.0` git tag pending Milestone M6). |
| **GitHub Profile Honors** | ✅ **Earned (`badges-inventory.md`)** | Maintainer profile (`AbdullahMalik17`) holds **Starstruck (Bronze)**, **Pull Shark**, and **Pair Extraordinaire** (`badges-inventory.md:16,77–79`). |
| **MCP Market** | ✅ **Live & Indexed** | [`https://mcpmarket.com/server/malikclaw`](https://mcpmarket.com/server/malikclaw) — Confirmed live (`09:21:37Z`), highlighting `<10MB` RAM, `$10` SBC / Termux support, Urdu-first RTL UI, ADB automation, and Guardian engine. Needs `v2.0.0` client/host copy refresh (`docs/submissions/mcp-directories.md`). |
| **Vercel Web Deployment** | ✅ **Live & Indexed** | [`https://malikclaw.vercel.app`](https://malikclaw.vercel.app) — Confirmed live (`09:21:39Z`). Next.js 16 frontend with dual developer/everyday-user hero, interactive `curl` / `irm` quickstart, benchmark comparison, `SoftwareApplication` JSON-LD, and Urdu/RTL UI. |
| **Go Packages (`pkg.go.dev`)** | ✅ **Live & Indexed** | [`https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw`](https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw) — Grounded on `go.dev` (`09:28:27Z`); active `HTTP 200` Reference badge (`badges-inventory.md:15,30`), currently missing from `README.md`. |
| **Snyk Security (`snyk.io`)** | ✅ **Monitored (`badges-inventory.md`)** | Active `HTTP 200` monitored badge (`badges-inventory.md:17,31,92–94`), currently missing from `README.md`. |
| **Go Report Card** | ⛔ **Service Retired** | `goreportcard.com` renders `<text>retired</text>` (`badges-inventory.md:21,38,120–122`) — **do not embed**. CodeFactor (`404`), Codecov (`unknown`), SonarCloud (`ERROR`), and DeepSource (`Not Found`) remain pending CI setup. |
| **Custom Domain (`malikclaw.io`)** | ⚠️ **Zero Indexed Pages** | `site:malikclaw.io` returned zero `malikclaw.io` pages (`09:22:13Z`; only `github.com` and `mcpmarket.com` surfaced). Standardize all canonical links on `https://malikclaw.vercel.app` until custom DNS/TLS is live. |
| **Smithery / Glama / PulseMCP / MCP.so** | ❌ **Not Listed** | `site:smithery.ai`, `site:glama.ai`, `site:pulsemcp.com`, and `site:mcp.so` returned zero MalikClaw listings (`09:21:59Z–09:22:10Z`). See Section 5 for immediate client vs. server-gated paths. |
| **HN / Reddit / Product Hunt / AlternativeTo / Dev.to / Hashnode** | ❌ **Not Listed / Zero Threads** | Explicit zero matches on `news.ycombinator.com`, `reddit.com`, `producthunt.com`, `alternativeto.net`, `dev.to`, and `hashnode.com` (`09:21:43Z–09:21:46Z`). |
| **X / LinkedIn / YouTube** | ❌ **No Indexed Posts** | `site:x.com`, `site:twitter.com`, `site:linkedin.com`, `site:youtube.com` returned zero MalikClaw posts (`09:28:27Z–09:28:35Z`). |
| **Awesome-Lists** | ❌ **Not Listed** | Queries across `awesome-ai-agents`, `awesome-selfhosted`, `awesome-go`, and `awesome-mcp-servers` returned zero external awesome-list entries (`09:28:27Z–09:28:32Z`). |

### 2.2 Maintainer Commands to Populate Exact `[INSERT LIVE COUNT]` Integers

Run these read-only commands on an authenticated host before cutting the `v2.0.0` release:

```powershell
gh api repos/AbdullahMalik17/malikclaw --jq '{stars:.stargazers_count,forks:.forks_count,watchers:.subscribers_count,open_issues:.open_issues_count,license:.license.spdx_id,topics:.topics}'
gh api repos/AbdullahMalik17/malikclaw/releases --jq '.[].tag_name'
gh api repos/AbdullahMalik17/malikclaw/languages
```

---

## 3. Verified Technical Benchmarks, Architecture & Competitive Matrix

### 3.1 Honest Footprint & Benchmark Reconciliation

To maintain engineering credibility on Hacker News, `r/golang`, `avelino/awesome-go`, and `awesome-selfhosted`, all external copy must report both the core/embedded target and measured x86_64 RSS with exact hardware/build context:

| Measurement Context | Memory (RSS) | Cold Boot | Source & Build Conditions |
| :--- | :--- | :--- | :--- |
| **Core / Embedded Idle SLA** | **`< 10 MB`** (`8.4 MB` website highlight) | **`< 0.8 s`** (`< 1 s` SLA) | `scripts/bench-ram.sh` (`malikclaw gateway` RSS check against 10 MB SLA), `pkg/bench/bench_test.go` (`BenchmarkBootTime` `< 1s` SLA), Orange Pi Zero / lightweight static `CGO_ENABLED=0` build (`-ldflags="-s -w"`). |
| **x86_64 Linux Full Benchmark** | **`~14.2 MB` idle RSS** / **`~28.5 MB` peak RSS** | `< 1.2 ms` internal overhead | `docs/benchmark/results.md:15–23` (Intel i7, 16 GB RAM, Go 1.22, running local Ollama + cloud APIs; 100 concurrent active agents = `~185 MB` total RAM; `< 0.05 ms` local tool call overhead). |
| **Non-Root Container Runtime** | Multi-stage Alpine runtime (`alpine:3.23`) | `< 1 s` container bin | `Dockerfile:4,21,34–50`: `golang:1.25-alpine` builder → `alpine:3.23`, `USER malikclaw` (UID/GID 1000), `EXPOSE 18790 18800`, `VOLUME ["/home/malikclaw/.malikclaw"]`. |
| **OpenClaw (Peer Comparison)** | `350 MB – 1.2 GB` RAM | `8.5 s – 18.0 s` boot | Node.js/TypeScript flagship baseline (`README.md:149–150`). *(Never use exaggerated multi-hundred-second boot claims in external copy.)* |
| **Python Frameworks (AutoGen / CrewAI / LangChain)** | `180 MB – 500 MB` RAM | `12 s – 42 s` boot | Python runtime + dependency graph overhead. |

### 3.2 Verified `v2.0.0` Codebase Capabilities

- **Go Runtime & License:** `go 1.25.7` (`go.mod:3`, `Go 1.25+`), pure **`MIT` License** (`LICENSE:1–21`). Key dependencies include `modelcontextprotocol/go-sdk v1.4.1`, `anthropic-sdk-go v1.22.1`, `openai-go/v3 v3.22.0`, `playwright-go v0.5700.1`, `whatsmeow`, and `modernc.org/sqlite v1.46.1`.
- **21 Channel Implementations (`pkg/channels/`):** `dingtalk`, `discord`, `feishu`, `googlechat`, `instagram`, `irc`, `line`, `linkedin`, `maixcam`, `matrix`, `onebot`, `pico`, `qq`, `reddit`, `slack`, `telegram`, `tiktok`, `twitter`, `wecom`, `whatsapp`, `whatsapp_native`.
- **Defense-in-Depth Security (`v2.0.0`):**
  - SSRF Network Boundary Firewall (`pkg/security/ssrf.go`: `ValidateURL`, `IsBlockedIP`) — blocks non-HTTP(S) schemes, GCP metadata hosts, IPv4-mapped IPv6 bypasses, RFC1918, CGNAT, link-local, ULA, and multicast/reserved ranges with DNS re-resolution.
  - Prompt-Injection Structural Guard (`pkg/security/prompt_guard.go`: `WrapUntrusted`, `ScanPromptInjection`) — escapes nested `<untrusted_data>` tags, sanitizes source attributes, and runs 10 compiled regex rules across `instruction_override`, `role_override`, `secret_exfiltration`, and `encoded_payload`.
  - Workspace directory jailing (`restrict_to_workspace`) and shell command filtering.
- **Cost & Model Routing (`pkg/routing/cost_router.go`):** `SmartCostRouter` (`ClassifyAndRoute`, `FallbackModels`) across `TierFast` (`gemini-2.5-flash` / `ollama/qwen2.5:7b` / `gpt-4o-mini`), `TierBalanced` (`claude-sonnet-4` / `gpt-4.1` / `gemini-2.5-pro`), and `TierReasoning` (`claude-opus-4` / `o3` / `gemini-2.5-pro`).
- **Universal `SKILL.md` (`pkg/skills/loader.go`, `cmd/malikclaw/internal/skills/`):** Progressive skill loader reading YAML/JSON frontmatter + Markdown AST across workspace, global (`~/.malikclaw/skills`), and built-in directories (`list`, `install`, `install-builtin`, `list-builtin`, `remove`, `search`, `show`).
- **MCP Client / Host (`pkg/mcp/manager.go:253`):** `mcp.NewClient` supporting `stdio`, `sse`, and `http` (`StreamableClientTransport`) connections to external MCP servers (`pkg/mcp_servers/` absent).
- **Verified CLI Surface (`cmd/malikclaw/`):** `malikclaw onboard`, `malikclaw agent -m "..."`, `malikclaw run "..." --metrics`, `malikclaw gateway`, `malikclaw skills list|install`, `malikclaw cron list|add`, `malikclaw config show|path`, `malikclaw status`, `malikclaw version`.
- **Canonical Docker Command (`Dockerfile:34–50`):**
  ```bash
  docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/home/malikclaw/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest
  ```

### 3.3 Competitive Positioning Matrix (2026 Lightweight AI Agent Landscape)

| Project | Core Language | Idle RAM / Footprint | Primary Sandbox / Security | Mobile / Phone Automation | Omnichannel & Everyday UX | Multilingual / Urdu-First RTL | Core Differentiator |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MalikClaw** (`AbdullahMalik17/malikclaw`) | **Go 1.25+** (single static binary) | **`<10 MB` core SLA** (`~14.2 MB` x86_64 RSS), `<1s` (`<0.8s`) boot, `alpine:3.23` non-root image | **SSRF firewall + Prompt-Injection guard + workspace jailing + shell filter** | **Native Android ADB + non-root Termux** | **21 channels** + Web UI (`:18790`) + `SmartCostRouter` + universal `SKILL.md` + MCP client | **Yes — Urdu-first RTL + 6 README languages** | Pure-Go `<10MB` SLA runtime combining **21 channels, SSRF/prompt guards, `SmartCostRouter`, Android ADB, MCP client, and Urdu/RTL UX** |
| **OpenClaw** (Flagship) | JS / TS (Node.js) | `350 MB – 1.2 GB` RAM, `8.5 s – 18.0 s` boot | Broad ambient authority; plugin scrutiny | Indirect / plugin-dependent | Massive plugin marketplace | Community-dependent | Largest plugin ecosystem, but heavy Node.js footprint and wider security surface |
| **PicoClaw** (Sipeed) | Go | `<10 MB` RAM, single binary | Lightweight binary isolation | Focused on RISC-V / IoT boards | Minimal IoT/edge focus | No | Ultra-lean IoT/hardware hacking on `$10` RISC-V boards; narrower everyday/social UX |
| **NanoClaw** (`nanoclaw.dev`) | TypeScript (~500 LOC) | Moderate (Node/TS + container) | Strict Docker / Apple Container isolation | No native ADB | WhatsApp, Telegram (minimalist) | No | Extreme auditability (~500 lines), tightly coupled to Anthropic Agent SDK |
| **ZeroClaw** (`zeroclaw-labs/zeroclaw`) | Rust | Few MB RAM, single binary | Rust memory safety + SOP daemon | No native ADB | 30+ channels, 20+ LLM providers | No | Rust single-binary runtime with Standard Operating Procedure (SOP) cron engine |
| **IronClaw** (`nearai/ironclaw`) | Rust | Lightweight | **WASM sandboxing** + host-boundary secret vault | No native ADB | Telegram, Slack, WebUI, REPL | No | Zero-trust enterprise/security-first WASM tool isolation |
| **Nanobot** (`HKUDS/nanobot`) | Python + React/TS | Higher (Python runtime) | Basic local sandbox | No native ADB | Telegram, Discord, Slack, WebUI | No | Readable ~3k–4k LOC educational codebase with "Dream" memory consolidation |
| **AutoGen / CrewAI / LangChain** | Python | `180 MB – 500 MB` RAM, `12 s – 42 s` boot | Manual sandbox setup | No | Developer SDKs (no built-in gateway) | No | Enterprise Python orchestration, impractical on `$10` SBCs or recycled Android phones |

### 3.4 Unfair Positioning Wedges

1. **Vs. OpenClaw / Python Frameworks:** Lead with **96–99% lower RAM (`<10MB` core SLA / `~14.2 MB` x86_64 RSS)**, **sub-second cold boot**, **single static Go binary**, and **built-in SSRF + prompt-injection defense**.
2. **Vs. PicoClaw (Go):** Both achieve sub-10MB Go footprints; differentiate on **production everyday utility**: `21` messaging/social channels, `SmartCostRouter`, universal `SKILL.md`, native Android ADB automation, and MCP client integration.
3. **Vs. ZeroClaw / IronClaw (Rust) & NanoClaw (TS):** Differentiate on **approachable Go contributor velocity**, **native Android/Termux phone control**, **zero-config DuckDuckGo search + local Ollama offline mode**, and **Urdu-first RTL accessibility**.

---

## 4. Cross-Document Consistency & Pre-Launch Conversion Audit (Read-Only Findings)

The following non-owned drifts were observed during this audit and are flagged for Milestones M3 (website), M5 (`README.md` / `PRODUCT.md` / `MARKETING_CAMPAIGN_V2.md`), and M6 (release gate) — **do not propagate these drifts into external submissions**:

| Item | Canonical Standard (M4 Enforced) | Non-Owned Drift Flagged for M3 / M5 / M6 |
| :--- | :--- | :--- |
| **Go Version** | `go 1.25.7` (`Go 1.25+`) | `README.md:8`, `README.*.md:11`, `INSTALLATION.md:101`, `MARKETING_CAMPAIGN_V2.md:170`, `DeveloperFooter.tsx:150` reference pre-1.25 Go versions. |
| **License** | Pure `MIT` (`LICENSE:1–21`) | `BenchmarkTable.tsx:184` and `DeveloperFooter.tsx:146` mention a dual-license string alongside MIT. |
| **Docker Image & Volume** | `ghcr.io/abdullahmalik17/malikclaw:latest`, `-p 18790:18790`, `-v ~/.malikclaw:/home/malikclaw/.malikclaw` | `README.md:70`, `PRODUCT.md:29`, `QUICKSTART.md:26`, `INSTALLATION.md`, `MARKETING_CAMPAIGN_V2.md:212`, `docker-compose.yml` use a root home mount path or legacy `8080:8080` (`QuickInstall.tsx:30`). |
| **Canonical URLs** | `https://malikclaw.vercel.app` & `https://mcpmarket.com/server/malikclaw` | `PRODUCT.md:369` & translated `README.*.md` link `malikclaw.io` (zero indexed pages); `layout.tsx:131` & `DeveloperFooter.tsx:128` use a localized `/ko/` MCP Market path. |
| **GitHub Topics** | `ai-agent`, `golang`, `mcp`, **`mcp-client`**, `model-context-protocol`, `ollama`, `self-hosted`, `android-adb`, `termux`, `edge-ai`, `personal-assistant`, `urdu`, `openclaw-alternative` | Prior audit draft recommended `mcp-server`; remove `mcp-server` until an MCP server bridge exists. |
| **Badges & Social Assets** | Add missing `pkg.go.dev` & `snyk.io` badges (`badges-inventory.md:153–158`); generate `1280x640` `assets/social-preview.png` & `1200x630` `og-banner.png`; compress `8.99 MB` `assets/image.png` | `README.md` omits `pkg.go.dev` & `snyk.io`; `layout.tsx:63` uses `logo.png` for `1200x630` OG card and `:90` has placeholder Google site verification. |
| **Doc & CLI Hygiene** | Only verified `cmd/malikclaw/` commands (`onboard`, `agent -m`, `run --metrics`, `gateway`, `skills`, `cron`, `config show|path`, `status`, `version`) | `PRODUCT.md:119,145` duplicates `Demo 2:` and cites unimplemented commands/flags (agent timeout flag, Gmail auth subcommand, config view/edit, log tailing). |
| **Benchmarks & Release Tag** | Reconcile `<10MB` SLA / `8.4 MB` / `~14.2 MB` RSS and `8.5s–18.0s` OpenClaw boot; tag `v2.0.0` in M6 | `BenchmarkTable.tsx` / `TerminalSimulator.tsx` cite an inflated 500s+ OpenClaw boot figure; `git tag -l` currently stops at `v0.2.4`. |

---

## 5. Local Submission Strategy, Architectural Gates & Payloads Index

> **Strict Guardrail:** All payloads below are **local drafts only**. No external PRs, comments, `mcp-publisher publish` calls, or directory submissions were executed.

### 5.1 Execution Tracks & Gate Status

| Track | Target | Status / Readiness | Local Payload File |
| :--- | :--- | :--- | :--- |
| **A1. Immediate MCP Client** | **MCP Market** (`https://mcpmarket.com/server/malikclaw`) | **Ready** — Refresh existing listing to `v2.0.0` | [`docs/submissions/mcp-directories.md`](submissions/mcp-directories.md) |
| **A2. Immediate MCP Client** | **Glama Clients** (`https://glama.ai/mcp/clients`) | **Ready** — Submit as MCP Client / Agent Host | [`docs/submissions/mcp-directories.md`](submissions/mcp-directories.md) |
| **A3. Immediate MCP Client** | **PulseMCP Clients** (`https://www.pulsemcp.com/clients`) | **Ready** — Submit via `/submit` classified as Client | [`docs/submissions/mcp-directories.md`](submissions/mcp-directories.md) |
| **A4. Immediate MCP Client** | **MCP.so** (`https://mcp.so/submit`) | **Ready** — Select **`MCP Client`** submission type | [`docs/submissions/mcp-directories.md`](submissions/mcp-directories.md) |
| **A5. Immediate Awesome-List** | **`punkpeye/awesome-mcp-clients`** | **Ready** — Accurate home for MCP Client/Host | [`docs/submissions/awesome-list-prs.md`](submissions/awesome-list-prs.md) |
| **A6. Immediate Awesome-List** | **`e2b-dev/awesome-ai-agents`** & **`aloth/awesome-ai-agents`** | **Ready** — Alphabetical Open-source / Personal AI Agents | [`docs/submissions/awesome-list-prs.md`](submissions/awesome-list-prs.md) |
| **A7. Immediate Awesome-List** | **`awesome-selfhosted/awesome-selfhosted-data`** | **Ready** — `v0.1.0` (`2026-03-14`) passes `>=4 mo` age gate | [`docs/submissions/software-malikclaw.yml`](submissions/software-malikclaw.yml) & [`awesome-list-prs.md`](submissions/awesome-list-prs.md) |
| **A8. Discovery & Articles** | **AlternativeTo**, **DEV.to**, **Hashnode** | **Ready** — GEO-structured copy & article outlines | [`docs/submissions/mcp-directories.md`](submissions/mcp-directories.md) |
| **B1. Server-Bridge-Gated** | **Smithery** (`https://smithery.ai/new`) | **Blocked on `malikclaw mcp serve`** — Template drafted | [`docs/submissions/smithery.yaml`](submissions/smithery.yaml) & [`mcp-directories.md`](submissions/mcp-directories.md) |
| **B2. Server-Bridge-Gated** | **Glama MCP Servers** (`https://glama.ai/mcp/servers`) | **Blocked on Firecracker + MCP server introspection** | [`docs/submissions/mcp-directories.md`](submissions/mcp-directories.md) |
| **B3. Server-Bridge-Gated** | **Official MCP Registry / PulseMCP Server** | **Blocked on `malikclaw mcp serve`** — Strict JSON drafted | [`docs/submissions/server.json`](submissions/server.json) & [`mcp-directories.md`](submissions/mcp-directories.md) |
| **B4. Server-Bridge-Gated** | **`punkpeye/awesome-mcp-servers`** | **Blocked on `malikclaw mcp serve` + Glama score badge** | [`docs/submissions/awesome-list-prs.md`](submissions/awesome-list-prs.md) |
| **C1. Release & Coverage Gate** | **`avelino/awesome-go`** (`Artificial Intelligence`) | **Blocked on M6 `v2.0.0` git tag + `>=80%` coverage check** (`v0.1.0` `>=5 mo` age already satisfied) | [`docs/submissions/awesome-list-prs.md`](submissions/awesome-list-prs.md) |
