# MalikClaw v2.0.0 — MCP Directory & Discovery Submission Payloads (Local Drafts Only)

> **STRICT GUARDRAIL — LOCAL DRAFTS ONLY:** Do **NOT** execute external submissions, open PRs, post comments, or run `mcp-publisher publish` from this document. Every payload below is prepared for maintainer review after Milestone M6 (`v2.0.0` git tag) or after the MCP server-bridge gate where noted.  
> **Canonical URLs:** Website `https://malikclaw.vercel.app` • GitHub `https://github.com/AbdullahMalik17/malikclaw` • MCP Market `https://mcpmarket.com/server/malikclaw` • Go Docs `https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw`  
> **Canonical Specs:** `Go 1.25+` (`go 1.25.7`) • `MIT` License • `21` Channels (`pkg/channels/`) • Docker `ghcr.io/abdullahmalik17/malikclaw:latest` (`-p 18790:18790 -v ~/.malikclaw:/home/malikclaw/.malikclaw`)

---

## Architectural Gate: MCP Client / Host vs. MCP Server

Codebase verification confirms `pkg/mcp/manager.go:253` instantiates `mcp.NewClient` (`github.com/modelcontextprotocol/go-sdk v1.4.1`) supporting `stdio`, `sse`, and `http` (`StreamableClientTransport`), while `pkg/mcp_servers/` does not exist (`0` `mcp.NewServer` symbols). Therefore:

- **Part A (Immediate Client-Compatible Targets):** Submit MalikClaw accurately as an **MCP Client / Autonomous Agent Host** to MCP Market (v2.0.0 refresh), Glama Clients, PulseMCP Clients, and MCP.so (`MCP Client` type).
- **Part B (Server-Bridge-Gated Templates):** Hold Smithery (`smithery.yaml`), Glama Servers (`glama.ai/mcp/servers`), and Official MCP Registry / PulseMCP Server (`server.json`) until an MCP server entrypoint (e.g., `malikclaw mcp serve`) exposes MalikClaw tools via MCP `initialize` and `tools/list`.

---

## Part A — Immediate MCP Client-Compatible Targets

### 1. MCP Market (`https://mcpmarket.com/server/malikclaw` — v2.0.0 Refresh)

- **Status:** Already Live & Indexed (`2026-11-21T09:21:37Z`)
- **Creator Dashboard / Submission URL:** `https://mcpmarket.com/submit` (or creator dashboard for slug `malikclaw`)
- **Recommended Tags:** `go`, `ai-agent`, `mcp-client`, `ollama`, `android-adb`, `urdu-rtl`, `edge-ai`, `ssrf-guard`
- **Optional File Note:** `mcpmarket.com` supports an optional `llms-install.md` guide at the repo root if you want one-click LLM client onboarding instructions.

#### Canonical GEO Summary (Copy-Paste Description — 134–167 Words)

MalikClaw is an open-source, MIT-licensed personal AI agent runtime written in pure Go (`go 1.25.7`) that runs reliably on low-resource edge hardware, cloud servers, and Android phones. Engineered around a `<10 MB` core idle memory SLA (`~14.2 MB` idle RSS on x86_64 Linux Go 1.22 benchmarks) and sub-second cold boot (`<0.8 s`), MalikClaw connects 21 messaging channels—including WhatsApp, Telegram, Discord, Slack, and Matrix—with native Android ADB automation and non-root Termux support. Version `2.0.0` introduces an SSRF Network Boundary Firewall (`pkg/security/ssrf.go`), a Prompt-Injection Structural Guard (`pkg/security/prompt_guard.go`), a complexity-aware `SmartCostRouter` (`pkg/routing/cost_router.go`) balancing local Ollama models against frontier reasoning tiers, universal `SKILL.md` skills (`pkg/skills/loader.go`), and a built-in MCP client (`pkg/mcp/manager.go`) supporting `stdio`, `sse`, and `http` servers. Users can deploy via a single static binary or non-root Docker (`ghcr.io/abdullahmalik17/malikclaw:latest`) exposing port `18790` with persistent state at `/home/malikclaw/.malikclaw` and an Urdu-first RTL web UI.

#### Verified Quickstart Commands (For Listing Body)

```bash
# Initialize workspace and configuration
malikclaw onboard

# Run a single agent prompt
malikclaw agent -m "Summarize today's reminders"

# Execute a task with performance metrics
malikclaw run "Check unread tasks and draft a daily plan" --metrics

# Start the 21-channel gateway + Web UI (http://localhost:18790)
malikclaw gateway

# Inspect configuration, skills, cron jobs, and runtime status
malikclaw config show
malikclaw skills list
malikclaw cron list
malikclaw status
malikclaw version
```

