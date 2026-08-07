# Building a Retrieval-Augmented Generation (RAG) Agent

This tutorial demonstrates how to build a **Retrieval-Augmented Generation (RAG) Agent** using **MalikClaw**. You will learn how to index local documentation repositories, perform pattern and semantic searching, and ground LLM answers directly in your local codebase or document base.

---

## Architecture Overview

```
 [ Query ] ──► [ Context Builder & Regex Search Tool ]
                              │
                              ▼
                 [ Knowledge Base Index ]
          (~/.malikclaw/workspace / Local Docs)
                              │
                              ▼
                [ Dynamic Context Insertion ]
                 (Relevant Document Chunks)
                              │
                              ▼
            [ LLM Generation with Grounding ]
```

---

## 1. Runnable Go Implementation

The following Go application indexes local Markdown files, performs pattern matching using `RegexSearchTool`, and generates grounded technical answers.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	// 1. Prepare knowledge base directory
	kbDir, err := filepath.Abs("./knowledge_base")
	if err != nil {
		log.Fatalf("Failed to resolve path: %v", err)
	}
	os.MkdirAll(kbDir, 0755)

	// Seed sample document
	sampleDoc := filepath.Join(kbDir, "security_policy.md")
	_ = os.WriteFile(sampleDoc, []byte(`
# Enterprise Security Guidelines
- Session timeout must be set to 15 minutes.
- Password policy requires at least 16 characters with special symbols.
- Database connections must use TLS 1.3 with mTLS authentication.
`), 0644)

	// 2. Configure Agent
	cfg := config.DefaultConfig()
	cfg.Agents.Defaults.ModelName = "anthropic/claude-3-5-sonnet-20241022"
	cfg.Agents.Defaults.Workspace = kbDir
	cfg.Tools.AllowReadPaths = []string{kbDir + ".*"}

	provider, _, err := providers.CreateProvider(cfg)
	if err != nil {
		log.Fatalf("Provider initialization failed: %v", err)
	}

	msgBus := bus.NewMessageBus()
	defer msgBus.Close()

	agentLoop := agent.NewAgentLoop(cfg, msgBus, provider)
	defer agentLoop.Close()

	// 3. Register Retrieval Tools
	registry := agentLoop.GetRegistry()
	defAgent := registry.GetDefaultAgent()
	if defAgent == nil {
		log.Fatalf("Default agent instance missing")
	}

	defAgent.Tools.Register(tools.NewReadFileTool(kbDir, true, 1048576, nil))
	defAgent.Tools.Register(tools.NewListDirTool(kbDir, true, nil))
	defAgent.Tools.Register(tools.NewRegexSearchTool(defAgent.Tools, 300, 10))

	// 4. Issue RAG Query
	query := "According to the local enterprise security policy, what is the required database connection protocol and password length?"

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
	defer cancel()

	fmt.Println("Executing RAG query against knowledge base...")
	response, err := agentLoop.ProcessDirect(ctx, query, "session:rag-query")
	if err != nil {
		log.Fatalf("RAG execution failed: %v", err)
	}

	fmt.Println("\n=== Grounded RAG Answer ===")
	fmt.Println(response)
}
```

### Build & Run Go Example
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
go run main.go
```

---

## 2. CLI Execution Steps

### Step 1: Query Local Documentation
Point MalikClaw to your local project or documentation directory:

```bash
malikclaw run "Search docs/ for security guidelines and summarize session timeout rules" --session "rag-docs"
```

### Step 2: Utilize Regex Search for Specific Symbols
```bash
malikclaw run "Find all occurrences of 'TLS 1.3' across the workspace using regex search" --metrics
```

### Step 3: Configure BM25 Context Discovery
Enable automatic BM25 tool and context discovery in `config.json`:

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "discovery": {
        "enabled": true,
        "use_bm25": true,
        "use_regex": true
      }
    }
  }
}
```

---

## 3. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **`Access denied: path outside workspace`** | Knowledge base path is outside designated sandbox. | Add directory to `allow_read_paths` in `config.json` or move files into workspace. |
| **File Read Truncated** | File size exceeds `max_read_file_size`. | Increase `max_read_file_size` in `config.json` (e.g. 2MB = `2097152`). |
| **Hallucinated Answers** | LLM answered without executing search tool. | Refine system prompt to instruct: "Answer ONLY using retrieved local documents." |
| **JSONL Session Error** | Dirty or corrupted session history. | Clear test session using `rm -rf ~/.malikclaw/workspace/sessions/rag-query.jsonl`. |

---

## 4. Production Security Hardening Tips

1. **Path Traversal Protection**:
   `ReadFileTool` and `ListDirTool` enforce path canonicalization via `filepath.Clean` and check against allowed root prefixes to prevent `../` directory traversal attacks.

2. **Secret Redaction in Documents**:
   Scan and sanitize internal knowledge base files before indexing to ensure `.env` credentials, API tokens, or RSA private keys are not ingested into model prompts.

3. **Read-Only Sandbox Restriction**:
   Keep `restrict_to_workspace: true` enabled and do NOT register `write_file` or `edit_file` tools on pure RAG retrieval agents.

4. **Resource Quotas**:
   Limit maximum searchable file count and single-file read size (`1MB`) to protect against Denial of Service (DoS) from oversized target files.
