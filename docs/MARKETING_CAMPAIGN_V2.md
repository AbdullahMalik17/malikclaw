# MalikClaw v2.0.0 ("Agentic Era 2026") — Multi-Channel Launch Campaign Kit

> **Target Release:** MalikClaw `v2.0.0` ("Agentic Era 2026")  
> **Repository:** `https://github.com/AbdullahMalik17/malikclaw`  
> **Canonical Website:** `https://malikclaw.vercel.app`  
> **MCP Listing:** `https://mcpmarket.com/server/malikclaw`  
> **Campaign Rule:** Every stat is verified from the codebase (`<10MB` core idle RAM SLA / `~14.2 MB` x86_64 idle RSS, `<0.8s` cold boot, `~12–15 MB` stripped Go `1.25+` static binary, `21` channels, SSRF firewall, Prompt-Injection structural guard, `SmartCostRouter`, universal `SKILL.md` + MCP Client/Host, native Android ADB/Termux, Urdu-first RTL). Live-fluctuating integers use `[INSERT LIVE COUNT]`.

---

## 1. Positioning & Messaging Matrix

### 1.1 One-Line Hook (≤12 Words)
> **A `<10MB` Go AI agent for `$10` hardware and everyday Android phones.**

*(Alternate Developer Hook)*: **Pure Go `1.25+` agent runtime: `<10MB` SLA, SSRF + Prompt Guard, SmartCostRouter, MCP Client.**

### 1.2 Developer Pitch (30 Seconds)
> Most personal AI agents drag in 300MB–1.2GB of Python or Node.js dependencies before doing a single useful task—and leave outbound HTTP/MCP calls wide open to SSRF or prompt injection. **MalikClaw `v2.0.0`** is a single stripped Go `1.25+` static binary (`~12–15 MB`) that targets a **`<10MB` core idle RAM SLA** (`~14.2 MB` measured x86_64 idle RSS), boots in **under 0.8 seconds**, and runs a deterministic 5-stage loop (`PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE`) with plain Markdown memory. It ships with a built-in **SSRF Network Boundary Firewall**, **Prompt-Injection Structural Guard** (`<untrusted_data>` isolation), **`SmartCostRouter`** (local **Ollama**/mini models → frontier reasoning with `429`/`5xx` fallback), universal **`SKILL.md`** progressive loading, an **MCP Client / Host** (`stdio`/`sse`/`http`), **21 messaging/social channels**, and native **Android ADB / Termux** automation.

### 1.3 Everyday-User "Make Life Easy" Pitch (30 Seconds)
> You shouldn't need a `$1,500` laptop or a `$20/month` subscription to have a private AI assistant that actually helps you get things done. **MalikClaw `v2.0.0`** turns an old Android phone, a `$10` Raspberry/Orange Pi, or any home computer into your personal assistant—in **English or Urdu (RTL)**. Run one install command and `malikclaw onboard`, then message it on WhatsApp, Telegram, or its clean web dashboard (`localhost:18790`) to get morning briefings, summarize messages, search the web for free, set Urdu/English reminders, or automate apps on your Android phone—while keeping your data private on your own hardware and routing simple tasks to free local Ollama models automatically.

---

## 2. Hacker News (Show HN) Launch Kit

**Timing:** Tuesday or Wednesday, 13:30–14:30 UTC (8:30–9:30 AM ET).  
**URL Field:** `https://github.com/AbdullahMalik17/malikclaw`

### Title (≤80 characters)
```text
Show HN: MalikClaw v2.0 – <10MB Go AI agent, SSRF/prompt guards & cost router
```

