# MalikClaw v2.0.0 ("Agentic Era 2026") — Multi-Channel Launch Campaign Kit

> **Target Release:** MalikClaw v2.0.0 ("Agentic Era 2026")  
> **Repository:** `https://github.com/AbdullahMalik17/malikclaw`  
> **MCP Listing:** `https://mcpmarket.com/server/malikclaw`  
> **Campaign Rule:** Every stat is verified from the codebase (`<10MB` idle RAM, `<0.8s` cold start, single Go binary, 15+ channels, native Android ADB/Termux, MCP support, Urdu-first RTL). Live-fluctuating numbers use `[INSERT CURRENT COUNT]`.

---

## 1. Positioning & Messaging Matrix

### 1.1 One-Line Hook (≤12 Words)
> **A `<10MB` Go AI agent that runs on `$10` hardware and old Android phones.**

*(Alternate Developer Hook)*: **Zero-dependency Go AI agent: `<10MB` RAM, `<0.8s` boot, 15+ channels, MCP + ADB.**

### 1.2 Developer Pitch (30 Seconds)
> Most personal AI agents drag in 300MB–1.2GB of Python or Node.js dependencies before doing a single useful task. **MalikClaw** is a single static Go binary that idles under **10MB RAM**, boots in **under 0.8 seconds**, and runs a deterministic 5-stage agent loop (`PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE`) with persistent Markdown memory. It connects to **15+ messaging/social channels**, speaks **MCP (Model Context Protocol)**, supports **Ollama** for 100% offline execution, jails tools to a strict workspace sandbox, and controls Android phones natively via ADB or Termux—all installable in one command.

### 1.3 Everyday-User "Make Life Easy" Pitch (30 Seconds)
> You shouldn't need a `$1,500` laptop or a `$20/month` subscription to have a private AI assistant that actually helps you get things done. **MalikClaw** turns an old Android phone, a `$10` Raspberry/Orange Pi, or any home computer into your personal assistant—in **English or Urdu (RTL)**. Message it on WhatsApp, Telegram, or its clean web dashboard (`localhost:18790`) to summarize emails, search the web for free, organize daily tasks, or even tap and automate apps on your Android phone—while keeping your data 100% private on your own device.

---

## 2. Hacker News (Show HN) Launch Kit

**Timing:** Tuesday or Wednesday, 13:30–14:30 UTC (8:30–9:30 AM ET).  
**URL Field:** `https://github.com/AbdullahMalik17/malikclaw`

### Title (≤80 characters)
```text
Show HN: MalikClaw – <10MB RAM, <0.8s boot personal AI agent in Go (MCP + ADB)
```

### Maker's First Comment (Post immediately after submission)
```text
Hi HN, I'm Abdullah, the creator of MalikClaw (MIT-licensed, written in pure Go).

Why I built it:
Over the past year, personal AI agent frameworks (OpenClaw, CrewAI, AutoGen, LangChain) got really capable, but running them 24/7 on modest hardware is painful. Most idle at 200MB–1GB+ of RAM, take 10–30 seconds to cold-start, and pull in huge Python/Node dependency trees. In South Asia—and for anyone self-hosting on a $10 SBC, a $5 VPS, or a recycled Android phone—that overhead makes always-on personal agents impractical.

What MalikClaw does differently:
- Single static Go binary (~30MB, Alpine Docker image <15MB), idling at <10MB RAM with <0.8s cold start (benchmarked on a single-core 0.8GHz ARMv7 Orange Pi Zero with 512MB RAM and a 1 vCPU / 1GB x86_64 VPS).
- 5-stage agent loop (`pkg/agent/agentloop`): PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE, persisting state to human-readable Markdown files (`SOUL.md`, `IDENTITY.md`, `USER.md`, `MEMORY.md`).
- Security-first local execution: strict workspace directory jailing (`restrict_to_workspace`), shell command regex filtering (blocking privilege escalation and destructive pipes), and path traversal guards.
- Native Android ADB & non-root Termux support: translate natural language into phone automation (screenshots, tap, swipe, type, launch apps) or run the agent directly on an old Android phone (<15MB RAM).
- Omnichannel + MCP: unified Go channel `MessageBus` connecting 15+ platforms (Telegram, Discord, WhatsApp, Matrix, Slack, etc.), third-party MCP servers, and local models via Ollama (plus OpenAI, Anthropic, Gemini, DeepSeek, Groq, OpenRouter).
- Urdu-first RTL localization alongside English, Japanese, French, Portuguese, and Vietnamese.

Architecture tradeoffs I'd love feedback on:
1. We chose regex-based shell filtering + workspace jailing over mandatory Docker/WASM containers so it runs natively inside non-root Termux and $10 boards. Curious how security-focused folks here would harden this further without breaking edge portability.
2. We use plain Markdown files for long-term memory instead of a vector DB to keep RAM under 10MB. At what memory size do you feel flat-file retrieval breaks down in practice?

Try it in one line:
  curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
  malikclaw onboard

Happy to answer any questions about the Go memory pooling, ADB tool design, or benchmark methodology!
```

