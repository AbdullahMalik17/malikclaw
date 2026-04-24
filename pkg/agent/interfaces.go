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

// ProviderProfile represents the routing constraints of an LLM provider.
type ProviderProfile struct {
	ProviderID   string
	Tier         string
	Capabilities []string
	MaxContext   int
	CostFactor   float64
}

// Router selects the most efficient provider profile based on task tags and complexity.
type Router interface {
	// Route evaluates the task string and history to return a matched provider profile.
	Route(ctx context.Context, task string, complexity float64, tags []string) (*ProviderProfile, error)
}

// AgentFactory dynamically instantiates an agentloop.Instance given a ProviderProfile.
type AgentFactory interface {
	CreateAgent(ctx context.Context, profile *ProviderProfile) (AgentInstance, error)
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
	EpisodeID    string
	Goal         string
	CEOProvider  string
	SubTasks     []SubTask
	Consensus    ConsensusRules
}

type SubTask struct {
	TaskID           string
	Description      string
	AssignedProvider string
}

type ConsensusRules struct {
	RequireUnanimous bool
	MaxDebateRounds  int
}

// AgentInstance represents an individual executing agent (mirrors current Loop).
type AgentInstance interface {
	ExecuteGoal(ctx context.Context, goal string) (*ExecutionResult, error)
}

