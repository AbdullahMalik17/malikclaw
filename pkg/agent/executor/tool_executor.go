// MalikClaw - Ultra-lightweight personal AI agent
// Tool executor - legacy compatibility wrapper
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package executor

import (
	"context"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/planner"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

// LegacyToolExecutor provides backward compatibility with the old interface.
// New code should use ToolExecutor from executor.go directly.
type LegacyToolExecutor struct {
	executor *ToolExecutor
}

// NewLegacyToolExecutor creates a compatibility wrapper.
func NewLegacyToolExecutor(registry *tools.ToolRegistry) *LegacyToolExecutor {
	return &LegacyToolExecutor{
		executor: NewToolExecutor(registry),
	}
}

// Execute executes a step (legacy interface).
func (lte *LegacyToolExecutor) Execute(ctx context.Context, step planner.Step) (string, error) {
	// Convert planner.Step to planner.EnhancedStep
	enhancedStep := planner.EnhancedStep{
		Step: planner.Step{
			ID:          step.ID,
			Description: step.Description,
			Tool:        step.Tool,
			Args:        step.Args,
			Expectation: step.Expectation,
		},
	}

	result, err := lte.executor.Execute(ctx, enhancedStep)
	if err != nil {
		return "", err
	}

	return result.Output, nil
}