### Maker's First Comment (Post immediately after submission)
```text
Hi HN, I'm Abdullah, the creator of MalikClaw (MIT-licensed, written in pure Go 1.25+).

Why I built it:
Running personal AI agent frameworks (OpenClaw, CrewAI, AutoGen, LangChain) 24/7 on modest hardware is painful. Most idle at 180MB–1.2GB of RAM, take 8.5s–42s to cold-start, and pull in huge Python/Node dependency trees. In South Asia—and for anyone self-hosting on a $10 SBC, a $5 VPS, or a recycled Android phone—that overhead makes always-on personal agents impractical.

What MalikClaw v2.0.0 ("Agentic Era 2026") does differently:
- Single stripped Go 1.25+ static binary (~12–15 MB): hits a <10MB core edge idle RAM SLA on ARMv7/SBC targets (~14.2 MB idle RSS / ~28.5 MB peak RSS profiled on x86_64 Linux) and <0.8s cold boot.
- Defense-in-depth agent security:
  1. SSRF Network Boundary Firewall (`pkg/security/ssrf.go`: `ValidateURL` / `IsBlockedIP`) blocking RFC1918, CGNAT, link-local, cloud metadata hosts, and IPv4-mapped IPv6 bypasses with DNS re-verification across outbound web/HTTP/MCP calls.
  2. Prompt-Injection Structural Guard (`pkg/security/prompt_guard.go`: `WrapUntrusted` / `ScanPromptInjection`) isolating untrusted tool outputs inside escaped `<untrusted_data>` envelopes and scanning across 4 injection categories.
  3. Workspace directory jailing (`restrict_to_workspace`) and shell command filtering.
- SmartCostRouter (`pkg/routing/cost_router.go`): complexity-aware routing across `TierFast` (local Ollama / `gemini-2.5-flash` / `gpt-4o-mini`) -> `TierBalanced` -> `TierReasoning` frontier models with automatic fallback on 429/5xx responses.
- 5-stage agent loop (`pkg/agent/agentloop`): PLAN -> ACT -> OBSERVE -> REFLECT -> MEMORY UPDATE, persisting state to human-readable Markdown files (`SOUL.md`, `IDENTITY.md`, `USER.md`, `MEMORY.md`).
- Universal `SKILL.md` + MCP Client / Host: progressive YAML/JSON frontmatter + Markdown AST skill loader (`pkg/skills/loader.go`) and an MCP Client (`pkg/mcp/manager.go` using `modelcontextprotocol/go-sdk`) supporting `stdio`, `sse`, and `http` transports (note: MalikClaw is an MCP Client/Host right now, not yet an exposed MCP server).
- Native Android ADB & non-root Termux + 21 channels: unified Go `MessageBus` connecting 21 platforms (WhatsApp, Telegram, Discord, Slack, Matrix, IRC, Google Chat, Reddit, X, LinkedIn, etc.) plus Urdu-first RTL onboarding and 6 localized READMEs.

Architecture tradeoffs I'd love feedback on:
1. We added the SSRF firewall and `<untrusted_data>` structural prompt guard inside the Go runtime alongside workspace jailing so non-root Termux and $10 boards get defense-in-depth without mandatory Docker/WASM containers. Curious how security-focused folks here test/harden SSRF + indirect prompt injection on edge agents.
2. We use plain Markdown files for long-term memory instead of an embedded vector DB to stay within the <10MB edge SLA. At what memory scale do you find flat-file retrieval breaks down in practice?

Try it in one line:
  curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
  malikclaw onboard

Site & benchmarks: https://malikclaw.vercel.app
Happy to answer any questions about the Go memory footprint, SSRF/prompt guard design, SmartCostRouter, or benchmark methodology!
```

---

## 3. X / Twitter 9-Tweet Launch Thread

**Best Visuals:** Attach `assets/social-preview.png` (`1280x640`) or `assets/demo.gif` to Tweet 1, benchmark graphic to Tweet 2, security diagram to Tweet 3, SmartCostRouter graphic to Tweet 4, Android ADB demo clip to Tweet 5, and Bento Grid Web UI screenshot to Tweet 7. Every tweet body below is strictly `<= 280` characters for standard X posting.

**Tweet 1 (Hook + Verified Stat):**
> Most AI agents eat 350MB–1.2GB RAM idle & leave tools exposed to SSRF or prompt injection.
>
> We built MalikClaw v2.0.0 in pure Go 1.25+:
> • <10MB core SLA (~14.2 MB x86_64 RSS)
> • <0.8s boot
> • SSRF Firewall + Prompt Guard + SmartCostRouter
> • $10 boards & Android (MIT) 🧵👇

**Tweet 2 (The Problem + Benchmark Proof):**
> Running Python or Node.js agent gateways 24/7 on a Pi Zero, $5 VPS, or old phone shouldn't OOM.
>
> Verified benchmarks:
> • Python agents: 180–500MB RAM | 12.4–42s boot
> • OpenClaw (Node.js): 350MB–1.2GB RAM | 8.5–18s boot
> • MalikClaw (Go 1.25+): <10MB SLA (~14.2 MB RSS) | <0.8s boot

**Tweet 3 (v2.0.0 Security — SSRF Firewall & Prompt-Injection Guard):**
> Lightweight doesn't mean unprotected. MalikClaw v2.0.0 ships runtime security:
>
> 🛡️ SSRF Firewall — blocks RFC1918, CGNAT, metadata IPs & IPv6 bypasses on outbound web/MCP calls
> 🔒 Prompt-Injection Guard — isolates untrusted tool outputs in <untrusted_data> envelopes

**Tweet 4 (v2.0.0 SmartCostRouter):**
> Stop burning frontier API credits on everyday queries.
>
> ⚡ SmartCostRouter inspects prompt complexity & routes:
> • Simple tasks → free local Ollama or fast mini models
> • Hard reasoning → frontier LLMs with automatic 429/5xx fallback

**Tweet 5 (Everyday Life + Android ADB & Termux):**
> Your AI shouldn't stay trapped in a browser tab.
>
> MalikClaw has native Android ADB & Termux support:
> • "Take a screenshot & open WhatsApp on my phone"
> • "Summarize unread messages & set a morning briefing"
> • Or run headlessly 24/7 on a recycled Android phone.

**Tweet 6 (21 Channels + Universal SKILL.md + MCP Client):**
> One ~12–15 MB stripped Go binary, connected everywhere:
>
> • 21 channels: WhatsApp, Telegram, Discord, Slack, Matrix, Google Chat, IRC, X, LinkedIn, Reddit & more
> • Universal SKILL.md skills + MCP Client/Host (stdio/sse/http)
> • 100% offline with Ollama + DuckDuckGo

**Tweet 7 (Web UI + 5-Stage Agent Loop):**
> Zero terminal needed after setup:
>
> • Clean Bento Grid Web UI at localhost:18790
> • 5-stage loop: PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
> • Plain Markdown memory (SOUL.md, USER.md, MEMORY.md) — no heavy vector DB required.

