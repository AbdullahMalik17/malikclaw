package agent

import (
	"context"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/eval"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/executor"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/planner"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/routing"
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

// Router selects the appropriate candidate for a task.
type Router interface {
	Route(ctx context.Context, task string) (providers.FallbackCandidate, error)
}

// AgentFactory dynamically instantiates an AgentInstance given a ProviderProfile.
type AgentFactory interface {
	CreateAgent(ctx context.Context, profile *routing.ProviderProfile) (*AgentInstance, error)
}

// Supervisor manages a multi-agent episode.
type Supervisor interface {
	// Dispatch breaks a goal into subtasks and routes them to specialist agents.
	Dispatch(ctx context.Context, goal string) (*SupervisorEpisode, error)
	// Aggregate reviews specialist outputs and forms a final consensus.
	Aggregate(ctx context.Context, episode *SupervisorEpisode, results map[string]string) (string, error)
}

// SupervisorEpisode represents a multi-agent session.
type SupervisorEpisode struct {
	EpisodeID   string
	Goal        string
	CEOProvider string
	SubTasks    []SubTask
	Consensus   ConsensusRules
}

type SubTask struct {
	TaskID           string   `json:"task_id"`
	Description      string   `json:"description"`
	AssignedProvider string   `json:"assigned_provider,omitempty"`
	Role             string   `json:"role,omitempty"`
	DependsOn        []string `json:"depends_on,omitempty"`
}

type ConsensusRules struct {
	RequireUnanimous bool
	MaxDebateRounds  int
}

