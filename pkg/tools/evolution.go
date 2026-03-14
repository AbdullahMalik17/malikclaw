// MalikClaw - Ultra-lightweight personal AI agent
// License: MIT

package tools

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

type EvolutionTool struct {
	workspace string
	repoRoot  string
}

func NewEvolutionTool(workspace string) *EvolutionTool {
	// Try to find the repo root (where go.mod is)
	wd, _ := os.Getwd()
	repoRoot := wd
	if _, err := os.Stat(filepath.Join(wd, "go.mod")); err != nil {
		// Fallback to workspace if not in a go repo
		repoRoot = workspace
	}

	return &EvolutionTool{
		workspace: workspace,
		repoRoot:  repoRoot,
	}
}

func (t *EvolutionTool) Name() string {
	return "self_improve"
}

func (t *EvolutionTool) Description() string {
	return "Analyze MalikClaw's own source code to identify bugs, optimize performance, or add features. Operations: analyze_path, propose_patch, apply_patch."
}

func (t *EvolutionTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"operation": map[string]any{
				"type":        "string",
				"description": "The operation to perform: analyze_path, propose_patch, apply_patch",
				"enum":        []string{"analyze_path", "propose_patch", "apply_patch"},
			},
			"path": map[string]any{
				"type":        "string",
				"description": "Relative path to a file or directory in the malikclaw repo (e.g., 'pkg/agent/loop.go')",
			},
			"patch": map[string]any{
				"type":        "string",
				"description": "The proposed changes (for apply_patch)",
			},
			"reason": map[string]any{
				"type":        "string",
				"description": "The reason for the improvement (for propose_patch)",
			},
		},
		"required": []string{"operation"},
	}
}

func (t *EvolutionTool) Execute(ctx context.Context, args map[string]any) *ToolResult {
	operation, _ := args["operation"].(string)
	path, _ := args["path"].(string)

	if path == "" {
		return ErrorResult("path is required")
	}

	// Clean path and ensure it's relative to repo root
	path = filepath.Clean(path)
	if strings.HasPrefix(path, "..") || filepath.IsAbs(path) {
		// If it's an absolute path, check if it's within repo root
		if filepath.IsAbs(path) {
			rel, err := filepath.Rel(t.repoRoot, path)
			if err != nil || strings.HasPrefix(rel, "..") {
				return ErrorResult("access denied: path outside repository")
			}
		} else {
			return ErrorResult("access denied: path outside repository")
		}
	}

	fullPath := filepath.Join(t.repoRoot, path)

	switch operation {
	case "analyze_path":
		return t.analyzePath(fullPath)
	case "propose_patch":
		reason, _ := args["reason"].(string)
		return t.proposePatch(fullPath, reason)
	case "apply_patch":
		patch, _ := args["patch"].(string)
		if patch == "" {
			return ErrorResult("patch is required for apply_patch")
		}
		return t.applyPatch(fullPath, patch)
	default:
		return ErrorResult(fmt.Sprintf("unknown operation: %s", operation))
	}
}

func (t *EvolutionTool) analyzePath(path string) *ToolResult {
	info, err := os.Stat(path)
	if err != nil {
		return ErrorResult(fmt.Sprintf("path not found: %v", err))
	}

	if info.IsDir() {
		files, err := os.ReadDir(path)
		if err != nil {
			return ErrorResult(fmt.Sprintf("failed to read directory: %v", err))
		}
		var output strings.Builder
		output.WriteString(fmt.Sprintf("Directory %s contains:\n", path))
		for _, f := range files {
			output.WriteString(fmt.Sprintf("- %s\n", f.Name()))
		}
		return &ToolResult{ForLLM: output.String(), ForUser: "Directory analyzed."}
	}

	content, err := os.ReadFile(path)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to read file: %v", err))
	}

	return &ToolResult{
		ForLLM:  fmt.Sprintf("Content of %s:\n%s", path, string(content)),
		ForUser: fmt.Sprintf("File %s analyzed.", filepath.Base(path)),
	}
}

func (t *EvolutionTool) proposePatch(path string, reason string) *ToolResult {
	// This is a placeholder for actual AI-driven patching logic.
	// In the real system, the agent will use its LLM to generate the patch.
	// Here we just acknowledge the intent.
	return &ToolResult{
		ForLLM:  fmt.Sprintf("Please use your LLM capabilities to generate a patch for %s based on this reason: %s", path, reason),
		ForUser: fmt.Sprintf("Proposed improvement for %s: %s", filepath.Base(path), reason),
	}
}

func (t *EvolutionTool) applyPatch(path string, patch string) *ToolResult {
	// For safety, we should probably use the existing 'edit' tool logic here.
	// But as a separate tool, we can implement atomic writes.
	err := os.WriteFile(path, []byte(patch), 0644)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to apply patch: %v", err))
	}

	logger.InfoCF("evolution", "Self-improvement applied", map[string]any{"path": path})

	return &ToolResult{
		ForLLM:  fmt.Sprintf("Patch applied to %s successfully.", path),
		ForUser: fmt.Sprintf("Successfully improved %s!", filepath.Base(path)),
	}
}