---

## 3. X / Twitter 7-Tweet Launch Thread

**Best Visuals:** Attach `assets/demo.gif` (or 30s screen recording) to Tweet 1, benchmark table image to Tweet 2, Android ADB demo clip to Tweet 4, and Bento Grid Web UI screenshot to Tweet 5.

**Tweet 1 (Hook + Verified Stat):**
> Most personal AI agents eat 500MB–1GB of RAM just sitting idle.
>
> We built **MalikClaw v2.0** in pure Go:
> • `<10MB` idle RAM (99% lighter)
> • `<0.8s` cold start
> • Runs on `$10` hardware & old Android phones
> • 100% open source (MIT)
>
> Here's what's inside 🧵👇

**Tweet 2 (The Problem + Benchmark Proof):**
> Running Python or Node.js agent gateways 24/7 on a Raspberry Pi Zero, a `$5` VPS, or an old smartphone shouldn't crash with OOM errors.
>
> Benchmarked on a 512MB Orange Pi Zero:
> • Python agents: 180–500MB RAM | 12–42s boot
> • Node.js gateways: 350MB–1.2GB RAM | 8.5–18s boot
> • MalikClaw (Go): `<10MB` RAM | `<0.8s` boot

**Tweet 3 (Architecture That Scales Down AND Up):**
> Lightweight doesn't mean toy. Under the hood, MalikClaw runs a 5-stage production loop:
>
> `PLAN ➔ ACT ➔ OBSERVE ➔ REFLECT ➔ MEMORY UPDATE`
>
> • Persistent Markdown memory (`SOUL.md`, `USER.md`, `MEMORY.md`)
> • Workspace jailing + shell regex sandbox
> • Embeddable directly as a Go library (`pkg/agent/agentloop`)

**Tweet 4 (Everyday Life + Android ADB Magic):**
> Your AI shouldn't stay trapped in a browser tab.
>
> MalikClaw has **native Android ADB & Termux support**:
> • "Take a screenshot of my phone"
> • "Open WhatsApp and check unread messages"
> • Or run the entire agent headlessly on a recycled Android phone using `<15MB` RAM.

**Tweet 5 (Omnichannel + MCP + Local Privacy):**
> One binary (`~30MB`), connected everywhere:
> • 15+ channels: Telegram, WhatsApp, Discord, Slack, Matrix, X, LinkedIn, Reddit & more
> • Dynamic **MCP (Model Context Protocol)** server support (listed on MCP Market)
> • 100% offline with **Ollama** (Llama 3.3, DeepSeek-R1, Qwen 2.5) + free DuckDuckGo search
> • Clean Bento Grid Web UI on `localhost:18790`

**Tweet 6 (Global & Urdu-First Inclusion):**
> AI agents shouldn't only be built for `$2,000` MacBooks in Silicon Valley.
>
> MalikClaw ships with **Urdu-first RTL UI & onboarding** alongside English, Japanese, French, Portuguese, and Vietnamese—making autonomous AI accessible on `$10` boards across South Asia and the world.
>
> آگے بڑھو، ملک کلاؤ! 🦅

**Tweet 7 (1-Line Install + GitHub CTA):**
> Try MalikClaw in 30 seconds:
>
> Linux / macOS / Termux:
> `curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash`
>
> Windows:
> `irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex`
>
> GitHub (MIT): https://github.com/AbdullahMalik17/malikclaw
>
> Star ⭐ the repo if you believe local AI should run anywhere!

---

## 4. Tailored Reddit Launch Posts

