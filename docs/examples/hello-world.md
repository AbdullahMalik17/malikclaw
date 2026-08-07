# Hello World Agent Example

This example demonstrates a complete, end-to-end **Hello World** application using **MalikClaw** packages.

---

## 1. Concept Explanation

This example constructs a lightweight `AgentLoop`, connects it to a `bus.MessageBus`, sends a prompt, and prints the agent's response.

---

## 2. Why It Exists

It serves as a clean, self-contained reference project structure for developers who want to embed MalikClaw into custom Go binaries or microservices.

---

## 3. When to Use

- When verifying your environment setup after installation.
- When creating a template for custom agent development.

---

## 4. How It Works

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / CLI
    participant Bus as MessageBus
    participant Loop as AgentLoop
    participant Model as OpenAI Provider

    Dev->>Bus: PublishInbound("What is MalikClaw?")
    Bus->>Loop: Deliver Inbound Message
    Loop->>Model: Chat(Prompt + Context)
    Model-->>Loop: Response Content
    Loop->>Bus: PublishOutbound(Response)
    Bus-->>Dev: Print to Stdout
```

---

## 5. Complete Go Code Sample

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
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	// 1. Verify environment API key
	if os.Getenv("OPENAI_API_KEY") == "" {
		log.Fatal("Error: OPENAI_API_KEY environment variable must be set.")
	}

	// 2. Initialize System Configuration
	cfg := config.DefaultConfig()
	cfg.LLM.Provider = "openai"
	cfg.LLM.Model = "gpt-4o-mini"
	cfg.Agent.MaxIterations = 5

	// 3. Initialize Message Bus & Registries
	msgBus := bus.NewMessageBus()
	toolRegistry := tools.NewToolRegistry()
	agentRegistry := agent.NewAgentRegistry()

	// 4. Create Agent Loop
	loop := agent.NewAgentLoop(cfg, msgBus, agentRegistry, toolRegistry)

	// 5. Construct Inbound Message
	inbound := bus.InboundMessage{
		ID:        "msg-hello-01",
		Channel:   "cli",
		ChatID:    "user-session-1",
		User:      "developer",
		Content:   "Hello! Briefly introduce yourself in one sentence.",
		Timestamp: time.Now(),
	}

	fmt.Println("Sending message to agent...")

	// 6. Process message synchronously
	outbound, err := loop.ProcessSingleMessage(ctx, inbound)
	if err != nil {
		log.Fatalf("Agent error: %v", err)
	}

	fmt.Println("\n================ Agent Response ================")
	fmt.Println(outbound.Content)
	fmt.Println("================================================")
}
```

---

## 6. Common Mistakes

1. **Missing `OPENAI_API_KEY`**: Launching without setting valid credentials in environment variables.
2. **Context Timeout Too Short**: Setting context timeout < 3 seconds on slow network connections.

---

## 7. Best Practices

- Always validate configuration before instantiating `AgentLoop`.
- Use `context.WithTimeout` to bound execution duration.

---

## 8. Cross-References

- [Tool Calling Example](tool-calling.md): Adding executable tools to your agent.
- [MCP Server Example](mcp-server.md): Connecting MCP tools.
- [Getting Started Quickstart](../getting-started/hello-world.md): Getting started guide.
