# MCP Server Integration Example

This example demonstrates how to launch an external **Model Context Protocol (MCP)** server subprocess, register its tools dynamically into **MalikClaw**, and execute agent turns using MCP tools.

---

## 1. Concept Explanation

Using the [`pkg/mcp`](../../pkg/mcp) package, MalikClaw agents can spawn and communicate with third-party MCP tool servers over stdio or HTTP/SSE transports.

---

## 2. Why It Exists

Provides a production-grade template for connecting third-party MCP tools (e.g. Filesystem, GitHub, PostgreSQL, Memory servers) without writing Go tool wrappers.

---

## 3. When to Use

- When connecting your agent to official open-source MCP servers.
- When running isolated tool subprocesses for security sandboxing.

---

## 4. How It Works

```mermaid
sequenceDiagram
    autonumber
    participant App as main.go
    participant MCP as mcp.Manager
    participant Sub as MCP Subprocess (npx)
    participant Reg as ToolRegistry
    participant Loop as AgentLoop

    App->>MCP: StartServers(ctx, mcpConfig, Reg)
    MCP->>Sub: exec("npx -y @modelcontextprotocol/server-memory")
    Sub-->>MCP: JSON-RPC initialized & tools list
    MCP->>Reg: Register mcpTool wrappers
    App->>Loop: ProcessSingleMessage("Read memory graph")
    Loop->>Sub: JSON-RPC tools/call
    Sub-->>Loop: JSON-RPC result
    Loop-->>App: Final Answer
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
	"github.com/AbdullahMalik17/malikclaw/pkg/mcp"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if os.Getenv("OPENAI_API_KEY") == "" {
		log.Fatal("Error: OPENAI_API_KEY environment variable must be set.")
	}

	// 1. Define MCP Server configuration
	mcpServers := map[string]config.MCPServerConfig{
		"memory-mcp": {
			Command: "npx",
			Args:    []string{"-y", "@modelcontextprotocol/server-memory"},
		},
	}

	// 2. Initialize Registries and MCP Manager
	toolRegistry := tools.NewToolRegistry()
	mcpManager := mcp.NewManager()

	fmt.Println("Starting MCP servers and discovering tools...")
	err := mcpManager.StartServers(ctx, mcpServers, toolRegistry)
	if err != nil {
		log.Fatalf("Failed to start MCP servers: %v", err)
	}
	defer mcpManager.StopAll()

	// List discovered MCP tools
	fmt.Println("Registered MCP Tools:")
	for toolName := range toolRegistry.GetTools() {
		fmt.Printf(" - %s\n", toolName)
	}

	// 3. Initialize Agent Loop
	cfg := config.DefaultConfig()
	msgBus := bus.NewMessageBus()
	agentRegistry := agent.NewAgentRegistry()

	loop := agent.NewAgentLoop(cfg, msgBus, agentRegistry, toolRegistry)

	// 4. Send a prompt that utilizes MCP tools
	inbound := bus.InboundMessage{
		ID:        "msg-mcp-01",
		Channel:   "cli",
		ChatID:    "user-mcp-session",
		Content:   "Create an entity named 'MalikClaw' with entityType 'Framework' in the memory graph.",
		Timestamp: time.Now(),
	}

	outbound, err := loop.ProcessSingleMessage(ctx, inbound)
	if err != nil {
		log.Fatalf("Agent MCP error: %v", err)
	}

	fmt.Printf("\nAgent Response:\n%s\n", outbound.Content)
}
```

---

## 6. Common Mistakes

1. **Missing Node.js / npx**: Attempting to run `npx` without Node.js installed on the system PATH.
2. **Forgetting Shutdown Defer**: Omitting `mcpManager.StopAll()`, leaving orphan node processes in background.

---

## 7. Best Practices

- Always use `defer mcpManager.StopAll()` to prevent process leaks.
- Set explicit initialization timeouts on `context.WithTimeout`.

---

## 8. Cross-References

- [MCP Concept](../concepts/mcp.md): Conceptual overview of MCP.
- [Tools Concept](../concepts/tools.md): Tool architecture.
- [Tool Calling Example](tool-calling.md): Native tool calling example.