> **Rule:** Never cross-post identical text. Space posts 24–48 hours apart and actively reply to technical comments.

### 4.1 `r/LocalLLaMA` (Focus: Local Ollama Efficiency, Zero-Overhead Gateway, Privacy)
**Title:** `I built a <10MB RAM Go agent engine for Ollama/local models that runs on $10 SBCs and old Android phones (MIT)`

**Body:**
```markdown
If you're running Llama 3.3, Qwen 2.5, or DeepSeek-R1 locally via Ollama, your GPU/RAM budget is already tight—the last thing you want is a Python or Node.js agent wrapper eating another 500MB–1GB of RAM just to route tool calls and chat messages.

I built **MalikClaw**, a zero-dependency personal AI agent engine in pure Go (`<10MB` idle RAM, `<0.8s` cold start) designed to sit cleanly in front of Ollama (`http://localhost:11434/v1`) or any OpenAI-compatible local/cloud API.

**Why r/LocalLLaMA might like it:**
- **100% Local & Private Stack:** Pair MalikClaw + Ollama + SearXNG (or free zero-config DuckDuckGo) for a completely offline/private assistant with zero telemetry.
- **5-Stage Agent Loop:** `PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE` with human-readable Markdown memory (`MEMORY.md`, `USER.md`) instead of heavy vector DB stacks.
- **MCP Support:** Attach third-party Model Context Protocol servers dynamically without running a heavy host app.
- **Omnichannel + Android ADB:** Talk to your local model from Telegram, WhatsApp, Discord, Matrix, or the built-in Web UI (`localhost:18790`), and even automate an Android phone over USB/Wi-Fi ADB.
- **Runs on Tiny Edge Hardware:** Tested on a 512MB Orange Pi Zero, Raspberry Pi Zero 2 W, and non-root Android Termux (`<15MB` RAM).

**Quick install:**
```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
malikclaw onboard
```

GitHub (MIT): https://github.com/AbdullahMalik17/malikclaw

Would love feedback from folks running quantized local models—especially on how you handle tool-calling reliability and context window budgeting on smaller 7B/8B models!
```

---

### 4.2 `r/golang` (Focus: Go Architecture, Concurrency, Memory Pooling, Embeddable Library)
**Title:** `MalikClaw: A <10MB RAM, <0.8s cold-start autonomous AI agent engine written in pure Go (embeddable library + CLI)`

**Body:**
```markdown
Hey r/golang! I've been building **MalikClaw**, a single-binary personal AI agent engine written in Go 1.21+ (`MIT` license).

Most agent frameworks are Python or TypeScript monoliths that struggle with cold starts, concurrency, and memory usage. Go turned out to be a great fit for building an always-on agent runtime that runs comfortably on a 512MB ARMv7 board.

**Go engineering highlights:**
- **Embeddable `agentloop` package (`pkg/agent/agentloop`):** You can import the 5-stage loop (`Planner → Executor → Observer → Reflector → Memory Manager`) directly into your own Go microservices with `context.Context` timeouts and circuit-breaker retries.
- **Channel-driven `MessageBus`:** Decouples 15+ inbound/outbound webhook and polling channels (Telegram, Discord, Slack, Matrix, WhatsApp, etc.) from agent execution goroutines without blocking.
- **Memory & Binary Footprint:** Optimized Go allocator pools keep idle RAM under **10MB** with `<0.8s` cold start, compiling down to a single static binary (`x86_64`, `arm64`, `armv7`, `riscv64`) and a `<15MB` multi-stage Alpine Docker image.
- **Sandboxed Tool Registry (`pkg/tools`):** Workspace jailing (`restrict_to_workspace`), relative path traversal guards, and regex shell filtering, plus dynamic **MCP (Model Context Protocol)** tool attachment.

**Minimal embedding example:**
```go
cfg := agentloop.DefaultLoopConfig("/home/user/workspace")
cfg.MaxIterations = 10
cfg.EnableReflection = true

loop := agentloop.NewAgentLoop(cfg, toolRegistry, provider)
defer loop.Close()

result, err := loop.ExecuteGoal(ctx, "Research Go 1.24 features and write go_features.md")
```

Repo & Architecture docs: https://github.com/AbdullahMalik17/malikclaw

