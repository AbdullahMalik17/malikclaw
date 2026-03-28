// MalikClaw - Ultra-lightweight personal AI agent
// Production-grade agent loop: PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

/*
Package agentloop implements a production-grade agent loop with the following cycle:

    PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE

The loop is designed to be:
- Async and efficient: Concurrent tool execution, non-blocking operations
- Resilient: Retry logic, circuit breaker, failure handling
- Observable: Comprehensive logging at each step
- Memory-aware: Persistent storage of actions and results

Usage:

    config := agentloop.DefaultLoopConfig("/path/to/workspace")
    loop := agentloop.NewAgentLoop(config, toolRegistry, llmProvider)
    defer loop.Close()

    result, err := loop.ExecuteGoal(ctx, "List all files in the project")
    if err != nil {
        // Handle error
    }
    fmt.Printf("Goal achieved: %v\n", result.Success)
*/
package agentloop

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/executor"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/memory"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/observer"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/planner"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/reflector"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

// Import alias for clarity - Step type from planner package
type Step = planner.Step

// ExecutionResult represents the outcome of goal execution.
type ExecutionResult struct {
	Goal           string                 `json:"goal"`
	Success        bool                   `json:"success"`
	PartialSuccess bool                   `json:"partial_success"`
	ErrorMessage   string                 `json:"error_message,omitempty"`
	Plan           *planner.ExecutionPlan `json:"plan,omitempty"`
	Reflection     *reflector.ReflectionResult `json:"reflection,omitempty"`
	Iterations     int                    `json:"iterations"`
	Duration       time.Duration          `json:"duration"`
	ActionsTaken   int                    `json:"actions_taken"`
}

// AgentLoop implements the production-grade agent loop.
type AgentLoop struct {
	config     LoopConfig
	toolRegistry *tools.ToolRegistry
	provider   providers.LLMProvider

	// Core components
	planner   *planner.ReActPlanner
	executor  *executor.ToolExecutor
	observer  *observer.Observer
	reflector *reflector.Reflector
	memory    *memory.MemoryManager

	// State
	mu            sync.RWMutex
	running       bool
	currentGoal   string
	cancelFunc    context.CancelFunc

	// Statistics
	stats LoopStatistics
}

// LoopStatistics tracks loop execution statistics.
type LoopStatistics struct {
	TotalGoals      int           `json:"total_goals"`
	SuccessfulGoals int           `json:"successful_goals"`
	FailedGoals     int           `json:"failed_goals"`
	TotalIterations int           `json:"total_iterations"`
	TotalActions    int           `json:"total_actions"`
	AvgDuration     time.Duration `json:"avg_duration"`
	TotalDuration   time.Duration `json:"total_duration"`
}

