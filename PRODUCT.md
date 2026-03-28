# MalikClaw - Product Quick Start

> **آگے بڑھو، ملک کلاؤ!** (Let's Go, MalikClaw!)

Your ultra-efficient personal AI assistant that runs on **$10 hardware** with **<10MB RAM**.

---

## 🚀 One-Command Installation

### Linux/macOS (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex
```

### Docker

```bash
docker run -d \
  --name malikclaw \
  -p 18790:18790 \
  -v ~/.malikclaw:/root/.malikclaw \
  ghcr.io/abdullahmalik17/malikclaw:latest
```

---

## ⚙️ Setup (5 Minutes)

### Step 1: Run Onboarding

```bash
malikclaw onboard
```

This interactive setup will:
- Create configuration directory (`~/.malikclaw`)
- Generate default config with optimized settings
- Guide you through API key setup

### Step 2: Add API Keys

Edit `~/.malikclaw/config.json`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openai/gpt-4o-mini",
      "api_key": "sk-your-openai-key-here"
    }
  ],
  "tools": {
    "web": {
      "duckduckgo": { "enabled": true }
    }
  }
}
```

**Get Free API Keys:**
- LLM: [OpenRouter](https://openrouter.ai/keys) or [Zhipu](https://open.bigmodel.cn/)
- Web Search: [Tavily](https://tavily.com) (optional, DuckDuckGo is free)

### Step 3: Test Installation

```bash
malikclaw agent -m "Hello! What can you do?"
```

---

## 📱 Demo Tasks

Run the interactive demo:

```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/demo.sh | bash
```

### Demo 1: Control Your Phone (ADB)

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

**How it works:**
MalikClaw uses ADB (Android Debug Bridge) to control your phone. The agent translates natural language commands into ADB commands.

---

### Demo 2: Send Email (Gmail)

**Prerequisites:**
- Gmail account
- Enable Gmail API in config

**Setup:**

1. Enable Gmail in `config.json`:
```json
{
  "tools": {
    "gmail": {
      "enabled": true
    }
  }
}
```

2. Authenticate (first time):
```bash
malikclaw auth gmail
```

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

---

### Demo 3: Fetch Information (Web Search)

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

**Advanced:** Enable Tavily for AI-optimized search:
```json
{
  "tools": {
    "web": {
      "tavily": {
        "enabled": true,
        "api_key": "tvly-your-key-here",
        "max_results": 5
      }
    }
  }
}
```

---

## 🖥️ Web Interface

Access the web UI at: **http://localhost:18790**

### Features:
- Chat interface
- Status dashboard
- Demo task shortcuts
- Real-time execution logs

### Start Web UI:

```bash
# Start gateway (includes web UI)
malikclaw gateway

# Or use Docker
docker run -d -p 18790:18790 ghcr.io/abdullahmalik17/malikclaw:latest
```

Then open: http://localhost:18790

---

## 📚 CLI Reference

### Basic Commands

```bash
# Interactive chat
malikclaw agent

# Single command
malikclaw agent -m "Your command here"

# With timeout
malikclaw agent -m "Long running task" --timeout 5m

# Verbose output
malikclaw agent -m "Debug this" --verbose
```

### Management Commands

```bash
# Check status
malikclaw status

# View/edit config
malikclaw config view
malikclaw config edit

# Manage skills/plugins
malikclaw skills list
malikclaw skills install <skill-name>

# View logs
malikclaw logs --follow

# Check version
malikclaw version
```

---

## 🔧 Troubleshooting

### "Command not found" after installation

```bash
# Add to PATH
export PATH="$HOME/.local/bin:$PATH"

# Add to ~/.bashrc or ~/.zshrc for persistence
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### "API key not configured"

1. Open config: `malikclaw config edit`
2. Add your API key to `model_list`
3. Save and retry

### "ADB device not found"

```bash
# Check USB debugging is enabled on phone
# List connected devices
adb devices

# If empty, check USB cable and try:
adb kill-server
adb start-server
adb devices
```

### "Out of memory" on low-RAM devices

Enable low-memory mode in `config.json`:

```json
{
  "performance": {
    "max_concurrent_tasks": 1,
    "low_memory_mode": true,
    "gc_interval_seconds": 180
  }
}
```

---

## 📊 Performance Benchmarks

| Hardware | RAM Usage | Boot Time | Cost |
|----------|-----------|-----------|------|
| Orange Pi Zero | <10MB | <1s | $10 |
| Raspberry Pi Zero 2 W | <10MB | <1s | $15 |
| Old Android (Termux) | <15MB | <2s | Free* |
| x86_64 VPS | <10MB | <1s | $5/mo |

*Using recycled phone

---

## 🎯 Next Steps

1. **Explore Skills:** `malikclaw skills list`
2. **Join Community:** [GitHub Discussions](https://github.com/AbdullahMalik17/malikclaw/discussions)
3. **Read Docs:** [Full Documentation](https://github.com/AbdullahMalik17/malikclaw/blob/main/README.md)
4. **Contribute:** [Contributing Guide](https://github.com/AbdullahMalik17/malikclaw/blob/main/CONTRIBUTING.md)

---

## 📞 Support

- **Documentation:** https://github.com/AbdullahMalik17/malikclaw/wiki
- **Issues:** https://github.com/AbdullahMalik17/malikclaw/issues
- **Discussions:** https://github.com/AbdullahMalik17/malikclaw/discussions
- **Website:** https://malikclaw.io

---

## 📄 License

MIT License - See [LICENSE](https://github.com/AbdullahMalik17/malikclaw/blob/main/LICENSE) file.

---

<div align="center">

**🦅 Built with ❤️ for South Asian developers**

**آگے بڑھو، ملک کلاؤ!** (Let's Go, MalikClaw!)

</div>