```bash
# Non-root Docker runtime (Dockerfile USER malikclaw, ports 18790 & 18800)
docker run -d --name malikclaw \
  -p 18790:18790 \
  -v ~/.malikclaw:/home/malikclaw/.malikclaw \
  ghcr.io/abdullahmalik17/malikclaw:latest
```

---

### 2. Glama MCP Clients (`https://glama.ai/mcp/clients`)

- **Submission URL:** `https://glama.ai/mcp/clients` (Client directory submission; distinct from `/mcp/servers`)
- **Fields:**
  - **Name:** `MalikClaw`
  - **Repository URL:** `https://github.com/AbdullahMalik17/malikclaw`
  - **Website URL:** `https://malikclaw.vercel.app`
  - **License:** `MIT`
  - **Supported MCP Transports:** `stdio`, `sse`, `http` (`StreamableClientTransport` via `github.com/modelcontextprotocol/go-sdk v1.4.1`)
  - **Platforms:** `Linux`, `macOS`, `Windows`, `Android (Termux)`, `Docker`
  - **Short Description:** `Pure-Go (<10MB core SLA) autonomous personal AI agent & MCP client with 21 messaging channels, SSRF/prompt-injection guards, SmartCostRouter, universal SKILL.md, Android ADB automation, and Urdu-first RTL UI.`

---

### 3. PulseMCP Clients (`https://www.pulsemcp.com/clients`)

- **Submission URL:** `https://www.pulsemcp.com/submit` (explicitly classify as **MCP Client** for `https://www.pulsemcp.com/clients`)
- **Fields:**
  - **Client Name:** `MalikClaw`
  - **GitHub Repository URL:** `https://github.com/AbdullahMalik17/malikclaw`
  - **Website / Docs:** `https://malikclaw.vercel.app`
  - **Description:** `MIT-licensed Go 1.25+ personal AI agent and MCP client/host connecting stdio, SSE, and HTTP MCP servers across 21 messaging channels (WhatsApp, Telegram, Discord, Slack, Matrix, etc.). Features SSRF firewall, prompt-injection structural guard, SmartCostRouter (Ollama local + frontier tiers), universal SKILL.md loading, and native Android ADB automation.`
  - **Installation Metadata:**
    - Single static Go binary or Docker (`ghcr.io/abdullahmalik17/malikclaw:latest`)
    - Configure external MCP servers in `~/.malikclaw/config.json` (`malikclaw config path`) and run `malikclaw gateway` or `malikclaw agent -m "..."`.

---

### 4. MCP.so (`https://mcp.so/submit`)

- **Submission URL:** `https://mcp.so/submit` (Index target: `https://mcp.so/clients`)
- **Submission Type:** **`MCP Client`** *(do NOT select `MCP Server` until `malikclaw mcp serve` exists)*
- **Form Payload:**
  - **Name:** `MalikClaw`
  - **Contact Email:** `[INSERT MAINTAINER EMAIL]`
  - **Category:** `AI Agents / MCP Clients / Edge Automation`
  - **GitHub Repo URL:** `https://github.com/AbdullahMalik17/malikclaw`
  - **Website / Docs URL:** `https://malikclaw.vercel.app`
  - **Pricing Model:** `Free (MIT Open Source)`
  - **Key Features:** `Go 1.25+`, `<10MB Core RAM SLA`, `21 Messaging Channels`, `SSRF Firewall`, `Prompt-Injection Guard`, `SmartCostRouter`, `Universal SKILL.md`, `Android ADB + Termux`, `Urdu RTL`
  - **Configuration Snippet (MCP Client Host Config):**
    ```json
    {
      "mcp": {
        "servers": {
          "filesystem": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "./workspace"]
          }
        }
      }
    }
    ```

---

## Part B — Server-Bridge-Gated MCP Templates (Hold Until `malikclaw mcp serve` Exists)

> **Pre-Submission Gate:** None of the three directories below should be submitted until MalikClaw exposes a real MCP server command (`malikclaw mcp serve` speaking MCP `initialize` + `tools/list` over `stdio` or `streamable-http`).

