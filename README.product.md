<div align="center">
  <img src="assets/image.png" alt="MalikClaw AI Agent running on $10 Linux SBC">

  <h1>MalikClaw 🦅</h1>

  <h3>Ultra-Efficient Personal AI Assistant</h3>
  <p><strong>$10 Hardware · &lt;10MB RAM · &lt;1s Boot · آگے بڑھو، ملک کلاؤ!</strong></p>

  <p>
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-demo">Demo</a> •
    <a href="#-features">Features</a> •
    <a href="#-documentation">Documentation</a>
  </p>

  <p>
    <a href="https://github.com/AbdullahMalik17/malikclaw/actions/workflows/build.yml"><img src="https://github.com/AbdullahMalik17/malikclaw/actions/workflows/build.yml/badge.svg" alt="Build Status"></a>
    <img src="https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go&logoColor=white" alt="Golang 1.21+">
    <a href="https://github.com/AbdullahMalik17/malikclaw/blob/main/LICENSE"><img src="https://img.shields.io/github/license/AbdullahMalik17/malikclaw?color=green" alt="MIT License"></a>
    <a href="https://malikclaw.io"><img src="https://img.shields.io/badge/Website-malikclaw.io-blue?style=flat&logo=google-chrome&logoColor=white" alt="Official Website"></a>
  </p>

[اردو](README.ur.md) | [日本語](README.ja.md) | [Português](README.pt-br.md) | [Tiếng Việt](README.vi.md) | [Français](README.fr.md) | **English**

</div>

---

## 🚀 Quick Start

### One-Command Install

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex
```

**Docker:**
```bash
docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/root/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest
```

### Setup (5 Minutes)

1. **Run onboarding:** `malikclaw onboard`
2. **Add API keys:** Edit `~/.malikclaw/config.json`
3. **Test it:** `malikclaw agent -m "Hello!"`

📖 **Full Guide:** [PRODUCT.md](PRODUCT.md)

---

## 📱 Demo

Try these demo tasks to see MalikClaw in action:

### Control Your Phone (ADB)
```bash
malikclaw agent -m "Take a screenshot of my phone"
malikclaw agent -m "Tap at position 500, 1000 on my phone"
malikclaw agent -m "Type 'Hello World' on my phone"
malikclaw agent -m "Open WhatsApp on my phone"
```

### Send Email (Gmail)
```bash
malikclaw agent -m "Send an email to john@example.com with subject 'Meeting' and body 'Let's meet at 3pm'"
malikclaw agent -m "Show my 5 most recent emails"
malikclaw agent -m "Find emails from last week about 'project'"
```

### Fetch Information (Web Search)
```bash
malikclaw agent -m "What's the weather in Lahore today?"
malikclaw agent -m "What are the latest AI news today?"
malikclaw agent -m "Research quantum computing breakthroughs in 2025"
malikclaw agent -m "Find Go programming tutorials for beginners"
```

### Run Interactive Demo
```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/demo.sh | bash
```

---

## ✨ Features

### 🌍 Urdu-First Strategy
- **Bilingual Onboarding:** Interactive setup in Urdu and English
- **RTL Web UI:** Native Right-to-Left support for Urdu/Arabic
- **Pakistan-Centric:** Optimized for local workflows

### 🪶 Ultra-Lightweight
- **<10MB RAM** — 99% smaller than OpenClaw
- **<1s Boot** — 400X faster startup
- **$10 Hardware** — Runs on Orange Pi Zero, Raspberry Pi Zero

### 📱 Mobile Operation
- **ADB Control:** Screenshot, tap, swipe, type
- **Android Integration:** Works with any ADB-enabled device
- **Termux Support:** Run directly on Android

### 💼 Business Integration
- **Gmail:** Send and manage emails
- **Calendar:** Schedule and manage events
- **MCP Support:** Odoo, custom integrations

### 🛠️ Self-Evolution
- **Guardian Engine:** Autonomous code improvement
- **Skill System:** Extensible via plugins
- **Production-Grade Agent Loop:** PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE

---

## 📊 Comparison

| | OpenClaw | NanoBot | **MalikClaw** |
|---|---|---|---|
| **Language** | TypeScript | Python | **Go** |
| **RAM** | >1GB | >100MB | **<10MB** |
| **Startup** | >500s | >30s | **<1s** |
| **Cost** | $599 | ~$50 | **$10** |

<img src="assets/compare.jpg" alt="Performance comparison chart" width="512">

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MalikClaw Agent Loop                      │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │ Planner  │ → │ Executor │ → │ Observer │ → │ Reflector│ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       ↑                                              │      │
│       └──────────── Memory Manager ──────────────────┘      │
└─────────────────────────────────────────────────────────────┘
         │
         ├─→ Tools: ADB, Gmail, Web Search, Files, Shell
         ├─→ Providers: OpenAI, Anthropic, Gemini, Local
         └─→ Channels: Telegram, Discord, WhatsApp, Web
```

