# Building Your First Agent

This guide walks you through creating, configuring, and executing your first autonomous AI agent using the **MalikClaw** Go framework.

---

## 1. Concept Explanation

An **Agent** in MalikClaw represents an autonomous reasoning unit that connects LLM provider models (such as OpenAI, Anthropic, or local Ollama instances) with executable tools, persistent memory, and channel interfaces. The agent processes inbound messages in an asynchronous event loop (`AgentLoop`), maintains conversation history, invokes tools when requested by the model, and streams or publishes results back to the user.

---

## 2. Why It Exists

Building robust LLM agents requires managing tool registration, context window budgets, token limits, system prompts, error retries, and asynchronous I/O. MalikClaw encapsulates these complexities into a clean Go package (`pkg/agent`), providing production-ready abstractions out of the box.

---

## 3. When to Use

- When building CLI-based interactive assistants.
- When creating multi-channel bots (Telegram, Discord, Slack, Feishu, WebSockets).
- When automating backend workflows using tool calling and file operations.

---

## 4. How It Works

The core driver is `AgentLoop` (located in [`pkg/agent/loop.go`](../../pkg/agent/loop.go)). When initialized, it:
1. Loads system instructions, memory context, and registered tools.
2. Subscribes to input channels via `MessageBus`.
3. Passes full conversation context to the active LLM provider.
4. Executes requested tool calls recursively until a final text response is produced.
5. Emits the final output back to the originating message bus topic.

### Agent Loop Execution Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Bus as MessageBus
    participant Loop as AgentLoop
    participant LLM as Provider (OpenAI/Anthropic)
    participant Tool as ToolRegistry

    User->>Bus: Publish User Message ("Calculate 12*45")
    Bus->>Loop: Process Inbound Message
    Loop->>LLM: Send Messages + Available Tool Schemas
    LLM-->>Loop: Tool Call Request: exec("calculator", {a:12, b:45})
    Loop->>Tool: Execute Tool("calculator")
    Tool-->>Loop: Tool Result: "540"
    Loop->>LLM: Send Tool Result
    LLM-->>Loop: Final Content: "12 * 45 equals 540."
    Loop->>Bus: Send Final Response
    Bus-->>User: Display Output
```

---

## 5. Go Code Sample

Below is a complete, runnable Go script demonstrating how to construct and execute a basic MalikClaw agent:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// 1. Initialize Configuration
	cfg := config.DefaultConfig()
	cfg.LLM.Provider = "openai"
	cfg.LLM.Model = "gpt-4o-mini"
	cfg.LLM.APIKey = "your-openai-api-key"

	// 2. Initialize Message Bus & Tool Registry
	messageBus := bus.NewMessageBus()
	toolRegistry := tools.NewToolRegistry()
	
	// Register built-in tools
	toolRegistry.Register(tools.NewFileSystemTool("/tmp"))

	// 3. Create Agent Registry & Loop
	agentRegistry := agent.NewAgentRegistry()
	loop := agent.NewAgentLoop(cfg, messageBus, agentRegistry, toolRegistry)

	// 4. Send a prompt via the message bus
	inboundMsg := bus.InboundMessage{
		ID:        "msg-001",
		Channel:   "cli",
		ChatID:    "user-1",
		User:      "developer",
		Content:   "Hello! List the files in my workspace.",
		Timestamp: time.Now(),
	}

	// Publish message to trigger the loop
	go func() {
		messageBus.PublishInbound(inboundMsg)
	}()

	// 5. Run loop step or wait for outbound message
	outbound, err := loop.ProcessSingleMessage(ctx, inboundMsg)
	if err != nil {
		log.Fatalf("Agent processing error: %v", err)
	}

	fmt.Printf("Agent Response: %s\n", outbound.Content)
}
```

---

## 6. Common Mistakes

1. **Not Registering Tools Before Loop Execution**: Attempting to invoke tools that have not been registered in `ToolRegistry` will cause the LLM to receive tool-not-found errors.
2. **Blocking the Event Loop**: Running heavy blocking operations directly inside custom tools without respecting `ctx.Done()` can cause message timeouts.
3. **Hardcoding Credentials**: Storing API keys directly in Go source files rather than reading from `cfg` or environment variables (`OPENAI_API_KEY`).

---

## 7. Best Practices

- Always pass `context.Context` with appropriate timeouts when invoking `AgentLoop.ProcessSingleMessage` or starting `AgentLoop.Start(ctx)`.
- Use `providers.FallbackChain` to automatically retry queries against secondary LLM models if the primary API experiences rate limits or downtime.
- Enable prompt injection security checks (`agent.CheckPromptInjection`) for public user inputs.

---

## 8. Cross-References

- [Installation Guide](installation.md): Set up your local development environment.
- [Configuration Guide](configuration.md): Learn about system configuration options.
- [Agents Concept Document](../concepts/agents.md): Deep dive into agent architectures, memory, and state management.
- [Tools Concept Document](../concepts/tools.md): Discover how tool calling and registries work.