**Tweet 8 (Global & Urdu-First Inclusion):**
> AI agents shouldn't only be built for $2,000 laptops.
>
> MalikClaw ships with Urdu-first RTL onboarding & UI alongside English, Japanese, French, Portuguese & Vietnamese — bringing private AI to $10 hardware worldwide.
>
> آگے بڑھو، ملک کلاؤ! 🦅

**Tweet 9 (1-Line Install + Canonical Links):**
> Try MalikClaw v2.0.0 in 30 seconds:
>
> `curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash`
> `malikclaw onboard`
>
> Windows `install.ps1` + docs:
> Site: https://malikclaw.vercel.app
> GitHub (MIT): https://github.com/AbdullahMalik17/malikclaw

---

## 4. Tailored Reddit Launch Posts

> **Rule:** Never cross-post identical text. Space posts 24–48 hours apart and actively reply to technical comments.

### 4.1 `r/LocalLLaMA` (Focus: SmartCostRouter + Local Ollama Efficiency + Prompt Guard)
**Title:** `I built a <10MB SLA Go agent engine with SmartCostRouter (Ollama → frontier fallback) & prompt-injection guard (MIT)`

**Body:**
```markdown
If you're running Llama 3.3, Qwen 2.5, or DeepSeek-R1 locally via Ollama, your GPU/RAM budget is already tight—the last thing you want is a Python or Node.js agent wrapper eating another 350MB–1.2GB of RAM just to route tool calls and chat messages.

I built **MalikClaw `v2.0.0`**, a single-binary personal AI agent engine in pure Go `1.25+` (`<10MB` core idle RAM SLA on edge SBCs, `~14.2 MB` measured idle RSS on x86_64 Linux, `<0.8s` cold boot) designed to put local models first.

**Why `r/LocalLLaMA` might like `v2.0.0`:**
- **SmartCostRouter (`pkg/routing/cost_router.go`):** Automatically routes simple everyday prompts to `TierFast` (local Ollama `qwen2.5:7b` / `gemini-2.5-flash` / `gpt-4o-mini`) and reserves `TierBalanced` / `TierReasoning` frontier models only for hard multi-step reasoning—with automatic fallback on `429`/`5xx`.
- **Prompt-Injection Structural Guard + SSRF Firewall:** Untrusted web/tool outputs are wrapped in escaped `<untrusted_data>` envelopes and scanned across 4 injection categories (`pkg/security/prompt_guard.go`), while `pkg/security/ssrf.go` blocks private/metadata IP access.
- **100% Local & Private Stack:** Pair MalikClaw + Ollama + SearXNG (or free zero-config DuckDuckGo) with plain Markdown memory (`MEMORY.md`, `USER.md`) instead of heavy vector DB stacks.
- **Universal `SKILL.md` + MCP Client:** Progressive `SKILL.md` loading plus an MCP Client (`stdio`/`sse`/`http`) to attach external MCP tool servers dynamically.
- **21 Channels + Android ADB:** Talk to your local model from Telegram, WhatsApp, Discord, Matrix, or the Web UI (`localhost:18790`), and automate an Android phone over ADB or Termux.

**Quick install:**
```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
malikclaw onboard
```

Website: https://malikclaw.vercel.app
GitHub (MIT): https://github.com/AbdullahMalik17/malikclaw

Would love feedback from folks running quantized local models—especially on tool-calling reliability and tier routing thresholds on 7B/8B models!
```

---

### 4.2 `r/golang` (Focus: Go `1.25+` Architecture, Security Packages, Concurrency, Embeddable Library)
**Title:** `MalikClaw v2.0: Pure Go 1.25+ autonomous AI agent runtime (<10MB edge SLA, SSRF firewall, prompt guard, MCP client)`

**Body:**
```markdown
Hey r/golang! I've been building **MalikClaw `v2.0.0`**, a single-binary personal AI agent runtime written in Go `1.25+` (`MIT` license).

Most agent frameworks are Python or TypeScript monoliths that struggle with cold starts, concurrency, and memory overhead. Go turned out to be an ideal fit for an always-on runtime that hits a `<10MB` core idle RAM SLA on 512MB ARMv7 boards (`~14.2 MB` idle RSS / `~28.5 MB` peak RSS on x86_64 Linux) and compiles to a `~12–15 MB` stripped static binary.

**Go engineering highlights (`v2.0.0`):**
- **Embeddable `agentloop` package (`pkg/agent/agentloop`):** Import the 5-stage loop (`Planner → Executor → Observer → Reflector → Memory Manager`) directly into Go services with `context.Context` timeouts and circuit-breaker retries.
- **SSRF Network Boundary Firewall (`pkg/security/ssrf.go`):** `ValidateURL` / `IsBlockedIP` blocks non-HTTP(S) schemes, cloud metadata endpoints, RFC1918/CGNAT/link-local/ULA ranges, and IPv4-mapped IPv6 bypasses with DNS re-verification.
- **Prompt-Injection Structural Guard (`pkg/security/prompt_guard.go`):** `WrapUntrusted` + `ScanPromptInjection` escapes nested `<untrusted_data>` delimiters and runs compiled regex scanners across 4 injection categories on untrusted tool outputs.
- **Complexity-Aware `SmartCostRouter` (`pkg/routing/cost_router.go`):** `ClassifyAndRoute` + `FallbackModels` across `TierFast`, `TierBalanced`, and `TierReasoning`.
- **21-Channel `MessageBus` + MCP Client + `SKILL.md`:** Decouples 21 messaging/social channels from agent goroutines, pairs `modelcontextprotocol/go-sdk` as an MCP Client (`stdio`/`sse`/`http`), and loads progressive `SKILL.md` frontmatter + Markdown AST.

**Minimal embedding example:**
```go
cfg := agentloop.DefaultLoopConfig("/home/user/workspace")
cfg.MaxIterations = 10
cfg.EnableReflection = true