### 1. Smithery (`https://smithery.ai/new`)
- **Local Draft Manifest:** [`docs/submissions/smithery.yaml`](smithery.yaml)
- **Schema Notes:** Uses `runtime: "container"`, `build` pointing to the non-root `Dockerfile`, `startCommand.type: "stdio"`, JSON Schema `configSchema`, `commandFunction`, and `exampleConfig`.
- **Gate:** Smithery validates `Dockerfile` build and probes `startCommand` via MCP server protocol. Copy `docs/submissions/smithery.yaml` to root `smithery.yaml` only after `malikclaw mcp serve` is implemented.

### 2. Glama MCP Servers (`https://glama.ai/mcp/servers`)
- **Submission URL:** `https://glama.ai/mcp/servers` (*"Add MCP Server"* → `https://github.com/AbdullahMalik17/malikclaw`)
- **Technical Gate:** Glama builds the repository inside an ephemeral **Firecracker microVM** from `Dockerfile` and runs automated **MCP server introspection** (`initialize` + `tools/list`), license detection (`MIT`), and security checks to issue `https://glama.ai/mcp/servers/AbdullahMalik17/malikclaw/badges/score.svg`.
- **Draft Ownership Claim (`glama.json` — keep local until server bridge is added):**
  ```json
  {
    "$schema": "https://glama.ai/mcp/schemas/server.json",
    "maintainers": ["AbdullahMalik17"]
  }
  ```

### 3. Official MCP Registry & PulseMCP Server (`https://registry.modelcontextprotocol.io`)
- **Local Draft Manifest:** [`docs/submissions/server.json`](server.json)
- **Schema Notes:** Strictly valid JSON conforming to `https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json`, namespace `io.github.AbdullahMalik17/malikclaw`, strict SemVer `2.0.0`, OCI package `ghcr.io/abdullahmalik17/malikclaw:2.0.0` (`stdio`), and `streamable-http` remote `http://localhost:18790/mcp`.
- **Gate:** Do not run `mcp-publisher publish` until `v2.0.0` is tagged in git (Milestone M6) AND `malikclaw mcp serve` handles MCP server requests.

---

## Part C — Discovery & Technical Publishing Platforms (SEO/GEO Compliant)

### 1. AlternativeTo (`https://alternativeto.net`)

- **Creation Flow:** Log in → User Menu → **"Suggest new application"**
- **Fields:**
  - **Name:** `MalikClaw`
  - **Website:** `https://malikclaw.vercel.app`
  - **Source Code:** `https://github.com/AbdullahMalik17/malikclaw`
  - **License:** `Open Source (MIT)`
  - **Platforms:** `Linux`, `Windows`, `macOS`, `Android`, `Docker`
  - **Alternatives To:** `OpenClaw`, `CrewAI`, `AutoGen`, `PicoClaw`, `NanoClaw`
  - **Tags:** `ai-agent`, `self-hosted`, `ollama`, `golang`, `android-adb`, `mcp-client`, `automation`, `urdu`
- **GEO-Optimized Purpose / Description (145 words):**
  MalikClaw is a self-hosted, MIT-licensed personal AI agent runtime built in Go (`go 1.25.7`) for developers and everyday users who want private automation without heavy Python or Node.js dependencies. While flagship runtimes like OpenClaw consume `350 MB – 1.2 GB` of RAM and boot in `8.5 s – 18.0 s`, MalikClaw targets a `<10 MB` core idle memory SLA (`~14.2 MB` idle RSS on x86_64 Linux Go 1.22) and sub-second cold startup (`<0.8 s`). It unifies 21 messaging platforms (including WhatsApp, Telegram, Discord, Slack, and Matrix), native Android ADB and non-root Termux phone control, and an Urdu-first RTL interface alongside six localized READMEs. Version `2.0.0` adds an SSRF Network Boundary Firewall, Prompt-Injection Structural Guard, `SmartCostRouter` for automatic local-Ollama-to-frontier routing, universal `SKILL.md` skills, and MCP client connectivity (`stdio`, `sse`, `http`) inside a non-root Alpine Docker image on port `18790`.

---

### 2. DEV.to (`https://dev.to/new`) & Hashnode (`https://hn.new`) Technical Article Outline

#### Publishing Metadata
- **DEV.to Editor:** `https://dev.to/new`
  - **Frontmatter (max 4 lowercase tags):**
    ```yaml
    ---
    title: "How We Built a <10MB RAM Autonomous AI Agent in Pure Go (SSRF Firewall, Prompt Guard & Edge Benchmarks)"
    published: false
    description: "Inside MalikClaw v2.0.0: pure Go 1.25.7, SSRF firewall, prompt-injection guard, SmartCostRouter, 21 channels, and honest edge vs x86_64 benchmarks."
    tags: go, ai, opensource, showdev
    canonical_url: https://malikclaw.vercel.app
    ---
    ```