I'd really appreciate code reviews and architectural critiques from the Go community—especially around goroutine lifecycle management in the `MessageBus` and our zero-allocation hot-path goals on the roadmap.
```

---

### 4.3 `r/selfhosted` (Focus: Docker `<15MB` Image, `$10` SBC / `$5` VPS, Privacy, Everyday Automation)
**Title:** `MalikClaw: Self-hosted personal AI assistant in a <15MB Alpine Docker image (<10MB RAM, 15+ chat channels, local Web UI)`

**Body:**
```markdown
I wanted a self-hosted personal AI assistant I could leave running 24/7 on a Raspberry Pi Zero 2 W / `$5` VPS without dedicating 1GB of RAM to a Node or Python stack. So I built **MalikClaw** (MIT, Go).

**Self-hosting highlights:**
- **Tiny footprint:** `<10MB` idle RAM, `<1s` startup, multi-arch Alpine Docker image (`<15MB`).
- **One-command Docker deploy:**
```bash
docker run -d --name malikclaw \
  -p 18790:18790 \
  -v ~/.malikclaw:/root/.malikclaw \
  ghcr.io/abdullahmalik17/malikclaw:latest
```
- **Built-in Web Dashboard (`http://localhost:18790`):** Chat interface, live execution logs, status metrics, and task shortcuts—plus RTL/multilingual support.
- **Connect your existing chat apps:** Native gateway for Telegram, Matrix, Discord, WhatsApp, Slack, and more.
- **Privacy-first:** All memory is stored locally as plain Markdown files inside `~/.malikclaw`. Works with **Ollama** and **SearXNG** if you want zero cloud dependencies, or with DuckDuckGo (free, no API key) + any LLM API.
- **Bonus for home-labbers:** Includes native **Android ADB** automation so you can control a spare Android phone via natural language or run MalikClaw directly on an old phone via Termux.

GitHub: https://github.com/AbdullahMalik17/malikclaw

Happy to help anyone setting it up on a Pi, Unraid, Proxmox LXC, or Termux!
```

---

## 5. LinkedIn Founder Story Post

```text
Most AI agent demos assume you have a $2,000 laptop, 32GB of RAM, and unlimited cloud credits.

That never sat right with me.

If autonomous AI is going to genuinely make everyday life easier—for students, solo builders, and developers across Pakistan, South Asia, and emerging markets—it has to run on the hardware people actually own: a $10 Orange Pi, a $5 VPS, or a recycled Android smartphone.

That's why I engineered MalikClaw in pure Go.

Today we're rolling out MalikClaw v2.0 ("Agentic Era 2026") — 100% open source under MIT:

🦅 <10MB idle RAM & <0.8s cold start (up to 99% lighter than typical Python/Node agent frameworks)
📱 Native Android ADB & non-root Termux support (turn an old phone into an autonomous assistant)
💬 15+ messaging & social channels (WhatsApp, Telegram, Discord, Slack, Matrix, LinkedIn, X & more)
🔌 Model Context Protocol (MCP) support — already live on MCP Market
🛡️ Workspace jailing, shell regex sandboxing, and local-first Markdown memory (works 100% offline with Ollama)
🌍 Built with Urdu-first Right-to-Left (RTL) support alongside English, Japanese, French, Portuguese, and Vietnamese

Three engineering lessons from building this:
1. Constraints force clarity. Targeting a 512MB ARMv7 board eliminated bloat that desktop-first frameworks ignore.
2. Plain Markdown memory (`MEMORY.md`, `USER.md`) beats complex databases for personal transparency—users can read and edit everything their agent knows.
3. Accessibility is a technical feature, not an afterthought. Supporting Urdu RTL and $10 hardware opens the agentic era to millions who were priced out.

You can install and test MalikClaw in 30 seconds:
🔗 GitHub: https://github.com/AbdullahMalik17/malikclaw
🔗 MCP Market: https://mcpmarket.com/server/malikclaw

If you're building in Go, self-hosting with Ollama, or passionate about accessible AI, I'd love your feedback—and a ⭐ on GitHub helps more builders discover it.

آگے بڑھو، ملک کلاؤ! 🦅