// NewAgentLoop creates a new agent loop with the given configuration.
func NewAgentLoop(config LoopConfig, toolRegistry *tools.ToolRegistry, provider providers.LLMProvider) *AgentLoop {
	// Validate configuration
	if err := config.Validate(); err != nil {
		logger.ErrorCF("agentloop", "Invalid configuration", map[string]any{
			"error": err.Error(),
		})
		// Use defaults if invalid
		config = DefaultLoopConfig(config.Memory.Workspace)
	}

	// Create planner
	plannerConfig := planner.PlannerConfig{
		MaxSteps:          config.Planner.MaxSteps,
		MaxRetries:        config.Planner.MaxRetries,
		RetryBackoffBase:  config.Planner.RetryBackoffBase,
		EnableReflection:  config.Planner.EnableReflection,
		TimeoutPerStep:    config.Planner.TimeoutPerStep,
	}
	planner := planner.NewReActPlannerWithConfig(provider, config.Reflector.Model, plannerConfig)

	// Create executor
	executorConfig := executor.ExecutorConfig{
		MaxConcurrent:         config.Executor.MaxConcurrent,
		Timeout:               config.Executor.Timeout,
		RetryEnabled:          config.Executor.RetryEnabled,
		MaxRetries:            config.Executor.MaxRetries,
		RetryBackoffBase:      config.Executor.RetryBackoffBase,
		RetryBackoffMax:       config.Executor.RetryBackoffMax,
		RetryMultiplier:       config.Executor.RetryMultiplier,
		CircuitBreakerEnabled: config.Executor.CircuitBreakerEnabled,
		CircuitBreakerThreshold: config.Executor.CircuitBreakerThreshold,
		CircuitBreakerTimeout: config.Executor.CircuitBreakerTimeout,
	}
	executor := executor.NewToolExecutorWithConfig(toolRegistry, executorConfig)

	// Create observer
	observerConfig := observer.ObserverConfig{
		EnableNormalization: config.Observer.EnableNormalization,
		EnableMetrics:       config.Observer.EnableMetrics,
		EnableTagging:       config.Observer.EnableTagging,
		MaxOutputLength:     config.Observer.MaxOutputLength,
		MinConfidence:       config.Observer.MinConfidence,
	}
	observer := observer.NewObserverWithConfig(observerConfig)

	// Create reflector
	reflectorConfig := reflector.ReflectorConfig{
		EnableLLMReflection: config.Reflector.EnableLLMReflection,
		Model:               config.Reflector.Model,
		MinConfidence:       config.Reflector.MinConfidence,
		EnableLessonsLearned: config.Reflector.EnableLessonsLearned,
		ReflectionDepth:     config.Reflector.ReflectionDepth,
	}
	reflector := reflector.NewReflectorWithConfig(provider, reflectorConfig)

	// Create memory manager
	memoryConfig := memory.MemoryConfig{
		Workspace:            config.Memory.Workspace,
		MaxEpisodes:          config.Memory.MaxEpisodes,
		MaxActionsPerEpisode: config.Memory.MaxActionsPerEpisode,
		AutoSave:             config.Memory.AutoSave,
		SaveInterval:         config.Memory.SaveInterval,
		EnableIndexing:       config.Memory.EnableIndexing,
	}
	memManager := memory.NewMemoryManagerWithConfig(memoryConfig)

	loop := &AgentLoop{
		config:       config,
		toolRegistry: toolRegistry,
		provider:     provider,
		planner:      planner,
		executor:     executor,
		observer:     observer,
		reflector:    reflector,
		memory:       memManager,
		stats:        LoopStatistics{},
	}

	logger.InfoCF("agentloop", "Agent loop initialized", map[string]any{
		"workspace":          config.Memory.Workspace,
		"max_iterations":     config.MaxIterations,
		"enable_reflection":  config.EnableReflection,
		"enable_memory":      config.EnableMemory,
		"max_concurrent":     config.Executor.MaxConcurrent,
		"circuit_breaker":    config.Executor.CircuitBreakerEnabled,
	})

	return loop
}

// ExecuteGoal executes a goal using the PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE cycle.
func (al *AgentLoop) ExecuteGoal(ctx context.Context, goal string) (*ExecutionResult, error) {
	startTime := time.Now()

	al.mu.Lock()
	if al.running {
		al.mu.Unlock()
		return nil, fmt.Errorf("agent loop already running")
	}
	al.running = true
	al.currentGoal = goal
	al.mu.Unlock()

	defer func() {
		al.mu.Lock()
		al.running = false
		al.currentGoal = ""
		al.mu.Unlock()
	}()

	logger.InfoCF("agentloop", "Executing goal", map[string]any{
		"goal": goal,
	})

	// Create context with timeout
	if al.config.GoalTimeout > 0 {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, al.config.GoalTimeout)
		defer cancel()
	}

	// Start memory episode
	if al.config.EnableMemory {
		al.memory.StartEpisode(goal)
		defer func() {
			// Episode will be ended with reflection result
		}()
	}

	// Initialize result
	result := &ExecutionResult{
		Goal:       goal,
		Iterations: 0,
	}

	// PLAN: Create execution plan
	logger.InfoCF("agentloop", "PLAN phase", map[string]any{
		"goal": goal,
	})
	plan, err := al.planner.Plan(ctx, goal, nil)
	if err != nil {
		logger.ErrorCF("agentloop", "Planning failed", map[string]any{
			"goal":  goal,
			"error": err.Error(),
		})
		result.Success = false
		result.ErrorMessage = fmt.Sprintf("planning failed: %v", err)
		return result, err
	}
	result.Plan = plan

	// Execute the plan
	result.Success, result.Reflection, err = al.executePlan(ctx, plan, goal)
	result.Duration = time.Since(startTime)
	result.Iterations = plan.CurrentStepIdx
	result.ActionsTaken = len(plan.Steps)

	// Update statistics
	al.updateStats(result)

	logger.InfoCF("agentloop", "Goal execution complete", map[string]any{
		"goal":       goal,
		"success":    result.Success,
		"duration":   result.Duration.String(),
		"iterations": result.Iterations,
	})

	return result, err
}