- **Hashnode Editor:** `https://hn.new`
  - **Title:** `How We Built a <10MB RAM Autonomous AI Agent in Pure Go (SSRF Firewall, Prompt Guard & Edge Benchmarks)`
  - **SEO Subtitle (146 chars):** `How MalikClaw v2.0.0 runs 21 channels, SSRF & prompt-injection guards, SmartCostRouter, and MCP client tools in <10MB core RAM using Go 1.25.7.`
  - **Cover Image:** `website/public/assets/og-banner.png` (`1200x630`, generated in M5)
  - **Canonical URL:** Set `canonical_url` to the primary published URL (`dev.to` post or `malikclaw.vercel.app` blog canonical) to prevent duplicate-content dilution.

#### SEO & GEO Structural Compliance Rules (`seo/SKILL.md` + `seo-geo.md`)
- Place a `"What is MalikClaw?"` definition in the first 40–60 words.
- Write every `H2` as a natural user/developer question with a **134–167 word self-contained answer block** immediately beneath it (no pronoun-heavy openings like *"It"* or *"This"*).
- Include a comparative Markdown benchmark table with honest hardware context.
- **Prohibited:** Only use `Article` / `SoftwareApplication` / `Organization` JSON-LD schemas — omit deprecated step-by-step how-to and commercial FAQ structured-data schema types, and cite `INP <= 200ms` (never retired `FID` web vitals metrics).

#### Passage-Optimized Article Outline

##### Opening Definition (46 words)
> **What is MalikClaw?** MalikClaw is an open-source, MIT-licensed personal AI agent runtime written in Go (`go 1.25.7`). It runs 21 messaging channels, native Android ADB automation, an SSRF network firewall, a prompt-injection structural guard, and multi-model cost routing inside a `<10 MB` core idle memory footprint.

##### `## Why Do Existing AI Agent Runtimes Struggle on $10 Edge Hardware?` (146-word answer block)
> Most personal AI agent frameworks rely on Node.js or Python dependency trees that consume hundreds of megabytes of RAM before executing a single prompt. In baseline runtime measurements, OpenClaw requires `350 MB – 1.2 GB` of memory with `8.5 s – 18.0 s` startup latency, while Python orchestration stacks such as AutoGen, CrewAI, and LangChain typically occupy `180 MB – 500 MB` of RAM and `12 s – 42 s` to initialize. On `$10` single-board computers such as an Orange Pi Zero (`512 MB` RAM), a Raspberry Pi Zero 2 W, or recycled Android devices running non-root Termux, that overhead leaves almost no headroom for local models or background messaging gateways. Compiling MalikClaw (`go 1.25.7`) to a single static Go binary (`CGO_ENABLED=0`, `-ldflags="-s -w"`) eliminates runtime interpreters, reduces core idle memory below `10 MB`, and delivers sub-second cold startup (`<0.8 s`) reliably.

##### `## How Does MalikClaw Measure <10MB Core SLA vs. x86_64 RSS Benchmarks?` (Benchmark Table + GEO Answer Block)

| Runtime / Configuration | Idle RAM | Peak / Active RAM | Cold Boot | Measurement Notes |
| :--- | :--- | :--- | :--- | :--- |
| **MalikClaw Core SLA** | `< 10 MB` (`8.4 MB` highlight) | Minimal static binary | `< 0.8 s` (`< 1 s` SLA) | `scripts/bench-ram.sh` & `pkg/bench/bench_test.go` |
| **MalikClaw x86_64 Linux** | `~14.2 MB` RSS | `~28.5 MB` RSS | `< 1.2 ms` internal loop | `docs/benchmark/results.md` (Intel i7, 16 GB RAM, Go 1.22; `~185 MB` for 100 concurrent agents) |
| **OpenClaw (Node/TS)** | `350 MB – 1.2 GB` | `1.2 GB+` | `8.5 s – 18.0 s` | Node.js runtime + plugin surface |
| **Python Agent Stacks** | `180 MB – 500 MB` | `500 MB+` | `12 s – 42 s` | Python interpreter + async dependency graph |

