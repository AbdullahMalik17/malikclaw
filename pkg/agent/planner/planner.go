// MalikClaw - Ultra-lightweight personal AI agent
// Production-grade agent loop with PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package planner

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

// Step defines a single action within a plan.
// This is the core step type used throughout the planner package.
type Step struct {
	ID          string         `json:"id"`
	Description string         `json:"description"`
	Tool        string         `json:"tool"`
	Args        map[string]any `json:"args"`
	Expectation string         `json:"expectation"`
}

// TaskPlan represents a set of steps to achieve a goal.
type TaskPlan struct {
	Goal  string `json:"goal"`
	Steps []Step `json:"steps"`
}

// PlanState represents the current state of a plan step.
type PlanState string

const (
	PlanStatePending    PlanState = "pending"
	PlanStateInProgress PlanState = "in_progress"
	PlanStateCompleted  PlanState = "completed"
	PlanStateFailed     PlanState = "failed"
	PlanStateSkipped    PlanState = "skipped"
)

// EnhancedStep extends the base Step with execution tracking.
type EnhancedStep struct {
	Step
	State       PlanState   `json:"state"`
	Attempts    int         `json:"attempts"`
	LastAttempt time.Time   `json:"last_attempt,omitempty"`
	Result      *StepResult `json:"result,omitempty"`
	Error       string      `json:"error,omitempty"`
	Duration    time.Duration `json:"duration,omitempty"`
	RetryAfter  time.Duration `json:"retry_after,omitempty"` // Backoff before next retry
}

// StepResult captures the outcome of a step execution.
type StepResult struct {
	Output      string         `json:"output"`
	Observation string         `json:"observation"`
	Metrics     map[string]any `json:"metrics,omitempty"`
	Timestamp   time.Time      `json:"timestamp"`
}

