// MalikClaw - Ultra-lightweight personal AI agent
// ReAct-style planner - legacy compatibility
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package planner

import (
	"context"

	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

// LegacyReActPlanner provides backward compatibility.
// New code should use ReActPlanner from planner.go directly.
type LegacyReActPlanner struct {
	planner *ReActPlanner
}

// NewLegacyReActPlanner creates a compatibility wrapper.
func NewLegacyReActPlanner(p providers.LLMProvider, model string) *LegacyReActPlanner {
	return &LegacyReActPlanner{
		planner: NewReActPlanner(p, model),
	}
}

// Plan creates a plan (legacy interface returning TaskPlan).
func (lrp *LegacyReActPlanner) Plan(ctx context.Context, goal string, history []providers.Message) (*TaskPlan, error) {
	execPlan, err := lrp.planner.Plan(ctx, goal, history)
	if err != nil {
		return nil, err
	}

	// Convert ExecutionPlan to TaskPlan
	taskPlan := &TaskPlan{
		Goal:  execPlan.Goal,
		Steps: make([]Step, len(execPlan.Steps)),
	}

	for i, step := range execPlan.Steps {
		taskPlan.Steps[i] = Step{
			ID:          step.ID,
			Description: step.Description,
			Tool:        step.Tool,
			Args:        step.Args,
			Expectation: step.Expectation,
		}
	}

	return taskPlan, nil
}

// Refine refines a plan (legacy interface).
func (lrp *LegacyReActPlanner) Refine(ctx context.Context, currentPlan *TaskPlan, observation string) (*TaskPlan, error) {
	// Convert TaskPlan to ExecutionPlan
	execPlan := &ExecutionPlan{
		Goal:  currentPlan.Goal,
		Steps: make([]EnhancedStep, len(currentPlan.Steps)),
	}

	for i, step := range currentPlan.Steps {
		execPlan.Steps[i] = EnhancedStep{
			Step: step,
		}
	}

	refinedPlan, err := lrp.planner.Refine(ctx, execPlan, observation)
	if err != nil {
		return nil, err
	}

	// Convert back to TaskPlan
	taskPlan := &TaskPlan{
		Goal:  refinedPlan.Goal,
		Steps: make([]Step, len(refinedPlan.Steps)),
	}

	for i, step := range refinedPlan.Steps {
		taskPlan.Steps[i] = Step{
			ID:          step.ID,
			Description: step.Description,
			Tool:        step.Tool,
			Args:        step.Args,
			Expectation: step.Expectation,
		}
	}

	return taskPlan, nil
}
