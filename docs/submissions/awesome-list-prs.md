# MalikClaw v2.0.0 — Awesome-List Pull Request Drafts (Local Drafts Only)

> **STRICT GUARDRAIL — LOCAL DRAFTS ONLY:** Do **NOT** fork, push, or open external PRs on GitHub from this workspace. Review each repo's pre-flight gate table before submitting manually.  
> **Canonical URLs:** Repo `https://github.com/AbdullahMalik17/malikclaw` • Website `https://malikclaw.vercel.app` • Go Docs `https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw`  
> **Repo History Baseline:** Initial tag `v0.1.0` dated `2026-03-14T19:37:58+05:00` (>8 months old as of `2026-11-21`). Local git tags currently stop at `v0.2.4` (`2026-08-25`); `v2.0.0` tag is scheduled for Milestone M6.

---

## Summary Matrix: Immediate vs. Gated Awesome-Lists

| Target Repository | Category / File | Status (`2026-11-21`) | Blocking Gate (If Any) |
| :--- | :--- | :--- | :--- |
| **`punkpeye/awesome-mcp-clients`** | CLI / Personal Agent MCP Clients | ✅ **Ready Now** | None (MalikClaw is an MCP Client/Host via `pkg/mcp/manager.go:253`) |
| **`e2b-dev/awesome-ai-agents`** | `Open-source projects` | ✅ **Ready Now** | Verify alphabetical placement around `M` before opening PR |
| **`aloth/awesome-ai-agents`** | `Personal AI Agents` | ✅ **Ready Now** | Verify alphabetical placement in `Personal AI Agents` |
| **`awesome-selfhosted/awesome-selfhosted-data`** | `software/malikclaw.yml` | ✅ **Ready Now** (`v0.1.0` >4 mo age passed) | Re-verify `tags.yml`/`platforms.yml` slugs in upstream repo |
| **`avelino/awesome-go`** | `Artificial Intelligence` | ⏸️ **Gated (M6)** (`v0.1.0` >5 mo age passed) | Requires `v2.0.0` git tag + `pkg.go.dev` link + **`>=80%` Go test coverage** check |
| **`punkpeye/awesome-mcp-servers`** | Aggregators / Frameworks | ⏸️ **Gated (MCP Server Bridge)** | Requires `malikclaw mcp serve` entrypoint + Glama Firecracker score badge |

---

## 1. `punkpeye/awesome-mcp-clients` (Immediate MCP Client Target)

- **Repository URL:** `https://github.com/punkpeye/awesome-mcp-clients`
- **Target Section:** CLI / Terminal & Personal Agent Clients (verify exact heading in `README.md`, alphabetical under `M`)
- **Rule Checklist:**
  - [x] Project is an authentic MCP Client/Host (`pkg/mcp/manager.go:253` uses `mcp.NewClient` from `github.com/modelcontextprotocol/go-sdk v1.4.1`)
  - [x] Supports `stdio`, `sse`, and `http` (`StreamableClientTransport`) MCP server connections
  - [x] Concise, non-promotional single-line Markdown entry in alphabetical order
- **Exact Entry Snippet:**
  ```markdown
  - **[MalikClaw](https://github.com/AbdullahMalik17/malikclaw)** — MIT-licensed pure-Go (`go 1.25.7`) autonomous personal AI agent and MCP client supporting `stdio`, `sse`, and `http` servers across 21 messaging channels, with SSRF/prompt-injection guards, `SmartCostRouter`, universal `SKILL.md` loading, and Android ADB automation.
  ```
- **PR Title:**
  `Add MalikClaw (Go autonomous agent & MCP client)`
- **PR Body:**
  ```markdown
  ## Addition: MalikClaw

  - **Repository:** https://github.com/AbdullahMalik17/malikclaw
  - **Website:** https://malikclaw.vercel.app
  - **License:** MIT
  - **MCP Client Implementation:** [`pkg/mcp/manager.go`](https://github.com/AbdullahMalik17/malikclaw/blob/main/pkg/mcp/manager.go) (`github.com/modelcontextprotocol/go-sdk v1.4.1`, supporting `stdio`, `sse`, and `http` transports).

  ### Summary
  MalikClaw is a lightweight Go (`<10 MB` core idle SLA, `~14.2 MB` x86_64 RSS) personal AI agent runtime and MCP host connecting external MCP tools to 21 messaging channels (WhatsApp, Telegram, Discord, Slack, Matrix, etc.), local Ollama models, SSRF & prompt-injection guards, and native Android ADB automation.

  ### Checklist
  - [x] Entry placed in alphabetical order
  - [x] Open-source MIT license verified
  - [x] Accurate MCP Client classification
  ```

---

## 2. `e2b-dev/awesome-ai-agents` (Immediate Target)