#OpenSource #Golang #AIAgents #MCP #LocalAI #EdgeAI #SelfHosted #PakistanTech #BuildInPublic
```

---

## 6. Product Hunt Launch Kit

- **Product Name:** MalikClaw
- **Tagline (58 chars — limit 60):** `Ultra-light <10MB RAM Go AI agent for $10 hardware & phone`
- **Short Description (247 chars — limit 260):** `MalikClaw is an open-source, zero-dependency personal AI agent in Go. It boots in <0.8s on <10MB RAM, connects to 15+ chat channels & MCP servers, automates Android phones via ADB/Termux, supports Ollama offline, and ships with Urdu-first RTL UI.`
- **Topics / Categories:** `Artificial Intelligence`, `Open Source`, `Developer Tools`, `Productivity`, `Privacy`

### Maker's First Comment
```text
Hey Product Hunt! 👋 I'm Abdullah, creator of MalikClaw.

I built MalikClaw because personal AI agents shouldn't require gigabytes of RAM or lock your data inside a cloud subscription.

With a single static Go binary (~30MB), MalikClaw idles under 10MB RAM and boots in <0.8s—meaning you can run a 24/7 autonomous assistant on a $10 Orange Pi Zero, a Raspberry Pi, a $5 VPS, or even an old Android phone via Termux.

What makes v2.0 special:
• Everyday-user friendly: Chat via WhatsApp, Telegram, Discord, or the Bento Grid Web UI (`localhost:18790`) in English or Urdu (RTL).
• Native Android ADB control: Ask it to take screenshots, open apps, tap, or type on your phone.
• Developer & MCP ready: 5-stage Plan→Act→Observe→Reflect→Memory loop, embeddable Go library, workspace sandboxing, Ollama offline support, and dynamic MCP server integration.

Install in 1 line:
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash

We're 100% MIT open source and would love your feedback, questions, and feature requests below! 🦅
```

### 5 Product Hunt Gallery Slide Briefs
1. **Slide 1 — Hero Value Prop:** Dark-mode Bento card with the MalikClaw Gryphon logo + bold headline: `"Your Private AI Agent in <10MB RAM"` + sub-pills: `<0.8s Boot` • `$10 Hardware` • `MIT Open Source` • `Single Go Binary`.
2. **Slide 2 — Benchmark Comparison Graphic:** Clean bar/table visual comparing Idle RAM & Boot Time: Python Frameworks (`180–500MB` / `12–42s`) vs Node.js Gateways (`350MB–1.2GB` / `8.5–18s`) vs **MalikClaw Go (`<10MB` / `<0.8s`)**.
3. **Slide 3 — Bento Grid Web Dashboard (`localhost:18790`):** High-res screenshot of the real Web UI showing live chat, 5-stage loop execution logs, and RTL/Urdu language toggle.
4. **Slide 4 — Android Phone & Omnichannel Automation:** Split visual: Left side shows a terminal/WhatsApp prompt (`"Take a screenshot and summarize my unread messages"`), right side shows an Android phone executing via ADB + icons of 15+ supported channels.
5. **Slide 5 — 1-Line Install & Architecture Diagram:** Clean terminal window showing `curl -fsSL ... | bash && malikclaw onboard` alongside the 5-stage `PLAN ➔ ACT ➔ OBSERVE ➔ REFLECT ➔ MEMORY` flow + MCP + Ollama badges.

---

## 7. 60-Second YouTube Shorts / X / Reels Demo Video Script

**Aspect Ratio:** Record in 16:9 for X/YouTube, with centered terminal/UI framing so it crops cleanly to 9:16 for Shorts/Reels.

| Time | Visual / Screen Action | Voiceover (Crisp, Conversational) | On-Screen Text Overlay |
| :--- | :--- | :--- | :--- |
| **0:00–0:08** | Split screen: `htop` showing a Python/Node agent at ~450MB RAM vs MalikClaw at `<10MB` RAM. | "Why does your personal AI agent need half a gigabyte of RAM just to sit idle? Meet MalikClaw." | **`<10MB` RAM • `<0.8s` Boot** |
| **0:08–0:20** | Terminal window: paste 1-line `curl` install, run `malikclaw onboard`, then run `malikclaw agent -m "Summarize system specs and save to specs.md"`. | "It's a single Go binary—zero Python, zero Node. Install it in one command, and in under a second it plans, executes tools in a jailed sandbox, and saves memory as plain Markdown." | **`1-Line Install • Zero Dependencies`** |
| **0:20–0:35** | Open `http://localhost:18790` Bento Grid Web UI, switch briefly to Urdu RTL view, then show a Telegram/WhatsApp message triggering a free DuckDuckGo search. | "Connect it to 15+ apps like WhatsApp, Telegram, and Discord, attach MCP servers, or run 100% offline with Ollama—in English or Urdu." | **`15+ Channels • MCP • Ollama • Urdu RTL`** |
| **0:35–0:50** | Side-by-side: command `"Take a screenshot and open WhatsApp on my phone"` executing live on a connected Android phone via ADB. | "Even better—it natively automates Android phones over ADB, and runs directly on a $10 Orange Pi or an old phone in Termux." | **`Native Android ADB & $10 Hardware`** |
| **0:50–0:60** | GitHub repo page (`AbdullahMalik17/malikclaw`) + star button highlight + QR code / URL. | "MalikClaw is 100% free and MIT open source. Grab the one-line installer on GitHub and give it a star!" | **`github.com/AbdullahMalik17/malikclaw`** |

