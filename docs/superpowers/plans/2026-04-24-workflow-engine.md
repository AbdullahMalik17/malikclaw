# MalikClaw Autonomous Workflow Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a multi-agent autonomous workflow engine with dynamic Gateway routing, MCP integration, and scheduled tasks.

**Architecture:** We use a Gateway-Supervisor pattern. The Gateway (Router) selects specialized LLM providers based on task tags and complexity. For high-complexity tasks, a Supervisor orchestrates multiple Specialist Agents in parallel and aggregates their results.

**Tech Stack:** Go 1.25, MalikClaw Agent Loop, MCP, Cron.

---

### Task 1: Update Core Interfaces

**Files:**
- Modify: `pkg/agent/interfaces.go`

- [ ] **Step 1: Update interfaces to support ProviderProfiles and Supervision**

```go
package agent

import (
	"context"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

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

// ExecutionResult is already defined in loop.go or similar, but ensure it's accessible.
```

- [ ] **Step 2: Verify compilation (even if failing tests)**

Run: `go build ./pkg/agent/...`

- [ ] **Step 3: Commit**

```bash
git add pkg/agent/interfaces.go
git commit -m "feat: update agent interfaces for multi-agent support"
```

---

### Task 2: Provider Profiles and Scoring Logic

**Files:**
- Create: `pkg/routing/profile.go`
- Modify: `pkg/routing/router.go`
- Test: `pkg/routing/router_test.go`

- [ ] **Step 1: Define Provider Profiles and Default Registry**

Create `pkg/routing/profile.go`:
```go
package routing

import "github.com/AbdullahMalik17/malikclaw/pkg/agent"

var DefaultProfiles = []*agent.ProviderProfile{
	{
		ProviderID:   "antigravity",
		Tier:         "ceo",
		Capabilities: []string{"browser", "vision", "frontend"},
		MaxContext:   200000,
		CostFactor:   1.0,
	},
	{
		ProviderID:   "qwen",
		Tier:         "specialist",
		Capabilities: []string{"deep_reasoning", "logic", "repo-scale"},
		MaxContext:   1000000,
		CostFactor:   0.5,
	},
	{
		ProviderID:   "codex",
		Tier:         "specialist",
		Capabilities: []string{"background_automation", "enterprise"},
		MaxContext:   128000,
		CostFactor:   0.8,
	},
	{
		ProviderID:   "gemini",
		Tier:         "lightweight",
		Capabilities: []string{"fast_exec", "mcp-tool"},
		MaxContext:   1000000,
		CostFactor:   0.2,
	},
}
```

- [ ] **Step 2: Implement Routing Logic with Scoring**

Modify `pkg/routing/router.go`:
```go
// Add to Router struct
type Router struct {
	cfg      RouterConfig
	profiles []*agent.ProviderProfile
}

func (r *Router) Route(ctx context.Context, task string, complexity float64, tags []string) (*agent.ProviderProfile, error) {
	var bestProfile *agent.ProviderProfile
	maxScore := -1.0

	for _, p := range r.profiles {
		score := r.calculateScore(p, complexity, tags)
		if score > maxScore {
			maxScore = score
			bestProfile = p
		}
	}
	return bestProfile, nil
}

func (r *Router) calculateScore(p *agent.ProviderProfile, complexity float64, tags []string) float64 {
	capMatch := 0.0
	for _, t := range tags {
		for _, c := range p.Capabilities {
			if t == c {
				capMatch += 1.0
			}
		}
	}
	
	compMatch := 1.0 - math.Abs(complexity - r.tierToComplexity(p.Tier))
	costEff := 1.0 - p.CostFactor

	return (capMatch * 0.5) + (compMatch * 0.3) + (costEff * 0.2)
}

func (r *Router) tierToComplexity(tier string) float64 {
    switch tier {
    case "ceo": return 0.9
    case "specialist": return 0.6
    case "lightweight": return 0.2
    default: return 0.5
    }
}
```

- [ ] **Step 3: Write routing test**

```go
func TestRouter_Route(t *testing.T) {
	r := New(RouterConfig{}, DefaultProfiles)
	profile, _ := r.Route(context.Background(), "Fix UI layout", 0.9, []string{"ui", "browser"})
	assert.Equal(t, "antigravity", profile.ProviderID)
}
```

- [ ] **Step 4: Commit**

```bash
git add pkg/routing/profile.go pkg/routing/router.go pkg/routing/router_test.go
git commit -m "feat: implement dynamic provider routing with scoring matrix"
```

---

### Task 3: Supervisor Implementation

**Files:**
- Create: `pkg/agent/supervisor/supervisor.go`
- Create: `pkg/agent/supervisor/episode.go`

- [ ] **Step 1: Implement Supervisor Dispatcher**

```go
package supervisor

import (
	"context"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
)

type MultiAgentSupervisor struct {
	factory agent.AgentFactory
}

func (s *MultiAgentSupervisor) Dispatch(ctx context.Context, goal string) (*agent.SupervisorEpisode, error) {
	// Use an LLM to decompose the goal into subtasks (mocked here for spec)
	return &agent.SupervisorEpisode{
		EpisodeID: "ep-123",
		Goal:      goal,
		CEOProvider: "antigravity",
		SubTasks: []agent.SubTask{
			{TaskID: "t1", Description: "Implement Logic", AssignedProvider: "qwen"},
			{TaskID: "t2", Description: "Implement UI", AssignedProvider: "antigravity"},
		},
	}, nil
}
```

- [ ] **Step 2: Implement Result Aggregator**

```go
func (s *MultiAgentSupervisor) Aggregate(ctx context.Context, ep *agent.SupervisorEpisode, results map[string]string) (string, error) {
	// Form a final consensus from results
	var final string
	for _, res := range results {
		final += res + "\n---\n"
	}
	return final, nil
}
```

- [ ] **Step 3: Commit**

```bash
git add pkg/agent/supervisor/
git commit -m "feat: add multi-agent supervisor and result aggregation"
```

---

### Task 4: Cron Integration

**Files:**
- Modify: `pkg/cron/service.go`

- [ ] **Step 1: Bind Cron to Supervisor Episodes**

```go
// In pkg/cron/service.go
func (s *Service) ScheduleAgentTask(schedule string, goal string) {
	s.cron.AddFunc(schedule, func() {
		ctx := context.Background()
		episode, _ := s.supervisor.Dispatch(ctx, goal)
		results := make(map[string]string)
		for _, task := range episode.SubTasks {
			// Execute in parallel
			res, _ := s.executeSubTask(ctx, task)
			results[task.TaskID] = res
		}
		s.supervisor.Aggregate(ctx, episode, results)
	})
}
```

- [ ] **Step 2: Commit**

```bash
git add pkg/cron/service.go
git commit -m "feat: integrate cron service with multi-agent supervisor"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Run all tests**

Run: `make test`

- [ ] **Step 2: Final Commit and Cleanup**

```bash
git commit -m "feat: complete autonomous workflow engine implementation"
```
