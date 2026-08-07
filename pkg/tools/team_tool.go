package tools

import (
	"context"
	"fmt"
	"strings"
)

// TeamRunnerFunc abstracts the execution of a multi-agent team workflow.
type TeamRunnerFunc func(ctx context.Context, goal string, team string) (string, error)

type TeamRunTool struct {
	runner TeamRunnerFunc
}

func NewTeamRunTool(runner TeamRunnerFunc) *TeamRunTool {
	return &TeamRunTool{
		runner: runner,
	}
}

func (t *TeamRunTool) Name() string {
	return "team_run"
}

func (t *TeamRunTool) Description() string {
	return "Execute a goal using a dynamic multi-agent team (Architect, Researcher, Engineer, QA, Communicator) running in a DAG dependency workflow."
}

func (t *TeamRunTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"goal": map[string]any{
				"type":        "string",
				"description": "The high-level goal or task for the multi-agent team to accomplish",
			},
			"team": map[string]any{
				"type":        "string",
				"description": "Optional team configuration to use (default: software-dev-team)",
			},
		},
		"required": []string{"goal"},
	}
}

func (t *TeamRunTool) Execute(ctx context.Context, args map[string]any) *ToolResult {
	goal, ok := args["goal"].(string)
	if !ok || strings.TrimSpace(goal) == "" {
		return ErrorResult("goal is required and must be a non-empty string")
	}

	team, _ := args["team"].(string)

	if t.runner == nil {
		return ErrorResult("Team runner not configured")
	}

	summary, err := t.runner(ctx, goal, team)
	if err != nil {
		return ErrorResult(fmt.Sprintf("team execution failed: %v", err))
	}

	return UserResult(summary)
}
