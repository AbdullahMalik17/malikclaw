# Advanced Custom Tools Guide

This guide covers advanced techniques for building production-ready custom tools in **MalikClaw**: request-scoped context, complex parameter schemas, and asynchronous execution with completion callbacks.

---

## 1. Concept Explanation

Tools in MalikClaw are singletons registered once per application lifecycle in `ToolRegistry`. However, tool calls must often process request-specific context (e.g. channel ID, chat ID, user permissions) or perform asynchronous tasks without blocking the main agent loop.

MalikClaw supports two execution models:
- **Synchronous Tools**: Implement [`tools.Tool`](../../pkg/tools/base.go).
- **Asynchronous Tools**: Implement [`tools.AsyncExecutor`](../../pkg/tools/base.go) using `ExecuteAsync(ctx, args, callback)`.

---

## 2. Why It Exists

Long-running operations (such as running multi-minute shell jobs, downloading large files, or spawning subagents) can stall the main agent loop if executed synchronously. Asynchronous tools allow the agent to acknowledge tool initiation immediately while processing completion callbacks in the background.

---

## 3. When to Use

- Operations that exceed 3 seconds of execution time.
- Tools requiring access to incoming channel or chat ID metadata via request-scoped context.
- Tools with complex nested JSON schemas (arrays of objects, optional fields, enum validation).

---

## 4. How It Works

### Synchronous vs Asynchronous Execution Flow

```mermaid
sequenceDiagram
    autonumber
    box LightYellow Agent Environment
    participant Loop as AgentLoop
    participant Registry as ToolRegistry
    end
    box LightBlue Async Tool Context
    participant AsyncTool as AsyncExecutor
    participant Background as Background Goroutine
    end

    Loop->>Registry: ExecuteAsync(toolName, args, cb)
    Registry->>AsyncTool: ExecuteAsync(ctx, args, cb)
    AsyncTool->>Background: go func() { process... cb(result) }()
    AsyncTool-->>Loop: Return Instant AsyncResult("Task started...")
    Note over Loop: Agent Loop Continues Other Tasks
    Background-->>Loop: Invoke AsyncCallback(ctx, finalResult)
```

---

## 5. Go Code Sample: Building an Asynchronous Processing Tool

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

// AsyncReportGenerator implements tools.AsyncExecutor
type AsyncReportGenerator struct{}

func (t *AsyncReportGenerator) Name() string {
	return "generate_report"
}

func (t *AsyncReportGenerator) Description() string {
	return "Asynchronously compiles and generates a system report."
}

func (t *AsyncReportGenerator) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"report_name": map[string]any{"type": "string", "description": "Title of the report"},
			"sections": map[string]any{
				"type": "array",
				"items": map[string]any{"type": "string"},
				"description": "List of sections to include",
			},
		},
		"required": []string{"report_name"},
	}
}

// Execute handles synchronous calls (fallback)
func (t *AsyncReportGenerator) Execute(ctx context.Context, args map[string]any) *tools.ToolResult {
	return tools.ErrorResult("please use ExecuteAsync for this tool")
}

// ExecuteAsync handles asynchronous execution with a completion callback
func (t *AsyncReportGenerator) ExecuteAsync(ctx context.Context, args map[string]any, cb tools.AsyncCallback) *tools.ToolResult {
	reportName, _ := args["report_name"].(string)
	channel := tools.ToolChannel(ctx)
	chatID := tools.ToolChatID(ctx)

	// Launch background processing goroutine
	go func() {
		// Simulate long processing job
		select {
		case <-time.After(3 * time.Second):
			resultMsg := fmt.Sprintf("Report '%s' generated for session %s:%s.", reportName, channel, chatID)
			res := &tools.ToolResult{
				ForLLM:  resultMsg,
				ForUser: fmt.Sprintf("Report '%s' is ready!", reportName),
			}
			if cb != nil {
				cb(ctx, res)
			}
		case <-ctx.Done():
			// Handle context cancellation
			res := tools.ErrorResult("report generation cancelled")
			if cb != nil {
				cb(ctx, res)
			}
		}
	}()

	return tools.AsyncResult(fmt.Sprintf("Started generating report '%s' in background.", reportName))
}
```

---

## 6. Common Mistakes

1. **Storing State on Struct Pointer**: Storing `t.CurrentSession` on the tool instance struct, leading to severe data races under concurrent execution. Always read request context via `tools.ToolChannel(ctx)` and `tools.ToolChatID(ctx)`.
2. **Ignoring Background Goroutine Leakage**: Launching goroutines without checking `ctx.Done()`, causing leaks when the main application stops.

---

## 7. Best Practices

- Always extract request metadata using `tools.ToolChannel(ctx)` and `tools.ToolChatID(ctx)`.
- Use `tools.AsyncResult("Message")` to instantly acknowledge async task creation to the LLM.
- Always check `if cb != nil` before executing completion callbacks.

---

## 8. Cross-References

- [Guardian & Self-Patching Guide](guardian-self-patching.md): Autonomous self-improving tools.
- [Tools Concept](../concepts/tools.md): Core tools concept guide.
- [Tools API Reference](../api/tools.md): Direct Go package specs.