// ExecutionPlan represents a complete plan with tracking.
type ExecutionPlan struct {
	Goal           string         `json:"goal"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	Steps          []EnhancedStep `json:"steps"`
	CurrentStepIdx int            `json:"current_step_idx"`
	IsComplete     bool           `json:"is_complete"`
	FailureReason  string         `json:"failure_reason,omitempty"`
	TotalDuration  time.Duration  `json:"total_duration,omitempty"`
}

// PlannerConfig configures the enhanced planner behavior.
type PlannerConfig struct {
	MaxSteps          int           // Maximum steps in a plan
	MaxRetries        int           // Maximum retries per step
	RetryBackoffBase  time.Duration // Base backoff for retries
	EnableReflection  bool          // Enable plan refinement after each step
	TimeoutPerStep    time.Duration // Timeout for individual steps
}

// DefaultPlannerConfig returns sensible defaults for planner configuration.
func DefaultPlannerConfig() PlannerConfig {
	return PlannerConfig{
		MaxSteps:          20,
		MaxRetries:        3,
		RetryBackoffBase:  time.Second,
		EnableReflection:  true,
		TimeoutPerStep:    5 * time.Minute,
	}
}

// ReActPlanner implements Planner with enhanced reasoning and tracking.
type ReActPlanner struct {
	provider providers.LLMProvider
	model    string
	config   PlannerConfig
}

// NewReActPlanner creates an enhanced ReAct planner.
func NewReActPlanner(p providers.LLMProvider, model string) *ReActPlanner {
	return NewReActPlannerWithConfig(p, model, DefaultPlannerConfig())
}

// NewReActPlannerWithConfig creates an enhanced ReAct planner with custom config.
func NewReActPlannerWithConfig(p providers.LLMProvider, model string, config PlannerConfig) *ReActPlanner {
	return &ReActPlanner{
		provider: p,
		model:    model,
		config:   config,
	}
}

// Plan decomposes a high-level goal into actionable steps with tracking.
// Uses LLM-based reasoning for complex goals, heuristic for simple ones.
func (rp *ReActPlanner) Plan(ctx context.Context, goal string, history []providers.Message) (*ExecutionPlan, error) {
	startTime := time.Now()
	logger.InfoCF("planner", "Creating execution plan", map[string]any{
		"goal":   goal,
		"model":  rp.model,
		"config": rp.config,
	})

	// Check if goal is simple enough for heuristic planning
	if rp.isSimpleGoal(goal) {
		plan := rp.createHeuristicPlan(goal)
		plan.CreatedAt = startTime
		plan.UpdatedAt = startTime
		return plan, nil
	}

	// Use LLM for complex goal decomposition
	plan, err := rp.llmPlan(ctx, goal, history)
	if err != nil {
		logger.ErrorCF("planner", "LLM planning failed", map[string]any{
			"error": err.Error(),
			"goal":  goal,
		})
		// Fall back to heuristic planning
		plan = rp.createHeuristicPlan(goal)
	}

	plan.CreatedAt = startTime
	plan.UpdatedAt = startTime

	// Validate plan constraints
	if len(plan.Steps) > rp.config.MaxSteps {
		logger.WarnCF("planner", "Plan exceeds max steps, truncating", map[string]any{
			"steps":     len(plan.Steps),
			"max":       rp.config.MaxSteps,
			"truncated": true,
		})
		plan.Steps = plan.Steps[:rp.config.MaxSteps]
	}

	logger.InfoCF("planner", "Execution plan created", map[string]any{
		"goal":        goal,
		"step_count":  len(plan.Steps),
		"duration_ms": time.Since(startTime).Milliseconds(),
	})

	return plan, nil
}

// Refine updates the plan based on new observations.
// Called after each step to adapt the plan dynamically.
func (rp *ReActPlanner) Refine(ctx context.Context, plan *ExecutionPlan, observation string) (*ExecutionPlan, error) {
	if !rp.config.EnableReflection {
		return plan, nil
	}

	logger.DebugCF("planner", "Refining plan based on observation", map[string]any{
		"current_step": plan.CurrentStepIdx,
		"total_steps":  len(plan.Steps),
	})

	// Check if we need to add new steps based on observation
	if rp.needsAdditionalSteps(plan, observation) {
		newSteps, err := rp.generateAdditionalSteps(ctx, plan, observation)
		if err != nil {
			logger.ErrorCF("planner", "Failed to generate additional steps", map[string]any{
				"error": err.Error(),
			})
			return plan, err
		}

		if len(newSteps) > 0 {
			// Insert new steps after current position
			plan.Steps = append(plan.Steps[:plan.CurrentStepIdx+1], append(newSteps, plan.Steps[plan.CurrentStepIdx+1:]...)...)
			logger.InfoCF("planner", "Plan refined with additional steps", map[string]any{
				"added": len(newSteps),
				"total": len(plan.Steps),
			})
		}
	}

	plan.UpdatedAt = time.Now()
	return plan, nil
}

// GetNextStep returns the next step to execute.
func (plan *ExecutionPlan) GetNextStep() *EnhancedStep {
	if plan.IsComplete || plan.CurrentStepIdx >= len(plan.Steps) {
		return nil
	}

	step := &plan.Steps[plan.CurrentStepIdx]
	if step.State == PlanStateCompleted || step.State == PlanStateSkipped {
		plan.CurrentStepIdx++
		return plan.GetNextStep()
	}

	return step
}

// MarkStepComplete marks a step as completed with result.
func (plan *ExecutionPlan) MarkStepComplete(idx int, result *StepResult) {
	if idx < 0 || idx >= len(plan.Steps) {
		return
	}

	step := &plan.Steps[idx]
	step.State = PlanStateCompleted
	step.Result = result
	step.Duration = time.Since(step.LastAttempt)
	plan.UpdatedAt = time.Now()

	logger.DebugCF("planner", "Step completed", map[string]any{
		"step_id":  step.ID,
		"duration": step.Duration.String(),
	})
}

// MarkStepFailed marks a step as failed with error.
func (plan *ExecutionPlan) MarkStepFailed(idx int, err error, retryAfter time.Duration) {
	if idx < 0 || idx >= len(plan.Steps) {
		return
	}

	step := &plan.Steps[idx]
	step.State = PlanStateFailed
	step.Error = err.Error()
	step.Attempts++
	step.RetryAfter = retryAfter
	plan.UpdatedAt = time.Now()

	logger.WarnCF("planner", "Step failed", map[string]any{
		"step_id":     step.ID,
		"error":       err.Error(),
		"attempts":    step.Attempts,
		"retry_after": retryAfter.String(),
	})
}

// CanRetry checks if a step can be retried.
func (plan *ExecutionPlan) CanRetry(idx int) bool {
	if idx < 0 || idx >= len(plan.Steps) {
		return false
	}

	step := &plan.Steps[idx]
	return step.Attempts < plan.getMaxRetries()
}

func (plan *ExecutionPlan) getMaxRetries() int {
	// Could be configured per-plan, default to 3
	return 3
}

// Progress returns execution progress as percentage.
func (plan *ExecutionPlan) Progress() float64 {
	if len(plan.Steps) == 0 {
		return 0
	}

	completed := 0
	for _, step := range plan.Steps {
		if step.State == PlanStateCompleted {
			completed++
		}
	}

	return float64(completed) / float64(len(plan.Steps)) * 100
}

// isSimpleGoal checks if the goal can be handled with heuristic planning.
func (rp *ReActPlanner) isSimpleGoal(goal string) bool {
	// Simple goals are typically short and don't require complex reasoning
	goal = strings.ToLower(goal)

	// Check for simple patterns
	simplePatterns := []string{
		"list", "show", "read", "open", "create", "write",
		"search", "find", "get", "fetch",
	}

	for _, pattern := range simplePatterns {
		if strings.HasPrefix(goal, pattern) {
			return true
		}
	}

	// Short goals (< 15 words) are often simple
	words := strings.Fields(goal)
	return len(words) < 10
}

// createHeuristicPlan creates a simple plan based on goal patterns.
func (rp *ReActPlanner) createHeuristicPlan(goal string) *ExecutionPlan {
	goal = strings.TrimSpace(goal)

	// Parse goal to determine appropriate steps
	steps := []EnhancedStep{}

	// Example: "list files in /path" → list_dir step
	if strings.HasPrefix(goal, "list") {
		path := extractPath(goal)
		steps = append(steps, EnhancedStep{
			Step: Step{
				ID:          "list-dir",
				Description: "List directory contents",
				Tool:        "list_dir",
				Args:        map[string]any{"path": path},
				Expectation: "Directory listing",
			},
			State: PlanStatePending,
		})
	}

	return &ExecutionPlan{
		Goal:           goal,
		Steps:          steps,
		CurrentStepIdx: 0,
		IsComplete:     false,
	}
}

// llmPlan uses LLM to create a detailed plan for complex goals.
func (rp *ReActPlanner) llmPlan(ctx context.Context, goal string, history []providers.Message) (*ExecutionPlan, error) {
	// Build planning prompt
	systemPrompt := `You are a planning assistant. Break down the user's goal into clear, actionable steps.
Each step should:
1. Have a unique ID
2. Describe a single action
3. Specify which tool to use
4. Include tool arguments as JSON
5. Define expected outcome

Respond with ONLY a JSON array of steps in this format:
[
  {
    "id": "step-1",
    "description": "What this step does",
    "tool": "tool_name",
    "args": {"arg1": "value1"},
    "expectation": "Expected outcome"
  }
]`

	messages := []providers.Message{
		{Role: "system", Content: systemPrompt},
		{Role: "user", Content: fmt.Sprintf("Create a plan to achieve: %s", goal)},
	}

	// Add relevant history if available
	if len(history) > 0 {
		// Include last few messages for context
		startIdx := len(history) - 10
		if startIdx < 0 {
			startIdx = 0
		}
		messages = append(messages, history[startIdx:]...)
	}

	// Call LLM
	response, err := rp.provider.Chat(ctx, messages, nil, rp.model, nil)
	if err != nil {
		return nil, fmt.Errorf("LLM planning failed: %w", err)
	}

	// Parse response
	var rawSteps []struct {
		ID          string         `json:"id"`
		Description string         `json:"description"`
		Tool        string         `json:"tool"`
		Args        map[string]any `json:"args"`
		Expectation string         `json:"expectation"`
	}

	if err := json.Unmarshal([]byte(response.Content), &rawSteps); err != nil {
		return nil, fmt.Errorf("failed to parse plan: %w", err)
	}

	// Convert to enhanced steps
	steps := make([]EnhancedStep, 0, len(rawSteps))
	for _, raw := range rawSteps {
		steps = append(steps, EnhancedStep{
			Step: Step{
				ID:          raw.ID,
				Description: raw.Description,
				Tool:        raw.Tool,
				Args:        raw.Args,
				Expectation: raw.Expectation,
			},
			State: PlanStatePending,
		})
	}

	return &ExecutionPlan{
		Goal:           goal,
		Steps:          steps,
		CurrentStepIdx: 0,
		IsComplete:     false,
	}, nil
}

// needsAdditionalSteps determines if the plan needs more steps.
func (rp *ReActPlanner) needsAdditionalSteps(plan *ExecutionPlan, observation string) bool {
	// Check if observation indicates incomplete work
	indicators := []string{
		"partial", "incomplete", "missing", "error", "failed",
		"requires", "need", "must", "should",
	}

	obsLower := strings.ToLower(observation)
	for _, indicator := range indicators {
		if strings.Contains(obsLower, indicator) {
			return true
		}
	}

	return false
}

// generateAdditionalSteps creates new steps based on observation.
func (rp *ReActPlanner) generateAdditionalSteps(
	ctx context.Context,
	plan *ExecutionPlan,
	observation string,
) ([]EnhancedStep, error) {
	// Simple heuristic: if observation mentions error, add recovery step
	if strings.Contains(strings.ToLower(observation), "error") {
		return []EnhancedStep{
			{
				Step: Step{
					ID:          "error-recovery",
					Description: "Handle the error and retry",
					Tool:        "shell",
					Args:        map[string]any{"command": "echo 'Retrying after error'"},
					Expectation: "Error handled",
				},
				State: PlanStatePending,
			},
		}, nil
	}

	return nil, nil
}

// extractPath extracts a file path from a goal string.
func extractPath(goal string) string {
	// Simple extraction: look for path-like patterns
	parts := strings.Fields(goal)
	for _, part := range parts {
		if strings.HasPrefix(part, "/") || strings.Contains(part, "/") {
			return part
		}
	}
	return "."
}