---

## 8. Regional / Urdu & Roman Urdu Tech Community Launch Kit

Target channels: Pakistani university CS/SE societies (NUST, FAST, LUMS, GIKI, UET, COMSATS), Pakistan Go/AI WhatsApp & Discord groups, LinkedIn Pakistan Tech, and YouTube Shorts / TikTok tech creators.

### 8.1 Roman Urdu Post (WhatsApp / Discord / Facebook Dev Groups)
```text
Assalam-o-Alaikum devs! 🦅

Aksar log kehte hain ke apna personal AI agent chalane ke liye mehnga laptop ya $20/month cloud server chahiye. Is problem ko solve karne ke liye hum ne **MalikClaw** banaya hai — ek 100% open-source (MIT) AI agent engine jo pure **Go** mein likha gaya hai.

🔥 Highlights jo isay unique banati hain:
• Sirf **<10MB RAM** aur **<1 second** mein boot (Python/Node frameworks se 99% halka)
• **$10 hardware** (Orange Pi / Raspberry Pi Zero) ya purane **Android phone (Termux)** par aaram se chalta hai
• **Native Android ADB Automation:** Natural language mein bol kar phone control karein (screenshot, tap, swipe, app open)
• **15+ Channels:** WhatsApp, Telegram, Discord, Slack, X, LinkedIn aur bohat kuch
• **Urdu-First RTL Support:** English ke sath poora Urdu interface aur onboarding
• **100% Private:** Ollama ke sath offline chalayein aur DuckDuckGo free search use karein

30 seconds mein try karein:
`curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash`

GitHub Repo: https://github.com/AbdullahMalik17/malikclaw

Agar aap Go, AI Agents, ya Self-Hosting mein interested hain to repo zaroor check karein, feedback dein, aur ⭐ star de kar Pakistani open-source ko support karein!

آگے بڑھو، ملک کلاؤ! 🦅
```

### 8.2 Urdu Script Post (LinkedIn / X / Community Announcements)
```text
🦅 ملک کلاؤ (MalikClaw v2.0) — ہر کسی کے لیے تیز، نجی اور کم وزن AI ایجنٹ!

اب اپنا ذاتی AI اسسٹنٹ چلانے کے لیے مہنگے کمپیوٹر یا کلاؤڈ سرور کی ضرورت نہیں۔ ملک کلاؤ خالص Go زبان میں بنایا گیا ایک اوپن سورس (MIT) AI ایجنٹ انجن ہے جو:

✅ 10MB سے کم ریم اور 1 سیکنڈ سے کم وقت میں اسٹارٹ ہوتا ہے
✅ صرف 10 ڈالر کے ہارڈویئر (Orange Pi / Raspberry Pi) یا پرانے اینڈرائیڈ فون (Termux) پر چلتا ہے
✅ اردو (RTL) اور انگریزی سمیت 6 زبانوں کو سپورٹ کرتا ہے
✅ واٹس ایپ، ٹیلی گرام، ڈسکارڈ سمیت 15+ پلیٹ فارمز اور Android ADB آٹومیشن کے ساتھ کام کرتا ہے
✅ Ollama کے ذریعے 100% آف لائن اور محفوظ طریقے سے چلایا جا سکتا ہے

آج ہی مفت آزمائیں اور GitHub پر اسٹار (⭐) دے کر کمیونٹی کا حصہ بنیں:
https://github.com/AbdullahMalik17/malikclaw

آگے بڑھو، ملک کلاؤ!
```

