# Building an Automated Deep Research Agent

This tutorial demonstrates how to build an **Automated Deep Research Agent** using **MalikClaw**. The research agent autonomously formulates search queries, fetches web content, synthesizes findings, and writes comprehensive Markdown research reports.

---

## Architecture & Workflow

```
 [ Research Topic ] ──► [ Plan & Decompose ]
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
       [ Web Search Tool ]          [ Web Fetch / Scraper ]
      (DuckDuckGo / Brave)             (HTML to Markdown)
               │                             │
               └──────────────┬──────────────┘
                              ▼
                  [ Synthesis & Refinement ]
                              │
                              ▼
                  [ Markdown Report Output ]
```

---

## 1. Runnable Go Implementation

The following Go application instantiates an agent with web search, web fetch, and filesystem write capabilities to conduct automated research.

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
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	// 1. Configure workspace and providers
	cfg := config.DefaultConfig()
	cfg.Agents.Defaults.ModelName = "openai/gpt-4o"
	cfg.Agents.Defaults.MaxToolIterations = 15
	cfg.Agents.Defaults.Workspace = "./research_workspace"

	// Enable tools
	cfg.Tools.WebFetch.MaxChars = 30000
	cfg.Tools.ReadFile.MaxReadFileSize = 1048576

	provider, _, err := providers.CreateProvider(cfg)
	if err != nil {
		log.Fatalf("Provider initialization failed: %v", err)
	}

	msgBus := bus.NewMessageBus()
	defer msgBus.Close()

	agentLoop := agent.NewAgentLoop(cfg, msgBus, provider)
	defer agentLoop.Close()

	// 2. Register Web Search and Fetch Tools into default agent
	registry := agentLoop.GetRegistry()
	defAgent := registry.GetDefaultAgent()
	if defAgent == nil {
		log.Fatalf("Default agent instance not found")
	}

	defAgent.Tools.Register(tools.NewWebSearchTool("")) // Uses DuckDuckGo by default
	defAgent.Tools.Register(tools.NewWebFetchTool(30000))
	defAgent.Tools.Register(tools.NewWriteFileTool(defAgent.Workspace, true, nil))

	// 3. Formulate Research Prompt
	prompt := `Research topic: "Post-Quantum Cryptography migration strategies for microservices".
Follow these steps:
1. Search for current NIST standards (FIPS 203, 204, 205).
2. Fetch top 2 articles and extract key migration challenges.
3. Write a comprehensive report and save it to "pqc_migration_report.md".`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()

	fmt.Println("Starting autonomous research agent...")
	result, err := agentLoop.ProcessDirect(ctx, prompt, "session:research-001")
	if err != nil {
		log.Fatalf("Research execution error: %v", err)
	}

	fmt.Println("\n=== Final Agent Output ===")
	fmt.Println(result)

	// Verify report file creation
	reportPath := "./research_workspace/pqc_migration_report.md"
	if data, err := os.ReadFile(reportPath); err == nil {
		fmt.Printf("\n✓ Successfully created report (%d bytes) at %s\n", len(data), reportPath)
	}
}
```

### Build & Run Go Example
```bash
export OPENAI_API_KEY="sk-proj-..."
go run main.go
```

---

## 2. CLI Execution Steps

You can trigger research workflows directly using the `malikclaw` CLI with real-time performance and token metrics.

### Step 1: Run Research Task with Metrics
```bash
malikclaw run "Research the top 3 open-source vector databases in 2026. Compare latency, index types, and Go SDK support. Save report to vector_dbs.md" --metrics --debug
```

### Step 2: Custom Search Provider Configuration
Add Brave or Perplexity API keys in `config.json` for enhanced web search accuracy:

```json
{
  "tools": {
    "web_search": {
      "provider": "brave",
      "api_key": "BSM...YOUR_BRAVE_KEY"
    }
  }
}
```

Then execute:
```bash
malikclaw run "Conduct deep research on zero-knowledge proof frameworks in Go" --session "zk-research"
```

---

## 3. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **HTTP 403 Forbidden on Web Fetch** | Cloudflare / anti-bot protection on target website. | `WebFetchTool` falls back to sanitized text. Try an alternative URL or search query. |
| **Search Timeout (HTTP 504)** | External search provider latency or network throttling. | Increase timeout flag (`--timeout 5m`) or switch search provider to `duckduckgo`. |
| **Report Truncation** | Model output limit or tool execution max iteration reached. | Increase `max_tokens` (e.g. 8192) and `max_tool_iterations` (25) in config. |
| **High Token Consumption** | Large HTML pages fetched into context. | Adjust `web_fetch.max_chars` parameter to `15000` or `20000` bytes. |

---

## 4. Production Security Hardening Tips

1. **SSRF (Server-Side Request Forgery) Prevention**:
   `WebFetchTool` automatically blocks private IP ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `169.254.169.254`). Do not disable these checks in custom tool builds.

2. **Domain Whitelisting & Filtering**:
   Restrict web scraping to trusted top-level domains or explicit domain patterns if deploying in enterprise environments.

3. **Execution Timeout Caps**:
   Always set `context.WithTimeout` (e.g. 3 to 5 minutes) when running iterative web scraping loops to prevent runaway processes and unexpected billing charges.

4. **Sanitized Output Writing**:
   Ensure file write operations are strictly jailed to `./workspace` using `restrict_to_workspace: true`.