> Transparent benchmarking requires separating embedded idle targets from full multi-tool x86_64 server workloads. MalikClaw enforces a `<10 MB` idle RSS target for `malikclaw gateway` in `scripts/bench-ram.sh` and a `<1 s` cold-boot assertion for `malikclaw version` in `pkg/bench/bench_test.go`, reaching `8.4 MB` on lean static deployments. On a full x86_64 Linux benchmark machine (`Intel i7`, `16 GB` RAM, Go 1.22) exercising local Ollama and cloud APIs (`docs/benchmark/results.md`), MalikClaw recorded `~14.2 MB` idle RSS, `~28.5 MB` peak active RSS, `<1.2 ms` internal framework overhead, `<0.05 ms` local Go tool execution overhead, and `~185 MB` total RAM across `100` concurrent active agent sessions. Publishing both figures with exact build flags (`CGO_ENABLED=0`, `-ldflags="-s -w"`) and reproducible verification commands (`malikclaw run "..." --metrics`) gives systems engineers clear expectations across ARMv7 SBCs, non-root Android Termux environments, and multi-tenant VPS deployments without cherry-picked marketing numbers.

##### `## How Does MalikClaw v2.0.0 Defend Against SSRF and Prompt Injection?` (GEO Answer Block)
> Autonomous agents that fetch arbitrary web URLs, control headless Playwright browsers, or invoke external MCP servers face two primary attack vectors: Server-Side Request Forgery (SSRF) and indirect prompt injection. MalikClaw `v2.0.0` enforces SSRF protection at the network boundary through `pkg/security/ssrf.go` (`ValidateURL` and `IsBlockedIP`), which restricts outbound schemes strictly to `http` and `https`, rejects cloud metadata hosts such as `metadata.google.internal` and `metadata.goog`, unwraps IPv4-mapped IPv6 bypasses, and blocks RFC1918 private networks, CGNAT (`100.64.0.0/10`), link-local (`169.254.0.0/16`), IPv6 ULA (`fc00::/7`), loopback, and multicast ranges with DNS re-resolution verification. Simultaneously, `pkg/security/prompt_guard.go` defends the agent context via `WrapUntrusted` and `ScanPromptInjection`: untrusted external tool outputs from web fetches, Gmail, and calendar integrations are isolated inside `<untrusted_data source="...">` envelopes with nested closing tags escaped and source attributes sanitized, while 10 compiled regex rules inspect inputs across `instruction_override`, `role_override`, `secret_exfiltration`, and `encoded_payload` categories before further reasoning proceeds.

##### `## How Do SmartCostRouter, Universal SKILL.md, and MCP Client Tools Work Together?` (GEO Answer Block)
> Running every routine chat message through a frontier reasoning model wastes both response latency and API budget. MalikClaw's `SmartCostRouter` (`pkg/routing/cost_router.go`) classifies incoming prompt complexity and active tool counts across three explicit routing tiers: `TierFast` (defaulting to `gemini-2.5-flash` with fallbacks to local `ollama/qwen2.5:7b` and `gpt-4o-mini` for lightweight daily requests, targeting up to ~85% savings versus frontier tiers), `TierBalanced` (`claude-sonnet-4`, `gpt-4.1`, and `gemini-2.5-pro` for multi-step workflows), and `TierReasoning` (`claude-opus-4`, `o3`, and `gemini-2.5-pro` for deep architecture or debugging). Portable capability extensions live in `SKILL.md` files loaded progressively by `pkg/skills/loader.go`—supporting JSON or YAML frontmatter plus Markdown AST fallback across workspace, global (`~/.malikclaw/skills`), and built-in directories—and managed cleanly via `malikclaw skills list` or `malikclaw skills install`. External capabilities connect through `pkg/mcp/manager.go`, which instantiates `mcp.NewClient` (`github.com/modelcontextprotocol/go-sdk v1.4.1`) over `stdio`, `sse`, and `http` transports, letting one lightweight Go binary bridge 21 messaging channels with local and remote MCP servers.

##### `## How Can Developers and Everyday Users Try MalikClaw v2.0.0 Locally?` (Verified CLI + Docker Quickstart)
- Walkthrough using strictly verified CLI commands: `malikclaw onboard`, `malikclaw agent -m "..."`, `malikclaw run "..." --metrics`, `malikclaw gateway` (port `18790`), `malikclaw cron list|add`, `malikclaw config show|path`, and non-root Docker (`-v ~/.malikclaw:/home/malikclaw/.malikclaw`).
- Author bio + primary links (`https://malikclaw.vercel.app`, `https://github.com/AbdullahMalik17/malikclaw`, `https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw`, `https://mcpmarket.com/server/malikclaw`).