- **Repository URL:** `https://github.com/e2b-dev/awesome-ai-agents`
- **Target Section:** `Open-source projects` *(Note: `e2b-dev/awesome-ai-agents` separates `Open-source projects` from `Closed-source projects and companies`, and redirects pure developer SDKs to `awesome-sdks-for-ai-agents`. MalikClaw is a complete autonomous agent runtime, so `Open-source projects` is the correct bucket; also check the submission form linked at the top of their `README.md`.)*
- **Rule Checklist:**
  - [x] Complete autonomous AI agent (not an SDK-only library)
  - [x] Strict alphabetical order (`M` in `Open-source projects`)
  - [x] Concise, factual description
- **Exact Entry Snippet:**
  ```markdown
  * **[MalikClaw](https://github.com/AbdullahMalik17/malikclaw)** — Lightweight pure-Go (`<10 MB` core SLA, `<1 s` boot) autonomous personal AI agent with 21 messaging channels, SSRF and prompt-injection guards, complexity-aware `SmartCostRouter`, universal `SKILL.md` support, MCP client (`stdio`/`sse`/`http`), native Android ADB automation, and Urdu-first RTL UI. (MIT)
  ```
- **PR Title:**
  `Add MalikClaw to Open-source projects`
- **PR Body:**
  ```markdown
  ## Add MalikClaw

  - **Project:** [MalikClaw](https://github.com/AbdullahMalik17/malikclaw)
  - **Website:** https://malikclaw.vercel.app
  - **License:** MIT
  - **Section:** Open-source projects (alphabetical order)

  MalikClaw is a self-hosted autonomous personal AI agent built in Go (`go 1.25.7`) for edge SBCs, servers, and Android/Termux devices. It includes 21 messaging channels, an SSRF network firewall, prompt-injection structural guard, multi-tier cost routing (Ollama local + frontier models), universal `SKILL.md` skills, and MCP client integration.
  ```

---

## 3. `aloth/awesome-ai-agents` (Immediate Target)

- **Repository URL:** `https://github.com/aloth/awesome-ai-agents`
- **Target Section:** `Personal AI Agents`
- **Rule Checklist:**
  - [x] Active maintained repository (MIT license, multi-channel personal assistant)
  - [x] Includes concise behavior summary, open-source license, and key capabilities (`MCP`, `CLI`, `WhatsApp`/`Telegram`, `Ollama`)
  - [x] Placed in `Personal AI Agents` in alphabetical order
- **Exact Entry Snippet:**
  ```markdown
  - **[MalikClaw](https://github.com/AbdullahMalik17/malikclaw)** — MIT-licensed Go 1.25+ personal AI agent runtime (`<10 MB` core SLA, `<0.8 s` cold boot) supporting local Ollama + frontier models via `SmartCostRouter`, 21 messaging channels (WhatsApp, Telegram, Discord, Slack, etc.), native Android ADB/Termux automation, SSRF & prompt-injection guards, universal `SKILL.md`, and an MCP client.
  ```
- **PR Title:**
  `Add MalikClaw under Personal AI Agents`
- **PR Body:**
  ```markdown
  ### Summary
  Adds **MalikClaw** (`MIT`) to **Personal AI Agents**.

  - **Source:** https://github.com/AbdullahMalik17/malikclaw
  - **Website:** https://malikclaw.vercel.app
  - **Highlights:** Go `1.25.7`, `<10 MB` core idle SLA (`~14.2 MB` x86_64 RSS), 21 channels, `SmartCostRouter` (local Ollama + cloud fallbacks), SSRF network firewall, prompt-injection structural guard, universal `SKILL.md`, MCP client (`stdio`/`sse`/`http`), and Android ADB automation.
  ```

---

## 4. `awesome-selfhosted/awesome-selfhosted-data` (Immediate Target)

- **Repository URL:** `https://github.com/awesome-selfhosted/awesome-selfhosted-data`
- **Target File Path in PR:** `software/malikclaw.yml`
- **Companion Draft File:** [`docs/submissions/software-malikclaw.yml`](software-malikclaw.yml)
- **Required Commit Message:** `add MalikClaw`
- **Rule Checklist:**
  - [x] Kebab-case filename: `software/malikclaw.yml`
  - [x] `>=4 months` since first release (`v0.1.0` tagged `2026-03-14`, `>8 months` old as of `2026-11-21` — **PASS**)
  - [x] `description` `<=250` characters (`189` chars), sentence-case, ends with `.`, zero marketing fluff (`open-source`, `free`, `best`, `revolutionary` omitted)
  - [x] Valid license (`MIT`), valid platforms (`Docker`, `Go`), verified tags (`Automation`, `Generative Artificial Intelligence (GenAI)`) — re-check `tags/*.yml` before opening PR
  - [x] `depends_3rdparty: false` (runs 100% locally with Ollama; note in PR body that cloud LLM APIs and external chat bridges are optional)
  - [x] Remove any unused optional YAML keys or comments (already clean in `docs/submissions/software-malikclaw.yml`)
- **PR Title:**
  `add MalikClaw`
