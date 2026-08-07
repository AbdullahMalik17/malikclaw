# Memory Core Concept

This document explains the multi-tiered memory architecture in **MalikClaw**: short-term session storage, long-term persistent notes, and context window management.

---

## 1. Concept Explanation

Memory in MalikClaw operates at two distinct tiers:

1. **Short-Term Session Memory**: Managed by the persistent [`memory.Store`](../../pkg/memory/store.go) interface (e.g., JSONL or SQLite backends). It tracks turn-by-turn conversation messages, tool calls, and model responses for active chat sessions.
2. **Long-Term File Memory**: Managed by [`agent.MemoryStore`](../../pkg/agent/memory.go). It persists curated user knowledge, long-term memory (`MEMORY.md`), and daily journals (`memory/YYYYMM/YYYYMMDD.md`).

---

## 2. Why It Exists

LLM API calls are inherently stateless. Without a structured memory engine:
- Agents would forget previous user instructions between turns.
- Long conversations would quickly breach LLM context token windows (e.g., 128k tokens).
- Critical user preferences (such as code formatting rules or project instructions) would vanish across application restarts.

---

## 3. When to Use

- **Short-Term Memory**: Automatically active during multi-turn chats (Telegram, CLI, Web).
- **Long-Term Memory**: When agents need to recall user preferences, past project decisions, or recurring tasks across days/weeks.
- **History Truncation & Summarization**: When managing high-volume sessions that exceed context limits.

---

## 4. How It Works

### Memory Tiering Architecture

```mermaid
flowchart TD
    subgraph User Prompt
        MSG[Inbound Message]
    end

    subgraph Agent Loop Context Construction
        STM[Short-Term Session Store\nmemory.Store / JSONL]
        LTM[Long-Term MemoryStore\nMEMORY.md]
        DN[Daily Notes\nYYYYMMDD.md]
        COMP[Token Compactor / Truncator]
    end

    subgraph LLM Context Window
        SYS[System Prompt + LTM + Daily Notes Context]
        HIST[Truncated / Summarized Chat History]
        CUR[Current User Message]
    end

    MSG --> STM
    LTM --> SYS
    DN --> SYS
    STM --> COMP
    COMP --> HIST
    MSG --> CUR
    SYS --> LLM Context Window
    HIST --> LLM Context Window
    CUR --> LLM Context Window
```

---

## 5. Memory Operations & Storage Engines

### Short-Term Session Store (`memory.Store`)

Every method on `memory.Store` is atomic—eliminating race conditions and manual `Save()` requirements:

- `AddMessage(ctx, sessionKey, role, content)`: Appends simple text.
- `AddFullMessage(ctx, sessionKey, msg)`: Appends rich messages (with tool calls).
- `GetHistory(ctx, sessionKey)`: Retrieves message history.
- `TruncateHistory(ctx, sessionKey, keepLast)`: Reclaims context budget by trimming older turns.
- `SetSummary(ctx, sessionKey, summary)`: Stores high-level session summary.

### Long-Term MemoryStore (`agent.MemoryStore`)

Located in the workspace directory (`workspace/memory/`):

- **`ReadLongTerm()` / `WriteLongTerm()`**: Accesses `MEMORY.md`.
- **`AppendToday(content)`**: Appends daily notes to `memory/YYYYMM/YYYYMMDD.md`.
- **`GetMemoryContext()`**: Formats long-term notes and recent daily journals into markdown sections ready for prompt inclusion.

---

## 6. Go Code Sample: Using Memory Stores

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/memory"
)

func main() {
	ctx := context.Background()

	// 1. Short-Term Session Memory (JSONL)
	jsonlStore, err := memory.NewJSONLStore("./workspace/sessions.jsonl")
	if err != nil {
		log.Fatalf("Failed to initialize session store: %v", err)
	}
	defer jsonlStore.Close()

	sessionKey := "cli:user-123"
	_ = jsonlStore.AddMessage(ctx, sessionKey, "user", "My favorite programming language is Go.")
	_ = jsonlStore.AddMessage(ctx, sessionKey, "assistant", "Duly noted! Go is great for concurrency.")

	// Fetch history
	history, _ := jsonlStore.GetHistory(ctx, sessionKey)
	fmt.Printf("Session history count: %d messages\n", len(history))

	// 2. Long-Term Markdown MemoryStore
	memStore := agent.NewMemoryStore("./workspace")
	
	// Append preference to today's journal
	_ = memStore.AppendToday("- User prefers Go over Python for backend services.")
	_ = memStore.WriteLongTerm("# Core User Profile\n- Language: Go\n- Role: Architect")

	// Print compiled memory context
	fmt.Println("\n--- Formatted Memory Context ---")
	fmt.Println(memStore.GetMemoryContext())
}
```

---

## 7. Common Mistakes

1. **Unconstrained Session History**: Allowing `GetHistory` to grow unbounded without invoking `TruncateHistory` or compaction, resulting in context window overflow errors from LLM providers.
2. **Non-Atomic File Writes**: Writing memory markdown files using `os.WriteFile` instead of `fileutil.WriteFileAtomic`, which can corrupt memory files during sudden system power loss.
3. **Session Key Collisions**: Using plain user IDs (e.g. `"123"`) instead of channel-prefixed session keys (e.g. `"telegram:123"`, `"discord:123"`).

---

## 8. Best Practices

- Always prefix session keys with channel identifiers (`"channel:chatID"`).
- Automatically trigger history truncation when message count exceeds 30–50 turns.
- Use `fileutil.WriteFileAtomic` for safe concurrent updates to long-term memory files.

---

## 9. Cross-References

- [Agents Concept](agents.md): How agents build context using memory stores.
- [Memory API Reference](../api/memory.md): Detailed Go package API docs for `pkg/memory`.
- [First Agent Guide](../getting-started/first-agent.md): Quickstart setup.