// executePlan executes a plan through the ACT → OBSERVE → REFLECT → MEMORY UPDATE cycle.
func (al *AgentLoop) executePlan(
	ctx context.Context,
	plan *planner.ExecutionPlan,
	goal string,
) (bool, *reflector.ReflectionResult, error) {

	iteration := 0
	maxIterations := al.config.MaxIterations

	for iteration < maxIterations {
		iteration++

		logger.DebugCF("agentloop", "Starting iteration", map[string]any{
			"iteration": iteration,
			"max":       maxIterations,
			"step_idx":  plan.CurrentStepIdx,
			"total_steps": len(plan.Steps),
		})

		// Check if plan is complete
		if plan.IsComplete || plan.CurrentStepIdx >= len(plan.Steps) {
			logger.InfoCF("agentloop", "Plan complete", map[string]any{
				"iterations": iteration,
			})
			break
		}

		// Check context cancellation
		if ctx.Err() != nil {
			return false, nil, ctx.Err()
		}

		// ACT: Execute next step
		step := plan.GetNextStep()
		if step == nil {
			break
		}

		logger.InfoCF("agentloop", "ACT phase", map[string]any{
			"step_id": step.ID,
			"tool":    step.Tool,
			"attempt": step.Attempts + 1,
		})

		execResult, execErr := al.executor.Execute(ctx, *step)

		// OBSERVE: Capture and process result
		logger.InfoCF("agentloop", "OBSERVE phase", map[string]any{
			"step_id":  step.ID,
			"is_error": execResult.IsError,
		})

		observation := al.observer.Observe(ctx, execResult)

		// Update plan with result
		if execErr == nil && !execResult.IsError {
			stepResult := &planner.StepResult{
				Output:      execResult.Output,
				Observation: observation.Normalized,
				Metrics:     execResult.Metrics,
				Timestamp:   time.Now(),
			}
			plan.MarkStepComplete(plan.CurrentStepIdx, stepResult)
		} else {
			retryAfter := al.executor.CalculateBackoff(step.Attempts)
			plan.MarkStepFailed(plan.CurrentStepIdx, execErr, retryAfter)

			// Check if we can retry
			if plan.CanRetry(plan.CurrentStepIdx) {
				logger.WarnCF("agentloop", "Step failed, will retry", map[string]any{
					"step_id": step.ID,
					"error":   execErr.Error(),
				})
				continue
			}
		}

		// MEMORY UPDATE: Record action
		if al.config.EnableMemory {
			al.memory.RecordAction(
				step.ID,
				step.Tool,
				step.Args,
				execResult.Output,
				execResult.IsError,
				execResult.ErrorMessage,
				execResult.Duration,
				observation,
			)
		}

		// REFLECT: Evaluate progress (optional, can be done per iteration or at end)
		if al.config.EnableReflection && iteration%5 == 0 {
			logger.InfoCF("agentloop", "REFLECT phase (mid-execution)", map[string]any{
				"iteration": iteration,
			})

			observations := al.observer.GetAllObservations()
			reflection := al.reflector.Reflect(ctx, goal, plan, observations)

			// Refine plan based on reflection
			if !reflection.GoalAchieved && len(reflection.NextActions) > 0 {
				logger.InfoCF("agentloop", "Refining plan based on reflection", map[string]any{
					"next_actions": len(reflection.NextActions),
				})
				al.planner.Refine(ctx, plan, reflection.Reasoning)
			}
		}

		// Move to next step if current completed
		if step.State == planner.PlanStateCompleted {
			plan.CurrentStepIdx++
		}
	}

	// Final reflection
	var finalReflection *reflector.ReflectionResult
	if al.config.EnableReflection {
		logger.InfoCF("agentloop", "REFLECT phase (final)", map[string]any{
			"goal": goal,
		})

		observations := al.observer.GetAllObservations()
		finalReflection = al.reflector.Reflect(ctx, goal, plan, observations)
	}

	// End memory episode
	if al.config.EnableMemory {
		al.memory.EndEpisode(finalReflection)
	}

	// Determine success
	success := plan.IsComplete || (finalReflection != nil && finalReflection.GoalAchieved)

	return success, finalReflection, nil
}