### 8.3 30-Second Roman Urdu YouTube Short / Reel Hook
> *"Kya aap jante hain aap apne purane Android phone ya sirf $10 ke board par apna 24/7 personal AI agent chala sakte hain — wo bhi sirf 10MB RAM mein aur Urdu mein? Ye hai MalikClaw, 100% free aur open source in Go..."* *(Cut directly to 1-line install + ADB phone screenshot demo + GitHub link in bio/pinned comment).*

---

## 9. 14-Day Step-by-Step Launch Calendar

| Day | Focus | Concrete Actions & Deliverables |
| :--- | :--- | :--- |
| **Day 1 (Pre-Launch)** | **Repo & Site Conversion Polish** | Fix `PRODUCT.md` Demo numbering; verify `malikclaw.io` vs Vercel canonical URL; add GitHub topics + `1280x640` social preview banner; tag release `v2.0.0` with clean changelog & pre-built binaries. |
| **Day 2 (Pre-Launch)** | **Visual Assets & Demo Recording** | Record the 60-second English demo video + 30-second Roman Urdu Short; export 5 Product Hunt gallery slides; confirm `assets/demo.gif` loads fast on mobile & desktop. |
| **Day 3 (Pre-Launch)** | **MCP Directory Submissions** | Add `smithery.yaml` and submit to **Smithery**, **Glama** (`glama.ai/mcp`), **PulseMCP**, and **MCP.so**; refresh **MCP Market** listing for v2.0.0. |
| **Day 4 (Launch Day 1)** | **Show HN + X Thread Anchor** | Publish **Show HN** at 14:00 UTC + immediate Maker Comment. Publish **7-tweet X/Twitter thread** with demo video 30 mins later. Spend 4+ hours replying to every technical comment with zero defensiveness. |
| **Day 5** | **Reddit Wave 1 (`r/golang`)** | Post Go-specific architecture & embeddable library thread on `r/golang`. Engage deeply on goroutine, memory pool, and sandboxing questions. |
| **Day 6** | **LinkedIn Founder Story + Urdu Community Wave 1** | Publish LinkedIn founder story. Share Roman Urdu & Urdu posts in Pakistani dev Discord/WhatsApp groups and university CS societies. |
| **Day 7** | **Reddit Wave 2 (`r/LocalLLaMA`)** | Post Ollama/local-LLM `<10MB` gateway thread on `r/LocalLLaMA`. Share real `config.json` snippets for Llama 3.3 / Qwen 2.5 / DeepSeek-R1. |
| **Day 8** | **Awesome-List PR Blitz** | Open clean, guideline-compliant PRs to `e2b-dev/awesome-ai-agents`, `punkpeye/awesome-mcp-servers`, `awesome-selfhosted/awesome-selfhosted`, and `avelino/awesome-go`. |
| **Day 9** | **Product Hunt Launch Day** | Launch on **Product Hunt** at 00:01 PT with tagline, 5 gallery slides, and Maker Comment. Notify X, LinkedIn, and Discord communities to leave authentic feedback. |
| **Day 10** | **Reddit Wave 3 (`r/selfhosted`)** | Post `<15MB` Alpine Docker + Raspberry Pi / `$5` VPS thread on `r/selfhosted`. |
| **Day 11** | **Technical Deep-Dive Blog Post** | Publish engineering article on Dev.to & Hashnode: *"How We Built a `<10MB` RAM AI Agent in Pure Go (Benchmarks & Architecture)"* linking back to GitHub. |
| **Day 12** | **Video Distribution Push** | Publish 60-second English demo on YouTube Shorts & X; publish 30-second Roman Urdu Short on YouTube Shorts / Instagram Reels / TikTok; share Termux guide on `r/termux`. |
| **Day 13** | **Community Triage & Quick-Win Release** | Triage all GitHub issues/PRs opened during launch week; ship `v2.0.1` hotfix addressing top onboarding friction points; thank first-time contributors publicly. |
| **Day 14** | **Retrospective & Proof Update** | Record verified post-launch metrics (GitHub stars `[INSERT CURRENT COUNT]`, forks, Docker pulls, directory approvals), update `ACHIEVEMENTS_AUDIT_2026.md`, and share a transparent "2 Weeks After Launch" build-in-public update on X & LinkedIn. |