loop := agentloop.NewAgentLoop(cfg, toolRegistry, provider)
defer loop.Close()

result, err := loop.ExecuteGoal(ctx, "Research Go 1.25 features and write go_features.md")
```

Website & benchmarks: https://malikclaw.vercel.app
Repo & Architecture docs: https://github.com/AbdullahMalik17/malikclaw

I'd really appreciate code reviews and architectural critiques from the Go community—especially around our SSRF DNS-rebinding defenses, `MessageBus` goroutine lifecycles, and allocation hot paths.
```

---

### 4.3 `r/selfhosted` (Focus: Non-Root `alpine:3.23` Docker, `$10` SBC / `$5` VPS, Privacy, Everyday Automation)
**Title:** `MalikClaw v2.0: Self-hosted AI assistant in pure Go (<10MB edge RAM, 21 chat channels, SSRF/prompt guard, local Web UI)`

**Body:**
```markdown
I wanted a self-hosted personal AI assistant I could leave running 24/7 on a Raspberry Pi Zero 2 W / `$5` VPS without dedicating 1GB of RAM to a Node or Python stack—and without giving an agent unchecked access to my LAN. So I built **MalikClaw `v2.0.0`** (MIT, Go `1.25+`).

**Self-hosting highlights:**
- **Tiny footprint:** `<10MB` core edge RAM SLA (`~14.2 MB` x86_64 idle RSS), `<0.8s` startup, `~12–15 MB` stripped static binary inside a non-root `alpine:3.23` multi-stage Docker container (`USER malikclaw`).
- **One-command Docker deploy:**
```bash
docker run -d --name malikclaw \
  -p 18790:18790 \
  -v ~/.malikclaw:/home/malikclaw/.malikclaw \
  ghcr.io/abdullahmalik17/malikclaw:latest
```
- **LAN-Safe by Default:** Built-in **SSRF Network Firewall** blocks private RFC1918/CGNAT/metadata IPs on agent web/MCP fetches, paired with **Prompt-Injection Structural Guard** and workspace jailing.
- **Smart Cost Routing:** Uses `SmartCostRouter` to keep simple queries on local **Ollama** / cheap mini models and only escalate complex tasks when needed.
- **Built-in Web Dashboard (`http://localhost:18790`) + 21 Chat Channels:** Connect WhatsApp, Telegram, Matrix, Discord, Slack, IRC, Google Chat, and more—with English & Urdu (RTL) support.
- **Home-lab bonus:** Native **Android ADB** automation to control a spare Android phone over USB/Wi-Fi, or run MalikClaw directly on an old phone via Termux.

Website: https://malikclaw.vercel.app
GitHub: https://github.com/AbdullahMalik17/malikclaw

Happy to help anyone setting it up on a Pi, Unraid, Proxmox LXC, or Termux!
```

---

## 5. LinkedIn Founder Story Post

```text
Most AI agent demos assume you have a $2,000 laptop, 32GB of RAM, and unlimited API credits.

That never sat right with me.

If autonomous AI is going to genuinely make everyday life easier—for students, families, solo builders, and developers across Pakistan, South Asia, and emerging markets—it has to run safely on the hardware people actually own: a $10 Orange Pi, a $5 VPS, or a recycled Android phone.

That's why I engineered MalikClaw in pure Go 1.25+.

Today we're rolling out MalikClaw v2.0.0 ("Agentic Era 2026") — 100% open source under MIT:

🦅 <10MB core idle RAM SLA (~14.2 MB x86_64 RSS) & <0.8s cold boot — up to 99% lighter than Node/Python agent stacks
🛡️ Defense-in-depth built in: SSRF Network Firewall + Prompt-Injection Structural Guard + workspace jailing
⚡ SmartCostRouter: automatically routes everyday tasks to fast/local Ollama models and hard reasoning to frontier LLMs
🧩 Universal SKILL.md ecosystem + Model Context Protocol (MCP) Client / Host (listed on MCP Market)
💬 21 messaging & social channels (WhatsApp, Telegram, Discord, Slack, Matrix, Google Chat, IRC, LinkedIn, X & more)
📱 Native Android ADB & non-root Termux phone automation
🌍 Urdu-first Right-to-Left (RTL) support alongside English, Japanese, French, Portuguese, and Vietnamese

Three engineering lessons from building v2.0.0:
1. Constraints force clarity. Targeting a 512MB ARMv7 board eliminated bloat that desktop-first frameworks ignore.
2. Security can't be a paid enterprise add-on. SSRF and indirect prompt injection hit personal self-hosted agents first, so they belong in the core runtime.
3. Accessibility is a technical feature, not an afterthought. Urdu RTL onboarding, SmartCostRouter cost savings, and $10 hardware support open the agentic era to millions who were priced out.