---

## 📦 Installation

### System Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| **Linux SBC** | Orange Pi Zero ($10) | Raspberry Pi 4 |
| **Android** | 2GB RAM, Termux | 4GB RAM |
| **Desktop** | 2GB RAM, any OS | 4GB RAM |
| **Docker** | 512MB RAM | 1GB RAM |

### Installation Methods

#### 1. Binary Install (Recommended)

See [One-Command Install](#-quick-start) above.

#### 2. Build from Source

```bash
git clone https://github.com/AbdullahMalik17/malikclaw.git
cd malikclaw
make build
make install
```

#### 3. Docker

```bash
# Minimal (Alpine)
docker compose -f docker/docker-compose.yml up

# Full-featured (Node.js for MCP)
docker compose -f docker/docker-compose.full.yml up
```

#### 4. Package Managers

**Homebrew (macOS):**
```bash
brew install malikclaw
```

**Scoop (Windows):**
```bash
scoop install malikclaw
```

**AUR (Arch Linux):**
```bash
yay -S malikclaw
```

---

## ⚙️ Configuration

### Basic Config

Edit `~/.malikclaw/config.json`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openai/gpt-4o-mini",
      "api_key": "sk-your-key-here"
    }
  ],
  "tools": {
    "web": {
      "duckduckgo": { "enabled": true },
      "tavily": { "enabled": false }
    },
    "shell": { "enabled": true },
    "file": { "enabled": true }
  },
  "performance": {
    "low_memory_mode": true,
    "max_concurrent_tasks": 2
  }
}
```

### Get API Keys

- **LLM:** [OpenRouter](https://openrouter.ai/keys), [Zhipu](https://open.bigmodel.cn/)
- **Web Search:** [Tavily](https://tavily.com), [Brave](https://brave.com/search/api/)
- **Gmail:** Enable in Google Cloud Console

---

## 🎯 Use Cases

### 1. Personal Assistant
- Manage emails and calendar
- Set reminders and alarms
- Search for information
- Control smart home devices

### 2. Developer Tool
- Code generation and review
- File operations and search
- Git operations
- Documentation lookup

### 3. Mobile Automation
- Automate repetitive phone tasks
- Take screenshots and extract text
- Send messages via WhatsApp
- Control apps remotely

### 4. Edge AI
- Run on low-power hardware
- Offline-capable with local models
- Privacy-first (data stays local)
- 24/7 operation with minimal power

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PRODUCT.md](PRODUCT.md) | **Quick start guide** |
| [README.md](README.md) | Full documentation |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [ROADMAP.md](ROADMAP.md) | Development roadmap |
| [pkg/agent/agentloop/README.md](pkg/agent/agentloop/README.md) | Agent loop architecture |

---

## 🔧 Troubleshooting

### Common Issues

**"Command not found"**
```bash
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

**"API key not configured"**
- Edit `~/.malikclaw/config.json`
- Add your API key to `model_list`

**"ADB device not found"**
- Enable USB debugging on phone
- Run `adb devices` to verify
- Check USB cable connection

**"Out of memory"**
- Enable `low_memory_mode` in config
- Reduce `max_concurrent_tasks` to 1

📖 **More Help:** [PRODUCT.md#troubleshooting](PRODUCT.md#troubleshooting)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute
- 🐛 Report bugs
- ✨ Add features
- 📝 Improve documentation
- 🌍 Translate to your language
- 💡 Share use cases

---

## 📢 Community

- **GitHub:** [Discussions](https://github.com/AbdullahMalik17/malikclaw/discussions)
- **Website:** [malikclaw.io](https://malikclaw.io)
- **Twitter:** [@AbdullahMalik17](https://twitter.com/AbdullahMalik17)

---

## 📄 License

MIT License — See [LICENSE](LICENSE) file for details.

---

<div align="center">

**🦅 Built with ❤️ for South Asian developers**

**آگے بڑھو، ملک کلاؤ!** (Let's Go, MalikClaw!)

</div>
