# Tool Calling Example

This example demonstrates how to implement a custom Go tool, register it in the **MalikClaw** `ToolRegistry`, and execute an agent loop that invokes the tool dynamically.

---

## 1. Concept Explanation

LLMs cannot access live external APIs by default. In this example, we build a `WeatherTool` that fetches weather data for a given city and expose it to the agent.

---

## 2. Why It Exists

Demonstrates how agents seamlessly switch between direct reasoning and invoking external tools when answering user questions.

---

## 3. When to Use

- When connecting agents to proprietary internal APIs or third-party web services.
- When performing multi-step data processing or calculation tasks.

---

## 4. How It Works

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Loop as AgentLoop
    participant Model as LLM Provider
    participant Tool as WeatherTool

    User->>Loop: "What's the weather in Tokyo?"
    Loop->>Model: Chat(Prompt + WeatherTool Schema)
    Model-->>Loop: ToolCall: get_weather(location="Tokyo")
    Loop->>Tool: Execute({"location": "Tokyo"})
    Tool-->>Loop: ToolResult: "Tokyo: 22°C, Clear Sky"
    Loop->>Model: Chat(Messages + ToolResult)
    Model-->>Loop: "The current weather in Tokyo is 22°C with clear skies."
    Loop-->>User: Print Final Response
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

// 1. Define custom WeatherTool struct
type WeatherTool struct{}

func (w *WeatherTool) Name() string {
	return "get_weather"
}

func (w *WeatherTool) Description() string {
	return "Fetches real-time weather information for a specified city."
}

func (w *WeatherTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"location": map[string]any{
				"type":        "string",
				"description": "The city and country (e.g. 'Tokyo, Japan', 'London, UK')",
			},
		},
		"required": []string{"location"},
	}
}

func (w *WeatherTool) Execute(ctx context.Context, args map[string]any) *tools.ToolResult {
	location, ok := args["location"].(string)
	if !ok || location == "" {
		return tools.ErrorResult("missing required argument 'location'")
	}

	// Mock API response
	weatherReport := fmt.Sprintf("Weather in %s: 22°C (71°F), Humidity: 45%%, Condition: Clear Sky.", location)

	return &tools.ToolResult{
		ForLLM:  weatherReport,
		ForUser: fmt.Sprintf("Retrieved weather data for %s.", location),
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 25*time.Second)
	defer cancel()

	if os.Getenv("OPENAI_API_KEY") == "" {
		log.Fatal("Error: OPENAI_API_KEY environment variable must be set.")
	}

	cfg := config.DefaultConfig()
	msgBus := bus.NewMessageBus()
	toolRegistry := tools.NewToolRegistry()
	agentRegistry := agent.NewAgentRegistry()

	// 2. Register custom WeatherTool
	toolRegistry.Register(&WeatherTool{})

	loop := agent.NewAgentLoop(cfg, msgBus, agentRegistry, toolRegistry)

	inbound := bus.InboundMessage{
		ID:        "msg-weather-01",
		Channel:   "cli",
		ChatID:    "user-101",
		Content:   "What is the current weather in Tokyo, Japan?",
		Timestamp: time.Now(),
	}

	outbound, err := loop.ProcessSingleMessage(ctx, inbound)
	if err != nil {
		log.Fatalf("Agent tool execution error: %v", err)
	}

	fmt.Printf("\nAgent Response:\n%s\n", outbound.Content)
}
```

---

## 6. Common Mistakes

1. **Incorrect Parameter Type Casting**: Failing to check whether type casting `args["location"].(string)` succeeds, causing runtime panics.
2. **Missing `required` Properties**: Omitting required parameter fields in `Parameters()`, causing the LLM to send empty argument payloads.

---

## 7. Best Practices

- Always return structured, concise text in `ForLLM`.
- Provide soft error descriptions using `tools.ErrorResult(reason)` so the LLM can adjust its tool arguments on subsequent attempts.

---

## 8. Cross-References

- [Custom Tools Guide](../advanced/custom-tools.md): Step-by-step guide for complex custom tools.
- [MCP Server Example](mcp-server.md): Connecting MCP server tools.
- [Tools Concept](../concepts/tools.md): Tools architecture document.