Try MalikClaw v2.0.0 in 30 seconds:
🔗 Website: https://malikclaw.vercel.app
🔗 GitHub: https://github.com/AbdullahMalik17/malikclaw
🔗 MCP Market: https://mcpmarket.com/server/malikclaw

If you're building in Go, self-hosting with Ollama, or passionate about accessible AI, I'd love your feedback—and a ⭐ on GitHub helps more builders discover it.

آگے بڑھو، ملک کلاؤ! 🦅

#OpenSource #Golang #AIAgents #MCP #LocalAI #EdgeAI #AppSec #SelfHosted #PakistanTech #BuildInPublic
```

---

## 6. Product Hunt Launch Kit

- **Product Name:** MalikClaw
- **Tagline (57 chars — limit 60):** `Ultra-light <10MB Go AI agent for $10 hardware & everyday`
- **Short Description (257 chars — limit 260):** `MalikClaw v2.0 is a pure Go 1.25+ personal AI agent (<10MB core RAM SLA, <0.8s boot). It automates WhatsApp, Telegram & Android ADB in English or Urdu, with built-in SSRF & prompt-injection guards, SmartCostRouter (Ollama → frontier), SKILL.md & MCP Client.`
- **Topics / Categories:** `Artificial Intelligence`, `Open Source`, `Developer Tools`, `Productivity`, `Privacy`

### Maker's First Comment
```text
Hey Product Hunt! 👋 I'm Abdullah, creator of MalikClaw.

I built MalikClaw because personal AI agents shouldn't require gigabytes of RAM, leak your local network via SSRF, or lock everyday users into a $20/month cloud bill.

With a single stripped Go 1.25+ binary (~12–15 MB), MalikClaw targets a <10MB core idle RAM SLA (~14.2 MB x86_64 RSS) and boots in <0.8s—meaning you can run a 24/7 autonomous assistant on a $10 Orange Pi Zero, a Raspberry Pi, a $5 VPS, or even an old Android phone via Termux.

What's new in v2.0.0 ("Agentic Era 2026"):
• Everyday-user friendly: 1-line install + `malikclaw onboard` for WhatsApp, Telegram, Discord, or the Bento Grid Web UI (`localhost:18790`) in English or Urdu (RTL).
• Native Android ADB control: Ask it to take screenshots, open apps, tap, or summarize messages on your phone.
• Defense-in-depth security: Built-in SSRF Network Firewall + Prompt-Injection Structural Guard (`<untrusted_data>` isolation) + workspace jailing.
• SmartCostRouter: Routes simple tasks to fast/local Ollama models and escalates complex tasks to frontier models automatically.
• Developer & ecosystem ready: 5-stage Plan→Act→Observe→Reflect→Memory loop, 21 channels, universal `SKILL.md` loader, and MCP Client / Host support.

Install in 1 line:
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash

Site: https://malikclaw.vercel.app
GitHub (MIT): https://github.com/AbdullahMalik17/malikclaw

We're 100% MIT open source and would love your feedback, questions, and feature requests below! 🦅
```

### 5 Product Hunt Gallery Slide Briefs
1. **Slide 1 — Hero Value Prop:** Dark-mode obsidian Bento card (`#050507`) with the MalikClaw Gryphon logo (`assets/logo.png`) + bold headline: `"MalikClaw v2.0.0 — Agentic Era 2026"` + metric pills: `<10MB RAM SLA` • `<0.8s Boot` • `$10 Hardware` • `Pure Go 1.25+ (MIT)`.
2. **Slide 2 — Benchmark Comparison Graphic:** Clean comparison visual: Idle RAM & Boot Time across Python Frameworks (`180–500MB` / `12.4–42s`), OpenClaw Node.js (`350MB–1.2GB` / `8.5–18s`), and **MalikClaw Go (`<10MB` core SLA / `~14.2 MB` x86_64 RSS / `<0.8s` boot)**.
3. **Slide 3 — Security & SmartCostRouter Architecture:** Clean visual diagram of `v2.0.0` pillars: **SSRF Network Firewall** + **Prompt-Injection Guard (`<untrusted_data>`)** + **`SmartCostRouter` (`Ollama` → Frontier fallback)** + **Universal `SKILL.md` + MCP Client**.
4. **Slide 4 — Android Phone & Everyday Life Automation (`localhost:18790`):** Split visual showing Urdu/English morning briefing on Web UI / WhatsApp alongside live Android ADB phone automation + icons of **21 supported channels**.
5. **Slide 5 — 1-Line Install & 5-Stage Agent Loop:** Terminal window showing `curl -fsSL ... | bash && malikclaw onboard` alongside the 5-stage `PLAN ➔ ACT ➔ OBSERVE ➔ REFLECT ➔ MEMORY` flow + `malikclaw.vercel.app` CTA.

---

## 7. 60-Second YouTube Shorts / X / Reels Demo Video Script

**Aspect Ratio:** Record in 16:9 for X/YouTube, with centered terminal/UI framing so it crops cleanly to 9:16 for Shorts/Reels.

