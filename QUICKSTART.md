# MalikClaw Quickstart Guide 🚀

Get up and running with **MalikClaw** in under 5 minutes. This guide will walk you through installation, configuration, CLI usage, Web UI access, and running your first autonomous AI workflows.

---

## ⚡ Step 1: Installation (30 Seconds)

Choose the installation method for your operating system:

### Linux / macOS / Termux
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

## ⚙️ Step 2: Interactive Onboarding Setup

Initialize your configuration directory (`~/.malikclaw/`) and configure your initial LLM model keys:

```bash
malikclaw onboard
```

The interactive wizard will prompt you for:
1. Workspace directory path (Default: `~/.malikclaw/workspace`).
2. Preferred primary LLM provider (OpenAI, Anthropic, Gemini, Ollama, OpenRouter, DeepSeek).
3. Provider API key.
4. Enabling web search tools (DuckDuckGo is enabled by default with zero key required).

---

## 📝 Step 3: Manual Configuration Editing (Optional)

You can view or edit your configuration at any time by editing `~/.malikclaw/config.json` or running:

```bash
malikclaw config edit
```

### Minimal `config.json` Example:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openai/gpt-4o-mini",
      "api_key": "sk-proj-your-openai-api-key"
    },
    {
      "model_name": "claude-3-5-haiku",
      "model": "anthropic/claude-3-5-haiku",
      "api_key": "sk-ant-your-anthropic-api-key"
    },
    {
      "model_name": "llama3.3",
      "model": "ollama/llama3.3",
      "api_base": "http://localhost:11434/v1"
    }
  ],
  "tools": {
    "web": {
      "duckduckgo": { "enabled": true }
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

---

## 🤖 Step 4: First Agent Execution (CLI)

Run a direct agent query from your terminal:

```bash
# Basic query
malikclaw agent -m "Hello! Introduce yourself and list available system tools."

# File management task
malikclaw agent -m "Create a file named hello.txt in the workspace containing 'Hello from MalikClaw'"

# Web research task
malikclaw agent -m "Search the web for the latest updates in Go 1.24 and summarize them in go124.md"
```

---

## 🖥️ Step 5: Start Web UI & Messaging Gateway

Launch the local HTTP server and Web UI dashboard:

```bash
malikclaw gateway
```

Open your browser and navigate to: **`http://localhost:18790`**

### Features:
- Real-time chat interface with active agent loops.
- Live resource monitoring (RAM, CPU, boot time, active tasks).
- Model switching and tool toggling dashboard.
- Channel management for Telegram, Discord, WhatsApp, and social networks.

---

## 💻 Step 6: Embed MalikClaw in Go Code

You can also use MalikClaw directly as a Go package in your own applications:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/agentloop"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	// 1. Initialize Model Provider
	provider, err := providers.NewOpenAIProvider("sk-proj-your-api-key", "gpt-4o-mini")
	if err != nil {
		log.Fatalf("Provider initialization failed: %v", err)
	}

	// 2. Initialize Tool Registry
	toolRegistry := tools.NewRegistry("/path/to/workspace")
	_ = toolRegistry.RegisterDefaults()

	// 3. Configure Agentic Loop
	cfg := agentloop.DefaultLoopConfig("/path/to/workspace")
	loop := agentloop.NewAgentLoop(cfg, toolRegistry, provider)
	defer loop.Close()

	// 4. Run Goal
	result, err := loop.ExecuteGoal(ctx, "Fetch current system uptime and save to uptime.txt")
	if err != nil {
		log.Fatalf("Goal execution failed: %v", err)
	}

	fmt.Printf("Goal Success: %t | Actions: %d | Time Taken: %s\n",
		result.Success, result.ActionsTaken, result.Duration)
}
```

---

## 📱 Real-World Demo Workflows

### 1. Android Phone Control (ADB)
Requires an Android phone connected via USB/Wi-Fi with USB Debugging enabled:

```bash
# Take screenshot
malikclaw agent -m "Take a screenshot of my connected Android phone"

# Tap screen coordinates
malikclaw agent -m "Tap at screen coordinates 400, 800 on my phone"

# Launch WhatsApp
malikclaw agent -m "Open WhatsApp on my phone and send 'Hello' to my recent contact"
```

### 2. Social Media & Omnichannel Automation
```bash
# Monitor Twitter mentions
malikclaw agent -m "Check Twitter for brand mentions of @MyProject and summarize recent tweets"

# Unread LinkedIn Messages
malikclaw agent -m "Read unread LinkedIn messages via Playwright context and draft responses"
```

### 3. Email Automation (Gmail)
```bash
# Authenticate Gmail OAuth
malikclaw auth gmail

# Read and summarize emails
malikclaw agent -m "Show my 5 most recent unread emails and draft replies for urgent ones"
```

---

## 🎯 Next Steps

- Explore full platform installation options: [INSTALLATION.md](INSTALLATION.md)
- Learn about the system architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- Read security sandboxing guidelines: [SECURITY.md](SECURITY.md)
- See frequently asked questions: [FAQ.md](FAQ.md)