- **PR Body:**
  ```markdown
  - [x] Software has been released at least 4 months ago (`v0.1.0` tagged `2026-03-14`).
  - [x] Application can be self-hosted entirely locally (`depends_3rdparty: false` via local Ollama inference and local SQLite/workspace storage; cloud LLM APIs and external messaging platforms are optional).
  - [x] File named `software/malikclaw.yml` in kebab-case with commit message `add MalikClaw`.
  - [x] Description is <=250 characters, factual, and free of promotional language.
  - [x] Installation & quick-start documentation provided at `https://malikclaw.vercel.app/docs/quick-start`.
  ```

---

## 5. `avelino/awesome-go` (Gated on M6 `v2.0.0` Tag + Coverage Check)

- **Repository URL:** `https://github.com/avelino/awesome-go`
- **Target Section:** `Artificial Intelligence` (strict alphabetical order under `M`)
- **Pre-Flight Gate Checklist:**
  - [x] `go.mod` at repository root (`go 1.25.7`)
  - [x] `MIT` open-source license (`LICENSE`)
  - [x] Repository history `>=5 months` (`v0.1.0` dated `2026-03-14` — `>8 months` old — **PASS**)
  - [x] Indexed on `pkg.go.dev`: `https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw`
  - [x] Single item in the PR, neutral objective description ending with a period (`.`)
  - [ ] **GATE 1 (M6):** Create & push SemVer tag `v2.0.0` (currently `git tag -l` stops at `v0.2.4`).
  - [ ] **GATE 2 (Pre-PR Verification):** Run `go test -cover ./...` and confirm overall coverage meets `avelino/awesome-go`'s `>=80%` test coverage requirement (or document exact package coverage report link in the PR body).
- **Exact Entry Snippet:**
  ```markdown
  * [malikclaw](https://github.com/AbdullahMalik17/malikclaw) - Pure-Go autonomous AI agent runtime and embeddable loop with SSRF and prompt-injection guards, complexity-aware cost routing, MCP client, and 21 messaging channels.
  ```
- **PR Title:**
  `Add malikclaw to Artificial Intelligence`
- **PR Body:**
  ```markdown
  - **Project:** https://github.com/AbdullahMalik17/malikclaw
  - **pkg.go.dev:** https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw
  - **Latest Release Tag:** `v2.0.0` *(verify tag is pushed before submitting)*
  - **Test Coverage Report:** `[INSERT COVERAGE % AND CI RUN URL FROM go test -cover ./...]` *(>=80% required)*

  ### Checklist
  - [x] Single entry added in alphabetical order under **Artificial Intelligence**
  - [x] Neutral, objective description ending with a period
  - [x] Valid `go.mod` (`go 1.25.7`), MIT license, and `>5 months` git history (`v0.1.0` on `2026-03-14`)
  - [ ] `v2.0.0` SemVer tag live on GitHub and `>=80%` test coverage verified
  ```

---

## 6. `punkpeye/awesome-mcp-servers` (Gated on MCP Server Bridge + Glama Score Badge)

- **Repository URL:** `https://github.com/punkpeye/awesome-mcp-servers`
- **Pre-Flight Gate Warning:**
  `punkpeye/awesome-mcp-servers` strictly catalogs **MCP Servers** and enforces a verified **Glama MCP Server score badge** (`https://glama.ai/mcp/servers/OWNER/REPO/badges/score.svg`). Because MalikClaw `v2.0.0` is currently an **MCP Client/Host** (`pkg/mcp/manager.go:253`, `pkg/mcp_servers/` absent), submit to **`punkpeye/awesome-mcp-clients`** (Item #1 above) first, and **hold** this PR until:
  1. MalikClaw exposes an MCP server bridge command (e.g., `malikclaw mcp serve` over `stdio`/`http`).
  2. Glama builds MalikClaw in its Firecracker microVM, passes MCP `initialize` + `tools/list` introspection, and publishes `https://glama.ai/mcp/servers/AbdullahMalik17/malikclaw/badges/score.svg`.
- **Target Section (Once Server Bridge Exists):** `Aggregators` or `CLI & OS Automation` (1 line per server, alphabetical order)
- **Exact Entry Snippet (Post-Gate Only):**
  ```markdown
  - [AbdullahMalik17/malikclaw](https://github.com/AbdullahMalik17/malikclaw) [![AbdullahMalik17/malikclaw MCP server](https://glama.ai/mcp/servers/AbdullahMalik17/malikclaw/badges/score.svg)](https://glama.ai/mcp/servers/AbdullahMalik17/malikclaw) - Pure-Go AI agent runtime exposing messaging channels, skills, and Android ADB automation over MCP (`stdio`/`http`).
  ```
- **PR Title (Post-Gate Only):**
  `Add AbdullahMalik17/malikclaw MCP server`
- **PR Body (Post-Gate Only):**
  ```markdown
  ## Add `AbdullahMalik17/malikclaw`

  - **Repository:** https://github.com/AbdullahMalik17/malikclaw
  - **Glama Verification:** https://glama.ai/mcp/servers/AbdullahMalik17/malikclaw
  - **Transport:** `stdio` / `streamable-http` (`malikclaw mcp serve`)
  - **License:** MIT

  ### Checklist
  - [x] Entry placed in alphabetical order (1 line per server)
  - [x] Glama MCP server introspection & score badge active
  ```
