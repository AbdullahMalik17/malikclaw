# Quick Start Guide 🚀

Welcome to **MalikClaw**! This guide will help you get your personal AI assistant up and running in under 2 minutes.

---

## 🏗️ Step 1: Installation

### Linux / macOS:
```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
```

### Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex
```

### Docker:
```bash
docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/root/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest
```

> For advanced methods (Source, Homebrew, Scoop, AUR), see the [Full Installation Guide](INSTALLATION.md).

---

## 🛠️ Step 2: Onboarding Wizard

MalikClaw features an interactive onboarding process to set up your workspace and initial model credentials. Run:

```bash
malikclaw onboard
```

**During onboarding, you will:**
1.  **Select Language**: Choose between Urdu (اردو), English, Japanese, French, Portuguese, or Vietnamese.
2.  **Configure Primary LLM**: Set up API keys for OpenRouter, OpenAI, Anthropic, Gemini, Zhipu, or DeepSeek.
3.  **Confirm Workspace**: Set up your workspace directory (`~/.malikclaw/workspace`).

---

## ⚙️ Step 3: API Key Configuration

Edit your configuration file at `~/.malikclaw/config.json`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openai/gpt-4o-mini",
      "api_key": "sk-your-openai-api-key"
    },
    {
      "model_name": "claude-3-5-sonnet",
      "model": "anthropic/claude-3-5-sonnet-20240620",
      "api_key": "sk-ant-your-anthropic-key"
    }
  ]
}
```

---

## 💬 Step 4: Interact with Your Assistant

### 1. Interactive Terminal UI (TUI):
Launch a persistent chat session with state memory and tool access:
```bash
malikclaw agent
```

### 2. Direct Command Prompt:
Send a quick query from terminal:
```bash
malikclaw agent -m "Summarize recent tech developments in edge computing"
```

### 3. Web Dashboard (Bento Grid UI):
Start the local gateway server and open **http://localhost:18790**:
```bash
malikclaw gateway
```

---

## 🚀 Step 5: Omnichannel Connections

Connect MalikClaw to your favorite messaging platforms and social networks:

- **Messaging Platforms**: [Telegram](channels/telegram/README.ur.md), [Discord](channels/discord/README.ur.md), [WhatsApp](channels/whatsapp/README.md), [Matrix](channels/matrix/README.md), WeCom, Slack, QQ
- **Social Networks**: TikTok, LinkedIn, Twitter/X, Reddit
- **Google Cloud Auth**: Set up [AntiGravity OAuth](ANTIGRAVITY_AUTH.md) for Google models.
- **Self-Evolution Engine**: Ask your agent: *"Audit your own codebase and fix any lint issues."*

---

### Need Help? 🆘
- Run `malikclaw help` for command documentation.
- Read the [Troubleshooting Guide](troubleshooting.md).
- Join our [GitHub Discussions](https://github.com/AbdullahMalik17/malikclaw/discussions).

