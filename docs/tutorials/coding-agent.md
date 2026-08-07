# Building an Autonomous Coding & Refactoring Agent

This tutorial demonstrates how to build an **Autonomous Coding & Refactoring Agent** with **MalikClaw**. You will configure an agent capable of inspecting repository files, applying precise line-by-line diff edits, executing build scripts/unit tests, and self-healing bugs based on test output.

---

## Architecture & Loop Cycle

```
                       [ Task / Feature Request ]
                                   │
                                   ▼
                         [ Inspect Codebase ]
                       (read_file, list_dir)
                                   │
                                   ▼
                       [ Plan & Edit Source ]
                       (edit_file, write_file)
                                   │
                                   ▼
                     [ Run Tests & Verification ]
                               (exec)
                                   │
                  ┌────────────────┴────────────────┐
                  ▼                                 ▼
             [ Test Pass ]                    [ Test Fail ]
                  │                                 │
                  ▼                                 ▼
         [ Task Completed ]               [ Self-Healing Loop ]
                                           (Analyze Error & Edit)
```

---

## 1. Runnable Go Implementation

The following Go application instantiates an agent with full filesystem editing and terminal execution permissions to refactor Go source files and verify them using `go test`.

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
	// 1. Prepare target project workspace
	projectDir, err := filepath.Abs("./coding_workspace")
	if err != nil {
		log.Fatalf("Path error: %v", err)
	}
	os.MkdirAll(projectDir, 0755)

	// Seed buggy Go code file
	mainFile := filepath.Join(projectDir, "calc.go")
	_ = os.WriteFile(mainFile, []byte(`package main

func Add(a, b int) int {
	return a - b // Bug: subtraction instead of addition
}
`), 0644)

	// Seed unit test
	testFile := filepath.Join(projectDir, "calc_test.go")
	_ = os.WriteFile(testFile, []byte(`package main

import "testing"

func TestAdd(t *testing.T) {
	if res := Add(2, 3); res != 5 {
		t.Fatalf("Expected 5, got %d", res)
	}
}
`), 0644)

	// 2. Configure Agent
	cfg := config.DefaultConfig()
	cfg.Agents.Defaults.ModelName = "anthropic/claude-3-5-sonnet-20241022"
	cfg.Agents.Defaults.Workspace = projectDir
	cfg.Agents.Defaults.MaxToolIterations = 15

	provider, _, err := providers.CreateProvider(cfg)
	if err != nil {
		log.Fatalf("Provider creation failed: %v", err)
	}

	msgBus := bus.NewMessageBus()
	defer msgBus.Close()

	agentLoop := agent.NewAgentLoop(cfg, msgBus, provider)
	defer agentLoop.Close()

	// 3. Register Coding Tools
	registry := agentLoop.GetRegistry()
	defAgent := registry.GetDefaultAgent()
	if defAgent == nil {
		log.Fatalf("Default agent instance missing")
	}

	defAgent.Tools.Register(tools.NewReadFileTool(projectDir, true, 1048576, nil))
	defAgent.Tools.Register(tools.NewEditFileTool(projectDir, true, nil))
	defAgent.Tools.Register(tools.NewWriteFileTool(projectDir, true, nil))

	execTool, err := tools.NewExecToolWithConfig(projectDir, true, cfg)
	if err != nil {
		log.Fatalf("Exec tool initialization failed: %v", err)
	}
	defAgent.Tools.Register(execTool)

	// 4. Run Refactoring Task
	prompt := `Task:
1. Run "go test ./..." using the exec tool to identify failing tests.
2. Read calc.go to analyze the bug.
3. Edit calc.go using edit_file to fix the logic.
4. Re-run "go test ./..." and confirm all tests pass.`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()

	fmt.Println("Starting coding agent refactoring loop...")
	response, err := agentLoop.ProcessDirect(ctx, prompt, "session:coding-task")
	if err != nil {
		log.Fatalf("Coding task failed: %v", err)
	}

	fmt.Println("\n=== Refactoring Result ===")
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

### Step 1: Execute Bug Fix via CLI
Run MalikClaw directly against a project directory:

```bash
malikclaw run "Run go test, fix any failing unit tests in current directory, and verify tests pass" --debug --metrics
```

### Step 2: Codebase Refactoring & Formatting
```bash
malikclaw run "Inspect all .go files, add docstrings to exported functions, and run gofmt -w ." --session "refactor-session"
```

---

## 3. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **`Exec command rejected: security violation`** | Exec tool blocked dangerous binary execution (e.g. `rm`, `sudo`). | Stick to standard build commands (`go test`, `go build`, `npm test`, `pytest`). |
| **Infinite Fix Loop** | Model repeatedly makes invalid edits. | Enforce structured planning by setting `thinking_level: "high"` in `config.json`. |
| **`edit_file` Target String Not Found** | Multi-line string mismatch or whitespace discrepancy. | Provide unique, exact context lines around target block in `edit_file`. |
| **Process Execution Timeout** | Long-running test suite exceeded default timeout (60s). | Configure `exec.timeout` in `config.json` or specify shorter test flags (`go test -short`). |

---

## 4. Production Security Hardening Tips

1. **Restricted Command Regex Filter**:
   The `exec` tool enforces regex filtering to block destructive shell operations. Never disable `restrict_to_workspace: true` when enabling shell tools.

2. **Git Snapshot Sandboxing**:
   Always run coding agents inside a clean Git working tree. Verify diffs before committing:
   ```bash
   git diff
   ```

3. **Non-Root Execution**:
   Run the coding agent process under a dedicated non-root user (e.g. `malikclaw`) without `sudo` privileges.

4. **Environment Isolation**:
   Prevent coding agents from reading sensitive system files like `~/.ssh/id_rsa` or AWS credentials by ensuring path whitelists restrict reads to the project root.