// ExecuteGoalAsync executes a goal asynchronously and returns a channel for the result.
func (al *AgentLoop) ExecuteGoalAsync(ctx context.Context, goal string) <-chan *ExecutionResult {
	resultChan := make(chan *ExecutionResult, 1)

	go func() {
		defer close(resultChan)
		result, err := al.ExecuteGoal(ctx, goal)
		if err != nil && result == nil {
			result = &ExecutionResult{
				Goal:         goal,
				Success:      false,
				ErrorMessage: err.Error(),
			}
		}
		resultChan <- result
	}()

	return resultChan
}

// GetStatistics returns loop execution statistics.
func (al *AgentLoop) GetStatistics() LoopStatistics {
	al.mu.RLock()
	defer al.mu.RUnlock()
	return al.stats
}

// GetObserver returns the observer for accessing observations.
func (al *AgentLoop) GetObserver() *observer.Observer {
	return al.observer
}

// GetMemory returns the memory manager for accessing stored episodes.
func (al *AgentLoop) GetMemory() *memory.MemoryManager {
	return al.memory
}

// GetExecutor returns the executor for direct tool execution.
func (al *AgentLoop) GetExecutor() *executor.ToolExecutor {
	return al.executor
}

// GetPlanner returns the planner for direct planning.
func (al *AgentLoop) GetPlanner() *planner.ReActPlanner {
	return al.planner
}

// IsRunning returns whether the loop is currently executing a goal.
func (al *AgentLoop) IsRunning() bool {
	al.mu.RLock()
	defer al.mu.RUnlock()
	return al.running
}

// GetCurrentGoal returns the currently executing goal.
func (al *AgentLoop) GetCurrentGoal() string {
	al.mu.RLock()
	defer al.mu.RUnlock()
	return al.currentGoal
}

// Close cleans up resources.
func (al *AgentLoop) Close() error {
	logger.InfoC("agentloop", "Closing agent loop")

	if al.memory != nil {
		return al.memory.Close()
	}

	return nil
}

// updateStats updates loop statistics after goal execution.
func (al *AgentLoop) updateStats(result *ExecutionResult) {
	al.mu.Lock()
	defer al.mu.Unlock()

	al.stats.TotalGoals++
	al.stats.TotalIterations += result.Iterations
	al.stats.TotalActions += result.ActionsTaken
	al.stats.TotalDuration += result.Duration

	if result.Success {
		al.stats.SuccessfulGoals++
	} else {
		al.stats.FailedGoals++
	}

	if al.stats.TotalGoals > 0 {
		al.stats.AvgDuration = al.stats.TotalDuration / time.Duration(al.stats.TotalGoals)
	}
}

// CalculateBackoff calculates backoff duration for retries.
// This is a helper that delegates to the executor.
func (al *AgentLoop) CalculateBackoff(attempt int) time.Duration {
	// Use executor's backoff calculation
	base := al.config.Executor.RetryBackoffBase
	multiplier := al.config.Executor.RetryMultiplier

	backoff := float64(base) * multiplier * float64(attempt+1)
	if backoff > float64(al.config.Executor.RetryBackoffMax) {
		backoff = float64(al.config.Executor.RetryBackoffMax)
	}

	return time.Duration(backoff)
}
