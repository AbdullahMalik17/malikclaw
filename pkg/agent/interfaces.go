package agent

import (
	"context"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/eval"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/executor"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/planner"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

// Planner decomposes a high-level goal into actionable steps.
type Planner interface {
	Plan(ctx context.Context, goal string, context []providers.Message) (*planner.ExecutionPlan, error)
	Refine(ctx context.Context, plan *planner.ExecutionPlan, observation string) (*planner.ExecutionPlan, error)
}

// Executor handles tool invocations and state updates.
type Executor interface {
	Execute(ctx context.Context, step planner.EnhancedStep) (*executor.ExecutionResult, error)
}

// Evaluator assesses the outcome of actions against the goal.
type Evaluator interface {
	Evaluate(ctx context.Context, goal string, history []providers.Message) (*eval.EvaluationResult, error)
}

// Router selects the most efficient model or provider for a given task.
type Router interface {
	Route(ctx context.Context, task string) (providers.FallbackCandidate, error)
}