| Time | Visual / Screen Action | Voiceover (Crisp, Conversational) | On-Screen Text Overlay |
| :--- | :--- | :--- | :--- |
| **0:00–0:08** | Split screen: `htop` showing a Python/Node agent at ~450MB RAM vs MalikClaw at `<10MB` core SLA (`~14.2 MB` x86_64 RSS). | "Why does your personal AI agent need half a gigabyte of RAM just to sit idle? Meet MalikClaw v2.0." | **`<10MB` Core RAM SLA • `<0.8s` Boot** |
| **0:08–0:20** | Terminal window: paste 1-line `curl` install, run `malikclaw onboard`, then run `malikclaw agent -m "Summarize system specs and save to specs.md"`. | "It's a single stripped Go binary—around 12 to 15 megabytes. One command installs it, SmartCostRouter picks local Ollama or frontier models automatically, and SSRF plus prompt-injection guards protect every tool call." | **`1-Line Install • SSRF + Prompt Guard • SmartCostRouter`** |
| **0:20–0:35** | Open `http://localhost:18790` Web UI, toggle Urdu RTL view, then show a Telegram/WhatsApp daily briefing triggering a free DuckDuckGo search. | "Connect it to 21 channels like WhatsApp, Telegram, and Discord, load universal SKILL.md packs and MCP tools, or run 100% offline—in English or Urdu." | **`21 Channels • MCP Client • SKILL.md • Urdu RTL`** |
| **0:35–0:50** | Side-by-side: command `"Take a screenshot and open WhatsApp on my phone"` executing live on a connected Android phone via ADB. | "Even better—it natively automates Android phones over ADB, and runs directly on a $10 Orange Pi or an old phone in Termux." | **`Native Android ADB & $10 Hardware`** |
| **0:50–0:60** | GitHub repo page (`AbdullahMalik17/malikclaw`) + `malikclaw.vercel.app` + star button highlight. | "MalikClaw v2.0 is 100% MIT open source. Grab the one-line installer at malikclaw.vercel.app and drop a star on GitHub!" | **`malikclaw.vercel.app • github.com/AbdullahMalik17/malikclaw`** |

---

## 8. Regional / Urdu & Roman Urdu Tech Community Launch Kit

Target channels: Pakistani university CS/SE societies (NUST, FAST, LUMS, GIKI, UET, COMSATS), Pakistan Go/AI WhatsApp & Discord groups, LinkedIn Pakistan Tech, and YouTube Shorts / TikTok tech creators.

### 8.1 Roman Urdu Post (WhatsApp / Discord / Facebook Dev Groups)
```text
Assalam-o-Alaikum devs! 🦅

Aksar log kehte hain ke apna personal AI agent chalane ke liye mehnga laptop ya $20/month cloud server chahiye. Is problem ko solve karne ke liye hum ne **MalikClaw v2.0.0** banaya hai — ek 100% open-source (MIT) AI agent engine jo pure **Go 1.25+** mein likha gaya hai.

🔥 Highlights jo v2.0.0 ko unique banati hain:
• Sirf **<10MB core RAM SLA** (`~14.2 MB` x86_64 RSS) aur **<1 second** mein boot (Python/Node frameworks se up to 99% halka)
• **$10 hardware** (Orange Pi / Raspberry Pi Zero) ya purane **Android phone (Termux)** par aaram se chalta hai
• **Built-in Security:** SSRF Network Firewall aur Prompt-Injection Structural Guard har external web/MCP call ko protect karte hain
• **SmartCostRouter:** Aasan kaam free local **Ollama** / mini model par aur mushkil kaam frontier model par khud route hota hai
• **Native Android ADB Automation:** Natural language mein bol kar phone control karein (screenshot, tap, swipe, app open)
• **21 Channels + SKILL.md + MCP Client:** WhatsApp, Telegram, Discord, Slack, X, LinkedIn aur bohat kuch
• **Urdu-First RTL Support:** English ke sath poora Urdu interface aur onboarding

30 seconds mein try karein:
`curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash`

Website: https://malikclaw.vercel.app
GitHub Repo: https://github.com/AbdullahMalik17/malikclaw

Agar aap Go, AI Agents, ya Self-Hosting mein interested hain to repo zaroor check karein, feedback dein, aur ⭐ star de kar Pakistani open-source ko support karein!

آگے بڑھو، ملک کلاؤ! 🦅
```

