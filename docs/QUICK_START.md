# Quick Start Guide 🚀

Welcome to **MalikClaw**! This guide will help you get your personal AI assistant up and running in less than 2 minutes.

---

## 🏗️ Step 1: Installation

The fastest way to install MalikClaw is via our automated script (macOS/Linux) or a precompiled binary.

### macOS / Linux
```bash
curl -sSfL https://malikclaw.io/install.sh | sh
```

### Windows
Download the latest `malikclaw_Windows_x86_64.zip` from our [Releases Page](https://github.com/AbdullahMalik17/malikclaw/releases), extract it, and add the folder to your system PATH.

> For advanced methods (Docker, Source), see the [Full Installation Guide](/docs/installation).

---

## 🛠️ Step 2: Onboarding

MalikClaw features an interactive onboarding process that sets up your workspace and initial configuration. Run:

```bash
malikclaw onboard
```

**During onboarding, you will:**
1.  **Select Language**: Choose between Urdu (اردو) or English.
2.  **Configure LLM**: Set up your primary model (OpenRouter, Zhipu, etc.).
3.  **Workspace**: Confirm where your agent's personality and memory files will live.

---

## ⚙️ Step 3: Add API Keys

Open your configuration file located at `~/.malikclaw/config.json` and add your provider credentials.

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o",
      "model": "openai/gpt-4o",
      "api_key": "sk-your-openai-key"
    },
    {
      "model_name": "claude-3.5-sonnet",
      "model": "anthropic/claude-3-5-sonnet-20240620",
      "api_key": "sk-ant-your-key"
    }
  ]
}
```

---

## 💬 Step 4: Start Chatting

You can interact with MalikClaw directly from your terminal in two ways:

### Interactive Mode (TUI)
Launch a persistent session with memory and tool access:
```bash
malikclaw agent
```

### One-off Command
Ask a quick question without entering the TUI:
```bash
malikclaw agent -m "Analyze the latest trends in edge computing"
```

---

## 🚀 Step 5: Expand Your Reach

Now that your agent is running, connect it to your favorite apps:

- **Messaging**: [Telegram](/docs/channels/telegram), [Discord](/docs/channels/discord), [WhatsApp](/docs/channels/whatsapp)
- **Advanced Auth**: Set up [AntiGravity OAuth](/docs/antigravity/auth) for Google Cloud models.
- **Self-Evolution**: Try asking your agent: *"Check your own code for potential optimizations."*

---

### Need Help? 🆘
- Run `malikclaw help` for a list of all commands.
- Check the [Troubleshooting Guide](/docs/troubleshooting).
- Join our [GitHub Discussions](https://github.com/AbdullahMalik17/malikclaw/discussions).
