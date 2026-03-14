# Quick Start Guide 🚀

Get MalikClaw up and running in less than 2 minutes.

---

## 1. Installation

The easiest way to install MalikClaw is to use our precompiled binaries.

```bash
# Download and install (macOS/Linux)
curl -sSfL https://malikclaw.io/install.sh | sh
```

For more options (source, Docker), see the [Installation Guide](/docs/installation).

## 2. Onboarding

Initialize your configuration and workspace with the `onboard` command:

```bash
malikclaw onboard
```

Follow the interactive prompts to:
- Select your primary language (Urdu or English).
- Configure your primary LLM provider (OpenRouter, Zhipu, etc.).
- Set up your workspace location.

## 3. Configuration

MalikClaw stores its configuration in `~/.malikclaw/config.json`. Add your API keys there:

```json
{
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-api-key"
    }
  ]
}
```

## 4. Start Chatting

Launch the agent in interactive mode:

```bash
malikclaw agent
```

Or send a one-off message:

```bash
malikclaw agent -m "Help me plan my week"
```

## 5. Next Steps

- [Connect to Telegram](/docs/channels/telegram)
- [Add Custom Skills](/docs/skills)
- [Explore Self-Evolution](/docs/architecture#self-evolution)