### 8.2 Urdu Script Post (LinkedIn / X / Community Announcements)
```text
🦅 ملک کلاؤ (MalikClaw v2.0.0) — ہر کسی کے لیے تیز، محفوظ اور کم وزن AI ایجنٹ!

اب اپنا ذاتی AI اسسٹنٹ چلانے کے لیے مہنگے کمپیوٹر یا کلاؤڈ سرور کی ضرورت نہیں۔ ملک کلاؤ خالص Go 1.25+ میں بنایا گیا ایک اوپن سورس (MIT) AI ایجنٹ انجن ہے جو:

✅ 10MB سے کم کور ریم SLA اور 1 سیکنڈ سے کم وقت میں اسٹارٹ ہوتا ہے
✅ بلٹ ان SSRF فائر وال اور Prompt-Injection گارڈ کے ساتھ محفوظ رہتا ہے
✅ SmartCostRouter کے ذریعے سادہ کام مفت مقامی Ollama اور مشکل کام جدید ماڈلز پر چلاتا ہے
✅ صرف 10 ڈالر کے ہارڈویئر (Orange Pi / Raspberry Pi) یا پرانے اینڈرائیڈ فون (Termux) پر چلتا ہے
✅ اردو (RTL) اور انگریزی سمیت 6 زبانوں، 21 چینلز (واٹس ایپ، ٹیلی گرام، ڈسکارڈ)، SKILL.md، MCP کلائنٹ اور Android ADB آٹومیشن کو سپورٹ کرتا ہے

آج ہی مفت آزمائیں اور GitHub پر اسٹار (⭐) دے کر کمیونٹی کا حصہ بنیں:
🌐 https://malikclaw.vercel.app
🔗 https://github.com/AbdullahMalik17/malikclaw

آگے بڑھو، ملک کلاؤ!
```

### 8.3 30-Second Roman Urdu YouTube Short / Reel Hook
> *"Kya aap jante hain aap apne purane Android phone ya sirf $10 ke board par apna 24/7 personal AI agent chala sakte hain — wo bhi `<10MB` core RAM SLA, built-in security guards aur Urdu mein? Ye hai MalikClaw v2.0, 100% free aur open source in Go..."* *(Cut directly to 1-line install + ADB phone screenshot demo + `malikclaw.vercel.app` & GitHub link in bio/pinned comment).*

---

## 9. 14-Day Step-by-Step Launch Calendar

| Day | Focus | Concrete Actions & Deliverables |
| :--- | :--- | :--- |
| **Day 1 (Pre-Launch)** | **Repo, Banners & Release Tag** | Verify `assets/social-preview.png` (`1280x640`) & `website/public/assets/og-banner.png` (`1200x630`), confirm canonical `https://malikclaw.vercel.app` links, configure GitHub topics (`ai-agent`, `golang`, `mcp`, `mcp-client`, `ollama`, `self-hosted`, `android-adb`, `urdu`), and cut tagged `v2.0.0` release with clean changelog & pre-built binaries. |
| **Day 2 (Pre-Launch)** | **Visual Assets & Demo Recording** | Record the 60-second English demo video + 30-second Roman Urdu Short; export 5 Product Hunt gallery slides; confirm `assets/demo.gif` and `assets/social-preview.png` load cleanly on mobile & desktop. |
| **Day 3 (Pre-Launch)** | **Immediate MCP Client & Discovery Submissions** | Refresh **MCP Market** (`https://mcpmarket.com/server/malikclaw`) to `v2.0.0`; submit as **MCP Client / Agent Host** to **Glama Clients** (`glama.ai/mcp/clients`), **PulseMCP Clients** (`pulsemcp.com/clients`), **MCP.so** (`MCP Client`), and **AlternativeTo** using verified local drafts in `docs/submissions/mcp-directories.md` (note: Smithery & Glama Server listings remain gated on a future `malikclaw mcp serve` bridge). |
| **Day 4 (Launch Day 1)** | **Show HN + X Thread Anchor** | Publish **Show HN** at 14:00 UTC + immediate Maker Comment. Publish **9-tweet X/Twitter thread** with `assets/social-preview.png` / demo video 30 mins later. Spend 4+ hours replying to every technical comment with zero defensiveness. |
| **Day 5** | **Reddit Wave 1 (`r/golang`)** | Post Go `1.25+` architecture, SSRF/prompt guard, `SmartCostRouter`, and embeddable library thread on `r/golang`. Engage deeply on goroutine, DNS rebinding, and memory questions. |
| **Day 6** | **LinkedIn Founder Story + Urdu Community Wave 1** | Publish LinkedIn founder story. Share Roman Urdu & Urdu posts in Pakistani dev Discord/WhatsApp groups and university CS societies. |
| **Day 7** | **Reddit Wave 2 (`r/LocalLLaMA`)** | Post `SmartCostRouter` + Ollama/local-LLM `<10MB` SLA gateway thread on `r/LocalLLaMA`. Share real `config.json` snippets for Llama 3.3 / Qwen 2.5 / DeepSeek-R1. |
| **Day 8** | **Awesome-List PR Blitz** | Open clean, guideline-compliant PRs to immediate eligible targets (`punkpeye/awesome-mcp-clients`, `e2b-dev/awesome-ai-agents`, `aloth/awesome-ai-agents`, `awesome-selfhosted/awesome-selfhosted-data`) from `docs/submissions/awesome-list-prs.md` (`avelino/awesome-go` after `v2.0.0` tag + coverage check). |
| **Day 9** | **Product Hunt Launch Day** | Launch on **Product Hunt** at 00:01 PT with tagline, `og-banner.png`, 5 gallery slides, and Maker Comment. Notify X, LinkedIn, and Discord communities to leave authentic feedback. |
| **Day 10** | **Reddit Wave 3 (`r/selfhosted`)** | Post non-root `alpine:3.23` Docker (`-v ~/.malikclaw:/home/malikclaw/.malikclaw`) + Raspberry Pi / `$5` VPS thread on `r/selfhosted`. |
| **Day 11** | **Technical Deep-Dive Blog Post** | Publish engineering article on Dev.to & Hashnode: *"How We Built a `<10MB` Core SLA AI Agent in Pure Go 1.25+ (SSRF, Prompt Guard & SmartCostRouter)"* linking back to GitHub and `https://malikclaw.vercel.app`. |
| **Day 12** | **Video Distribution Push** | Publish 60-second English demo on YouTube Shorts & X; publish 30-second Roman Urdu Short on YouTube Shorts / Instagram Reels / TikTok; share Termux guide on `r/termux`. |
| **Day 13** | **Community Triage & Quick-Win Release** | Triage all GitHub issues/PRs opened during launch week; ship `v2.0.1` hotfix addressing top onboarding friction points; thank first-time contributors publicly. |
| **Day 14** | **Retrospective & Proof Update** | Record verified post-launch metrics (GitHub stars `[INSERT LIVE COUNT]`, forks `[INSERT LIVE COUNT]`, Docker pulls `[INSERT LIVE COUNT]`, directory approvals), update `ACHIEVEMENTS_AUDIT_2026.md`, and share a transparent "2 Weeks After Launch" build-in-public update on X & LinkedIn. |

