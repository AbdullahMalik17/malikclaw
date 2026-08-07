# Building a Stateful Conversational Chatbot

This tutorial guides you through building a production-ready, multi-channel conversational chatbot using **MalikClaw**. You will learn how to initialize the `AgentLoop`, persist session history, configure fallback models, and expose your agent across channels like Telegram or Discord.

---

## Architecture Overview

```
 [ User Message ] ──► [ Messaging Channel (Telegram/Discord) ]
                               │
                               ▼
                      [ Message Bus (bus) ]
                               │
                               ▼
                     [ Agent Loop (agent) ]
                        │              │
       ┌────────────────┘              └────────────────┐
       ▼                                                ▼
[ Provider Fallback Chain ]                   [ Session Store (JSONL) ]
(Anthropic / OpenAI / Ollama)                (~/.malikclaw/workspace/sessions)
```

---

## 1. Runnable Go Implementation

Below is a complete, runnable Go application (`main.go`) that initializes the MalikClaw agent loop, sets up a persistent session, and processes conversational messages programmatically.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

func main() {
	// 1. Create a production configuration
	cfg := config.DefaultConfig()
	cfg.Agents.Defaults.ModelName = "anthropic/claude-3-5-sonnet-20241022"
	cfg.Agents.Defaults.ModelFallbacks = []string{"openai/gpt-4o", "ollama/llama3"}
	cfg.Agents.Defaults.MaxTokens = 4096
	cfg.Agents.Defaults.Temperature = floatPtr(0.7)
	cfg.Agents.Defaults.Workspace = "./workspace"

	// 2. Initialize provider chain
	provider, _, err := providers.CreateProvider(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize LLM provider: %v", err)
	}

	// 3. Initialize message bus & agent loop
	msgBus := bus.NewMessageBus()
	defer msgBus.Close()

	agentLoop := agent.NewAgentLoop(cfg, msgBus, provider)
	defer agentLoop.Close()

	// 4. Define session parameters
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	sessionKey := "chat:user-123"

	// 5. Send Turn 1: Introduce user
	fmt.Println("--- Turn 1 ---")
	userMessage1 := "Hello! My name is Alex and I am a software engineer."
	response1, err := agentLoop.ProcessDirect(ctx, userMessage1, sessionKey)
	if err != nil {
		log.Fatalf("Turn 1 error: %v", err)
	}
	fmt.Printf("User: %s\nAgent: %s\n\n", userMessage1, response1)

	// 6. Send Turn 2: Query memory
	fmt.Println("--- Turn 2 ---")
	userMessage2 := "What is my name and what do I do for a living?"
	response2, err := agentLoop.ProcessDirect(ctx, userMessage2, sessionKey)
	if err != nil {
		log.Fatalf("Turn 2 error: %v", err)
	}
	fmt.Printf("User: %s\nAgent: %s\n", userMessage2, response2)
}

func floatPtr(f float64) *float64 {
	return &f
}
```

### Build & Run Go Example
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-proj-..."
go run main.go
```

---

## 2. CLI Execution Steps

You can also run the chatbot interactively or via CLI commands using pre-built binaries.

### Step 1: Initialize Configuration
Generate an initial `config.json`:
```bash
malikclaw onboard
```

### Step 2: Single-Turn Command Line Task
Execute a prompt with explicit session persistence:
```bash
malikclaw run "Remember that my favorite programming language is Go." --session "dev-session"
```

### Step 3: Follow-Up Query (Preserves Context)
```bash
malikclaw run "What is my favorite programming language?" --session "dev-session"
```

### Step 4: Run Gateway Service for Channels
To expose your chatbot via Telegram or Discord, enable the channels in `config.json` and launch the gateway:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TELEGRAM_BOT_TOKEN",
      "allow_from": ["@your_telegram_username"]
    }
  }
}
```

Start the gateway process:
```bash
malikclaw gateway
```

---

## 3. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **Empty Agent Response** | Token iteration limit reached before final response generation. | Increase `max_tool_iterations` (e.g. 20) or max output tokens in `config.json`. |
| **Session Context Loss** | Different session keys supplied across calls. | Ensure `--session` key matches across turns (`chat:user-id`). |
| **Provider Fallback Triggers** | Primary API key rate-limited or invalid. | Check API quota; confirm `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` are exported. |
| **JSONL Session Lock Error** | Concurrent processes writing to same session directory. | Use unique session keys per user/thread or run via `malikclaw gateway`. |

---

## 4. Production Security Hardening Tips

1. **User Access Whitelisting (`allow_from`)**:
   Always whitelist authorized user IDs on public channels (Telegram/Discord) to prevent unauthorized usage and prompt injection attacks.
   ```json
   "allow_from": ["123456789", "@admin_handle"]
   ```

2. **Session Cleanup & Retention Policy**:
   Limit session memory growth to prevent context window bloat and excessive token consumption. Configure `summarize_message_threshold` (default: 20 messages).

3. **Workspace Isolation**:
   Set `restrict_to_workspace: true` in `config.json` to lock chatbot file access to `~/.malikclaw/workspace`.

4. **Secret Management**:
   Never hardcode API keys in `config.json`. Inject keys using environment variables (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`).
