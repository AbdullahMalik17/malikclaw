# Changelog 📜

All notable changes to **MalikClaw** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-11-21

### Added
- **SSRF & Network Boundary Firewall (`pkg/security/ssrf.go`)**: Deterministic stdlib-only IP/CIDR validator blocking loopback, RFC1918 private networks, link-local/cloud metadata (`169.254.169.254`, `metadata.google.internal`), CGNAT, IPv6 ULA, and IPv4-mapped IPv6 bypasses, with explicit opt-in for local Ollama/vLLM endpoints.
- **Prompt-Injection Structural Defense (`pkg/security/prompt_guard.go`)**: Data-boundary isolation (`WrapUntrusted`) with anti-spoofing tag escaping and heuristic prompt-injection scanner (`ScanPromptInjection`) for role overrides, secret exfiltration, and encoded shell payloads.
- **Smart Multi-Model Cost Router (`pkg/routing/cost_router.go`)**: Complexity-aware 3-tier router (`TierFast` local/mini → `TierBalanced` → `TierReasoning` frontier) with automatic fallback chains and cost-savings rationale.
- **Website v2.0.0 ("Agentic Era 2026") & SEO/GEO Upgrade**: Added Schema.org `SoftwareApplication` JSON-LD structured data, updated metadata, and dedicated "Everyday Life Made Easy" + v2.0.0 agentic security/routing highlights.
- **Multi-Agent Upgrade & Launch Documentation**: Added `docs/AGENT_UPGRADE_PROMPTS_V2.md`, `docs/ACHIEVEMENTS_AUDIT_2026.md`, and `docs/MARKETING_CAMPAIGN_V2.md`.

### Fixed
- **GitHub Actions CI (`golangci-lint` v2 migration)**: Migrated `.golangci.yaml` to `version: "2"` schema (`linters.settings`, `linters.exclusions.rules`, `formatters.settings.gci`) and updated `.github/workflows/pr.yml` to pin `version: v2` with `verify: true` and `go vet ./...`, resolving the `unsupported version of the configuration: ""` exit code 3 failure.

---

## [1.0.0] - 2026-06-15

### Added
- **Omnichannel Expansion**: Native API & web-scraping support for TikTok, LinkedIn (via Playwright browser context), Reddit, and Twitter/X API v2.
- **Cloud-Native Containerization**: Multi-stage Docker build producing ultralight Alpine (<15MB) and Full Node.js 24 MCP-enabled images.
- **Bento Grid Web UI**: Upgraded `web/frontend` and marketing `website` with dynamic mesh gradients, real-time agent metrics, and dark mode theme.
- **Vercel AI Demo Integration**: Integrated `@ai-sdk/google` live chat widget powered by Gemini 2.5 Flash on marketing landing page.
- **ModelContextProtocol (MCP) Support**: Dynamic third-party tool server attachment via MCP standard.

### Changed
- Refactored `pkg/agent/agentloop` to fully decouple memory persistence from execution threads.
- Optimized Go memory allocator pools, bringing idle RAM usage under **10MB**.

### Fixed
- Fixed race conditions in async `MessageBus` subscriber dispatch during high-volume webhook bursts.
- Resolved path traversal vulnerabilities in `file` tool relative path parsing.

---

## [0.9.0] - 2026-03-20

### Added
- **5-Stage Production Agent Loop**: `PLAN ➔ ACT ➔ OBSERVE ➔ REFLECT ➔ MEMORY UPDATE` architectural cycle.
- **ReAct Planner (`pkg/agent/planner`)**: Subtask graph decomposition and execution graph building.
- **Resilient Executor (`pkg/agent/executor`)**: Exponential backoff retry logic and circuit breaker protection.
- **Guardian Engine (`pkg/agent/guardian`)**: Self-auditing, autonomous code inspection, and git-diff self-patching.
- **Markdown Memory Manager**: Standardized storage for `SOUL.md`, `IDENTITY.md`, `USER.md`, and `MEMORY.md`.

### Changed
- Upgraded default installer scripts (`install.sh` / `install.ps1`) with automatic architecture detection and checksum verification.
- Improved CLI `malikclaw onboard` interactive setup wizard.

---

## [0.8.0] - 2026-01-10

### Added
- **Mobile ADB Automation**: Screen capture, tap, swipe, keyevent, text input, and app management tools for Android devices.
- **Termux Support**: Native execution support on non-root Android smartphones.
- **Local LLM Support**: Ollama integration (`http://localhost:11434/v1`) with streaming response support.
- **RTL & Multilingual Support**: Urdu, Japanese, French, Portuguese, and Vietnamese terminal localizations.

### Security
- Introduced regex-based command execution sandbox blocking `sudo`, `rm -rf /`, `mkfs`, and unsafe shell pipes.

---

## [0.5.0] - 2025-10-01

### Added
- **Initial Public Open Source Release**.
- Core Go binary runtime with `<10MB` RAM consumption and `<1s` boot time.
- Unified event-driven `MessageBus` engine.
- Model provider drivers for OpenAI, Anthropic, and Google Gemini.
- Base CLI tools (`malikclaw agent`, `malikclaw gateway`, `malikclaw config`).
