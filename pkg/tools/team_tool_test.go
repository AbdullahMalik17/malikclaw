package tools

import (
	"context"
	"fmt"
	"strings"
	"testing"
)

func TestTeamRunTool_Execution(t *testing.T) {
	runner := func(ctx context.Context, goal string, team string) (string, error) {
		return fmt.Sprintf("Multi-Agent Team Execution Summary for goal '%s' with team '%s'", goal, team), nil
	}

	tool := NewTeamRunTool(runner)

	if tool.Name() != "team_run" {
		t.Errorf("expected tool name 'team_run', got %s", tool.Name())
	}

	result := tool.Execute(context.Background(), map[string]any{
		"goal": "Refactor memory allocation in Go core",
	})

	if result.IsError {
		t.Fatalf("expected success, got error: %s", result.ForLLM)
	}

	if !strings.Contains(result.ForLLM, "Multi-Agent Team Execution Summary") || !strings.Contains(result.ForLLM, "Refactor memory allocation") {
		t.Errorf("result content missing expected sections: %s", result.ForLLM)
	}
}
