<div align="center">
  <img src="assets/image.png" alt="MalikClaw AI Agent running on $10 Linux SBC">

  <h1>MalikClaw 🦅</h1>

  <h3>Ultra-Efficient Personal AI Assistant</h3>
  <p><strong>Production-Grade • &lt;10MB RAM • &lt;1s Boot • $10 Hardware • Built for the World</strong></p>

  <p>
    <a href="https://github.com/AbdullahMalik17/malikclaw/actions/workflows/build.yml"><img src="https://github.com/AbdullahMalik17/malikclaw/actions/workflows/build.yml/badge.svg" alt="Build Status"></a>
    <img src="https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go&logoColor=white" alt="Golang 1.21+">
    <img src="https://img.shields.io/badge/Platform-Linux%2FmacOS%2FWindows%2FDocker-blue" alt="Platform Support">
    <a href="https://github.com/AbdullahMalik17/malikclaw/blob/main/LICENSE"><img src="https://img.shields.io/github/license/AbdullahMalik17/malikclaw?color=green" alt="MIT License"></a>
    <br>
    <a href="https://github.com/AbdullahMalik17/malikclaw/stargazers"><img src="https://img.shields.io/github/stars/AbdullahMalik17/malikclaw?style=social" alt="GitHub stars"></a>
    <a href="https://github.com/AbdullahMalik17/malikclaw/network/members"><img src="https://img.shields.io/github/forks/AbdullahMalik17/malikclaw?style=social" alt="GitHub forks"></a>
    <a href="https://github.com/AbdullahMalik17/malikclaw/issues"><img src="https://img.shields.io/github/issues/AbdullahMalik17/malikclaw" alt="GitHub issues"></a>
    <a href="https://malikclaw.io"><img src="https://img.shields.io/badge/Website-malikclaw.io-blue?style=flat&logo=google-chrome&logoColor=white" alt="Official Website"></a>
  </p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-community">Community</a>
</p>