---

## 10. Social Preview & OG Banner Briefs

### 10.1 Asset Inventory & Exact Dimensions

| Asset | Exact Dimensions | Aspect Ratio | Target Placement | Source & Renderer |
| :--- | :---: | :---: | :--- | :--- |
| **`assets/social-preview.png`** | `1280 × 640` px | `2:1` | GitHub Repository Social Preview & top of `README.md` / `README.ur.md` | `assets/banners/v2-launch/social-preview-1280x640.html` / `render-banners.ps1` |
| **`website/public/assets/og-banner.png`** | `1200 × 630` px | `1.91:1` | Website `og:image`, `twitter:image` (`summary_large_image`), & Schema.org `SoftwareApplication` `image` (`malikclaw.vercel.app`) | `assets/banners/v2-launch/og-banner-1200x630.html` / `render-banners.ps1` |

### 10.2 Visual System, Safe Zones & Typography
- **Canvas & Depth:** Obsidian architectural dark mode (`#050507` primary background, `#0B0C10` Bento/glass card surfaces, `#0E1017` recessed pillar strip), `1px` architectural grid at `36px` spacing (`rgba(255,255,255,0.043)`), subtle top gradient hairline, and dual radial spotlight glows (**Gryphon Gold** `#F59E0B` top-left + **Electric Cyan** `#06B6D4` bottom-right).
- **Color Tokens:**
  - Primary Accent (Gryphon Gold): `#F59E0B` / `#FBBF24` / `#FEF08A`
  - Secondary Accent (Electric Cyan): `#06B6D4` / `#22D3EE` / `#A5F3FC`
  - Verification / Status (Emerald): `#10B981` / `#34D399`
  - Text Hierarchy: `#FFFFFF` headline, `#D4D4D8` subhead, `#A1A1AA` muted metadata
- **Safe Zone Law:** All critical typography, metric cards, Urdu pill, URL, and Gryphon showcase card sit inside the **central 80% safe zone** (`132px` horizontal / `68px` vertical padding on `1280×640`; `124px` horizontal / `67px` vertical padding on `1200×630`) so X/Twitter, LinkedIn, Slack, and GitHub thumbnails never crop content.
- **Typography Triad:**
  - Display / Body: `Geist` (`Black` 45–48px headline, `Medium` 16.4–17.5px subhead)
  - Technical / Badges: `Geist Mono` (`Bold` / `Medium` 10.0–12.5px)
  - Urdu RTL Accent: `"آگے بڑھو، ملک کلاؤ!"` (`RTL`, `Tahoma` / `Noto Nastaliq Urdu`, `#FEF08A` on gold-tinted obsidian pill)

### 10.3 Canonical Banner Copy & Visual Composition
- **Left Column (Core Narrative & Proof):**
  - Eyebrow Pills: `MalikClaw v2.0.0 — Agentic Era 2026` • `Pure Go 1.25+ • MIT`
  - Headline: `MalikClaw v2.0.0` / `Agentic Era 2026`
  - Subhead: `Autonomous AI for developers & everyday life — WhatsApp, Telegram, Android ADB & local Ollama in English or Urdu.`
  - 3 Metric Cards: `<10MB RAM` (`99% lighter core SLA`) • `<1s Boot` (`Single static Go binary`) • `$10 Hardware` (`SBC • Laptop • Termux`)
  - 4-Pillar Security & Ecosystem Bar: `SSRF Firewall • Prompt Guard • Smart Cost Router • MCP + SKILL.md`
  - Footer Strip: `"آگے بڑھو، ملک کلاؤ!"` + `github.com/AbdullahMalik17/malikclaw` (`1280×640`) / `malikclaw.vercel.app` (`1200×630`)
- **Right Column (Brand Mark & Runtime Telemetry):**
  - Embedded `assets/logo.png` framed in a Cyan-to-Gold gradient border with soft ambient glow
  - Miniature terminal status box (`malikclaw gateway :18790`):
    - `✓ SSRF Firewall      ENFORCED`
    - `✓ Prompt Guard       ISOLATED`
    - `✓ Smart Cost Router  Ollama → AI`
    - `✓ MCP + SKILL.md     21 Channels`