[اردو](README.ur.md) | [日本語](README.ja.md) | [Português](README.pt-br.md) | [Tiếng Việt](README.vi.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [العربية](README.ar.md) | **English**

</div>

---

## 🚀 Quick Start

### One-Command Installation

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
3. **Test:** `malikclaw agent -m "Hello!"`

📖 **Full Guide:** [PRODUCT.md](PRODUCT.md) | [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## ✨ Features

### 🤖 Production-Grade Agent Loop

**NEW:** Advanced agentic architecture with full execution cycle:

```
PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
```

- **Intelligent Planning:** Goal decomposition into actionable steps
- **Resilient Execution:** Retry logic with exponential backoff and circuit breaker
- **Smart Observation:** Result capture, normalization, and confidence scoring
- **Deep Reflection:** Success/failure evaluation with lessons learned
- **Persistent Memory:** Episode storage with search and analytics

📖 **Technical Docs:** [pkg/agent/agentloop/README.md](pkg/agent/agentloop/README.md)

### 🌍 Multi-Language Support

- **Localized Interface:** Urdu, English, Japanese, French, Portuguese, Vietnamese, and growing
- **RTL Support:** Native Right-to-Left support for Urdu/Arabic users
- **Global Community:** Contributors from 6+ continents

### 🪶 Ultra-Lightweight

- **<10MB RAM** — 99% smaller than typical AI agents
- **<1s Boot** — 400X faster startup than Python-based alternatives
- **$10 Hardware** — Runs on Orange Pi Zero, Raspberry Pi Zero, old Android phones
- **Cross-Platform** — Linux, macOS, Windows, Docker

### 📱 Mobile Operation

- **ADB Control:** Screenshot, tap, swipe, type on Android devices
- **Termux Support:** Run directly on Android without root
- **Second Life:** Give your old phone a purpose as an AI assistant

### 💼 Business Integration

- **Gmail:** Send and manage emails
- **Calendar:** Schedule and manage events
- **MCP Support:** Odoo, custom business integrations
- **Multi-Channel:** Telegram, Discord, WhatsApp, Matrix, QQ, DingTalk, LINE, WeCom

### 🛠️ Self-Evolution

- **Guardian Engine:** Autonomous code improvement
- **Skill System:** Extensible via plugins
- **Web Search:** DuckDuckGo, Tavily, Brave, Perplexity, SearXNG

---

## 📊 Performance Comparison

| Metric | OpenClaw | NanoBot | **MalikClaw** |
|--------|----------|---------|---------------|
| **Language** | TypeScript | Python | **Go** |
| **RAM Usage** | >1GB | >100MB | **<10MB** |
| **Boot Time** (0.8GHz) | >500s | >30s | **<1s** |
| **Hardware Cost** | $599 | ~$50 | **$10** |
| **Privacy** | Cloud | Local | **100% Local** |

<img src="assets/compare.jpg" alt="Performance comparison chart" width="512">

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

#### 1. One-Command Install (Recommended)

See [Quick Start](#-quick-start) above.

#### 2. Build from Source

```bash
git clone https://github.com/AbdullahMalik17/malikclaw.git
cd malikclaw

# Build for current platform
make build

# Build and install
make install

# Build for multiple platforms
make build-all
```

#### 3. Docker

```bash
# Minimal (Alpine-based)
docker compose -f docker/docker-compose.yml up

# Full-featured (Node.js 24 for MCP support)
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

## 🎮 Demo

### Interactive Demo Script

Run the comprehensive demo showcasing all capabilities:

```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/demo.sh | bash
```

### Demo 1: Phone Control (ADB)

**Prerequisites:**
- Android device with USB debugging enabled
- ADB installed (`sudo apt install android-tools-adb`)

**Commands:**
```bash
# Take a screenshot
malikclaw agent -m "Take a screenshot of my phone"

# Tap at coordinates
malikclaw agent -m "Tap at position 500, 1000 on my phone"

# Type text
malikclaw agent -m "Type 'Hello World' on my phone"

# Open an app
malikclaw agent -m "Open WhatsApp on my phone"

# Swipe gesture
malikclaw agent -m "Swipe up on my phone screen"
```

### Demo 2: Email (Gmail)

**Prerequisites:**
- Gmail account
- Gmail API enabled in config

**Commands:**
```bash
# Send an email
malikclaw agent -m "Send an email to john@example.com with subject 'Meeting' and body 'Let's meet at 3pm tomorrow'"

# Check recent emails
malikclaw agent -m "Show my 5 most recent emails"

# Search emails
malikclaw agent -m "Find emails from last week about 'project'"

# Reply to email
malikclaw agent -m "Reply to the last email with 'Thanks, I'll review it'"
```

### Demo 3: Web Search

**Prerequisites:**
- Internet connection
- DuckDuckGo enabled by default (no API key needed)

**Commands:**
```bash
# Get current weather
malikclaw agent -m "What's the weather in Lahore today?"

# Search for news
malikclaw agent -m "What are the latest AI news today?"

# Research topic
malikclaw agent -m "Research quantum computing breakthroughs in 2025"

# Get documentation
malikclaw agent -m "Fetch the Go 1.25 release notes"

# Find tutorials
malikclaw agent -m "Find Go programming tutorials for beginners"
```

---

## 🖥️ Web Interface

Access the modern web UI at: **http://localhost:18790**

**Features:**
- Real-time chat interface
- Status dashboard (agent status, memory usage, tools, uptime)
- Demo task shortcuts
- Responsive design (mobile-friendly)
- Dark theme

**Start Web UI:**
```bash
malikclaw gateway
```

Or with Docker:
```bash
docker run -d -p 18790:18790 -v ~/.malikclaw:/root/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest
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
      "api_key": "sk-your-api-key-here"
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

**LLM Providers:**
- [OpenRouter](https://openrouter.ai/keys) - Multi-provider access
- [Zhipu](https://open.bigmodel.cn/) - Chinese LLM provider
- [Anthropic](https://console.anthropic.com) - Claude models
- [OpenAI](https://platform.openai.com) - GPT models

**Web Search (Optional):**
- [Tavily](https://tavily.com) - AI-optimized (1000 free queries/month)
- [Brave](https://brave.com/search/api) - Paid ($5/1000 queries)
- [Perplexity](https://www.perplexity.ai) - AI-powered
- [SearXNG](https://github.com/searxng/searxng) - Self-hosted, free

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
- TODO comment tracking

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

| Document | Description | Audience |
|----------|-------------|----------|
| [PRODUCT.md](PRODUCT.md) | **Quick start guide** (5-min setup) | New users |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Command cheat sheet | All users |
| [README.product.md](README.product.md) | Product overview | General |
| [pkg/agent/agentloop/README.md](pkg/agent/agentloop/README.md) | Agent loop architecture | Developers |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines | Contributors |
| [ROADMAP.md](ROADMAP.md) | Development roadmap | Community |

---

## 🔧 Troubleshooting

### Common Issues

**"Command not found" after installation:**
```bash
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**"API key not configured":**
1. Open config: `malikclaw config edit`
2. Add your API key to `model_list`
3. Save and retry

**"ADB device not found":**
```bash
# Check USB debugging is enabled on phone
# List connected devices
adb devices

# If empty, try:
adb kill-server
adb start-server
adb devices
```

**"Out of memory" on low-RAM devices:**
```json
{
  "performance": {
    "low_memory_mode": true,
    "max_concurrent_tasks": 1,
    "gc_interval_seconds": 180
  }
}
```

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
- 🔌 Build skills/plugins

### Development Setup

```bash
git clone https://github.com/AbdullahMalik17/malikclaw.git
cd malikclaw

# Download dependencies
make deps

# Run tests
make test

# Build
make build

# Run linters
make lint
```

---

## 📢 Community

Join our global community of developers and users:

- **GitHub:** [Discussions](https://github.com/AbdullahMalik17/malikclaw/discussions)
- **Website:** [malikclaw.io](https://malikclaw.io)
- **Twitter:** [@AbdullahMalik17](https://twitter.com/AbdullahMalik17)
- **Discord:** [Join Server](https://discord.gg/malikclaw) (coming soon)

---

## 📄 License

MIT License — See [LICENSE](LICENSE) file for details.

---

## 🌍 Built for the World

MalikClaw is proudly used by developers and organizations worldwide:

- 🌏 **Asia:** Pakistan, India, Japan, China, Vietnam, Philippines
- 🌍 **Europe:** Germany, France, UK, Netherlands, Poland
- 🌎 **Americas:** USA, Brazil, Canada, Mexico, Argentina
- 🌍 **Africa:** Nigeria, Egypt, South Africa, Kenya
- 🌏 **Oceania:** Australia, New Zealand

**Contributors from 20+ countries** and growing every day!

---

<div align="center">

**🦅 Built with ❤️ for the World**

**Empowering everyone with efficient AI — anywhere, anytime!**

</div>

---

## 📢 Recent Updates

### March 2026 - Production-Grade Agent Loop

**NEW:** Complete agent loop implementation with:
- **Planner:** Goal decomposition with LLM and heuristic planning
- **Executor:** Tool execution with retry, backoff, and circuit breaker
- **Observer:** Result capture, normalization, and confidence scoring
- **Reflector:** Success evaluation with lessons learned
- **Memory:** Persistent episode storage with search capabilities

**Files Added:**
- `pkg/agent/agentloop/` - Main orchestrator and configuration
- `pkg/agent/planner/planner.go` - Enhanced planning system
- `pkg/agent/executor/executor.go` - Resilient execution engine
- `pkg/agent/observer/observer.go` - Observation capture
- `pkg/agent/reflector/reflector.go` - Reflection engine
- `pkg/agent/memory/memory.go` - Memory management

**Product Enhancements:**
- One-command installers for Linux/macOS and Windows
- Interactive demo script showcasing phone, email, and search capabilities
- Modern web UI with chat interface and status dashboard
- Comprehensive documentation (PRODUCT.md, QUICK_REFERENCE.md)

---

<div align="center">

**🦅 Built with ❤️ for South Asian developers**

**آگے بڑھو، ملک کلاؤ!** (Let's Go, MalikClaw!)

</div>
