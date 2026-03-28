// MalikClaw - Ultra-lightweight personal AI agent
// Production-grade agent loop with PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package executor

import (
	"context"
	"fmt"
	"math"
	"sync"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/planner"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

// ExecutorConfig configures the execution behavior.
type ExecutorConfig struct {
	MaxConcurrent     int           // Maximum concurrent tool executions
	Timeout           time.Duration // Default timeout for tool execution
	RetryEnabled      bool          // Enable automatic retries
	MaxRetries        int           // Maximum retry attempts
	RetryBackoffBase  time.Duration // Base for exponential backoff
	RetryBackoffMax   time.Duration // Maximum backoff duration
	RetryMultiplier   float64       // Backoff multiplier (default 2.0)
	CircuitBreakerEnabled bool      // Enable circuit breaker pattern
	CircuitBreakerThreshold int      // Failures before circuit opens
	CircuitBreakerTimeout time.Duration // Time before circuit half-opens
}

// DefaultExecutorConfig returns sensible defaults.
func DefaultExecutorConfig() ExecutorConfig {
	return ExecutorConfig{
		MaxConcurrent:          5,
		Timeout:                2 * time.Minute,
		RetryEnabled:           true,
		MaxRetries:             3,
		RetryBackoffBase:       time.Second,
		RetryBackoffMax:        30 * time.Second,
		RetryMultiplier:        2.0,
		CircuitBreakerEnabled:  true,
		CircuitBreakerThreshold: 5,
		CircuitBreakerTimeout:  time.Minute,
	}
}

// ExecutionResult wraps the result with execution metadata.
type ExecutionResult struct {
	StepID       string                 `json:"step_id"`
	Output       string                 `json:"output"`
	Observation  string                 `json:"observation"`
	IsError      bool                   `json:"is_error"`
	ErrorMessage string                 `json:"error_message,omitempty"`
	Attempts     int                    `json:"attempts"`
	Duration     time.Duration          `json:"duration"`
	Metrics      map[string]any         `json:"metrics,omitempty"`
	ToolResult   *tools.ToolResult      `json:"-"` // Raw tool result for internal use
}

// CircuitBreaker tracks failures and prevents cascading failures.
type CircuitBreaker struct {
	mu              sync.RWMutex
	failures        int
	threshold       int
	state           string // "closed", "open", "half-open"
	lastFailure     time.Time
	timeout         time.Duration
	onStateChange   func(string)
}

// NewCircuitBreaker creates a new circuit breaker.
func NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		threshold: threshold,
		timeout:   timeout,
		state:     "closed",
	}
}

// CanExecute checks if execution is allowed.
func (cb *CircuitBreaker) CanExecute() bool {
	cb.mu.RLock()
	defer cb.mu.RUnlock()

	switch cb.state {
	case "closed":
		return true
	case "open":
		// Check if timeout has passed (half-open)
		if time.Since(cb.lastFailure) > cb.timeout {
			return true
		}
		return false
	case "half-open":
		return true
	default:
		return true
	}
}

// RecordSuccess records a successful execution.
func (cb *CircuitBreaker) RecordSuccess() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.failures = 0
	cb.state = "closed"

	if cb.onStateChange != nil {
		cb.onStateChange("closed")
	}
}

// RecordFailure records a failed execution.
func (cb *CircuitBreaker) RecordFailure() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.failures++
	cb.lastFailure = time.Now()

	if cb.failures >= cb.threshold {
		oldState := cb.state
		cb.state = "open"

		if cb.onStateChange != nil && oldState != "open" {
			cb.onStateChange("open")
		}
	}
}

// State returns the current circuit state.
func (cb *CircuitBreaker) State() string {
	cb.mu.RLock()
	defer cb.mu.RUnlock()
	return cb.state
}

// ToolExecutor handles tool invocations with retry and failure handling.
type ToolExecutor struct {
	registry       *tools.ToolRegistry
	config         ExecutorConfig
	circuitBreaker *CircuitBreaker
	semaphore      chan struct{}
	mu             sync.RWMutex
}

// NewToolExecutor creates a new tool executor.
func NewToolExecutor(registry *tools.ToolRegistry) *ToolExecutor {
	return NewToolExecutorWithConfig(registry, DefaultExecutorConfig())
}

// NewToolExecutorWithConfig creates a tool executor with custom config.
func NewToolExecutorWithConfig(registry *tools.ToolRegistry, config ExecutorConfig) *ToolExecutor {
	executor := &ToolExecutor{
		registry: registry,
		config:   config,
		semaphore: make(chan struct{}, config.MaxConcurrent),
	}

	if config.CircuitBreakerEnabled {
		executor.circuitBreaker = NewCircuitBreaker(
			config.CircuitBreakerThreshold,
			config.CircuitBreakerTimeout,
		)
	}

	return executor
}

// Execute executes a step with retry logic and error handling.
func (te *ToolExecutor) Execute(ctx context.Context, step planner.EnhancedStep) (*ExecutionResult, error) {
	startTime := time.Now()
	logger.DebugCF("executor", "Executing step", map[string]any{
		"step_id": step.ID,
		"tool":    step.Tool,
		"attempt": step.Attempts + 1,
	})

	// Check circuit breaker
	if te.circuitBreaker != nil && !te.circuitBreaker.CanExecute() {
		return &ExecutionResult{
			StepID:       step.ID,
			IsError:      true,
			ErrorMessage: "circuit breaker open - too many failures",
			Attempts:     step.Attempts,
		}, fmt.Errorf("circuit breaker open")
	}

	// Acquire semaphore for concurrency control
	select {
	case te.semaphore <- struct{}{}:
		defer func() { <-te.semaphore }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	// Execute with retry
	result, err := te.executeWithRetry(ctx, step)
	result.Duration = time.Since(startTime)

	if err != nil {
		if te.circuitBreaker != nil {
			te.circuitBreaker.RecordFailure()
		}
		logger.ErrorCF("executor", "Step execution failed", map[string]any{
			"step_id":  step.ID,
			"tool":     step.Tool,
			"error":    err.Error(),
			"attempts": result.Attempts,
			"duration": result.Duration.String(),
		})
	} else {
		if te.circuitBreaker != nil {
			te.circuitBreaker.RecordSuccess()
		}
		logger.InfoCF("executor", "Step executed successfully", map[string]any{
			"step_id":  step.ID,
			"tool":     step.Tool,
			"attempts": result.Attempts,
			"duration": result.Duration.String(),
		})
	}

	return result, err
}

// executeWithRetry handles the retry logic with exponential backoff.
func (te *ToolExecutor) executeWithRetry(ctx context.Context, step planner.EnhancedStep) (*ExecutionResult, error) {
	var lastErr error
	var lastResult *ExecutionResult

	maxRetries := te.config.MaxRetries
	if !te.config.RetryEnabled {
		maxRetries = 0
	}

	for attempt := 0; attempt <= maxRetries; attempt++ {
		step.Attempts = attempt + 1
		step.LastAttempt = time.Now()

		result, err := te.executeOnce(ctx, step)
		lastResult = result
		lastErr = err

		if err == nil && !result.IsError {
			// Success
			return result, nil
		}

		logger.WarnCF("executor", "Execution attempt failed", map[string]any{
			"step_id":  step.ID,
			"attempt":  attempt + 1,
			"max":      maxRetries + 1,
			"error":    err.Error(),
		})

		// Check if we should retry
		if attempt < maxRetries && te.isRetryable(err, result) {
			backoff := te.calculateBackoff(attempt)
			logger.DebugCF("executor", "Retrying after backoff", map[string]any{
				"step_id":     step.ID,
				"backoff":     backoff.String(),
				"next_attempt": attempt + 2,
			})

			// Wait with context cancellation support
			select {
			case <-time.After(backoff):
				// Continue to next attempt
			case <-ctx.Done():
				return result, ctx.Err()
			}
		} else {
			// No more retries or non-retryable error
			break
		}
	}

	return lastResult, lastErr
}

// executeOnce executes a single attempt.
func (te *ToolExecutor) executeOnce(ctx context.Context, step planner.EnhancedStep) (*ExecutionResult, error) {
	// Get tool from registry
	tool, ok := te.registry.Get(step.Tool)
	if !ok {
		return &ExecutionResult{
			StepID:       step.ID,
			IsError:      true,
			ErrorMessage: fmt.Sprintf("tool %s not found", step.Tool),
			Attempts:     step.Attempts,
		}, fmt.Errorf("tool %s not found", step.Tool)
	}

	// Create execution context with timeout
	execCtx := ctx
	if te.config.Timeout > 0 {
		var cancel context.CancelFunc
		execCtx, cancel = context.WithTimeout(ctx, te.config.Timeout)
		defer cancel()
	}

	// Add tool context metadata
	execCtx = tools.WithToolContext(execCtx, "agent", "agent_loop")

	logger.DebugCF("executor", "Calling tool", map[string]any{
		"step_id": step.ID,
		"tool":    step.Tool,
		"args":    sanitizeArgs(step.Args),
	})

	// Execute tool
	result := tool.Execute(execCtx, step.Args)
	var err error
	if result != nil && result.IsError {
		err = result.Err
		if err == nil && result.ForUser != "" {
			err = fmt.Errorf("%s", result.ForUser)
		} else if err == nil {
			err = fmt.Errorf("%s", result.ForLLM)
		}
	}

	// Build execution result
	execResult := &ExecutionResult{
		StepID:      step.ID,
		Attempts:    step.Attempts,
		ToolResult:  result,
		Metrics:     make(map[string]any),
	}

	if result != nil {
		execResult.Output = result.ForLLM
		execResult.Observation = result.ForLLM
		execResult.IsError = result.IsError
		execResult.ErrorMessage = result.ForUser
	}

	if err != nil {
		execResult.IsError = true
		execResult.ErrorMessage = err.Error()
		execResult.Output = err.Error()
	}

	// Add metrics
	execResult.Metrics["tool"] = step.Tool
	execResult.Metrics["args_count"] = len(step.Args)
	if result != nil {
		execResult.Metrics["has_for_user"] = result.ForUser != ""
		execResult.Metrics["is_silent"] = result.Silent
	}

	return execResult, err
}

// isRetryable determines if an error is retryable.
func (te *ToolExecutor) isRetryable(err error, result *ExecutionResult) bool {
	if err == nil && result != nil {
		// Check if result indicates a retryable condition
		return result.IsError && !isNonRetryableError(result.ErrorMessage)
	}

	if err != nil {
		return !isNonRetryableError(err.Error())
	}

	return true
}

// isNonRetryableError checks for errors that shouldn't be retried.
func isNonRetryableError(errMsg string) bool {
	nonRetryable := []string{
		"not found",
		"invalid argument",
		"permission denied",
		"unauthorized",
		"forbidden",
		"not implemented",
	}

	errMsgLower := errMsg
	for _, pattern := range nonRetryable {
		if contains(errMsgLower, pattern) {
			return true
		}
	}

	return false
}

// calculateBackoff computes exponential backoff duration.
func (te *ToolExecutor) calculateBackoff(attempt int) time.Duration {
	base := te.config.RetryBackoffBase
	multiplier := te.config.RetryMultiplier

	// Exponential backoff: base * multiplier^attempt
	backoff := float64(base) * math.Pow(multiplier, float64(attempt))

	// Add jitter (±10%)
	jitter := backoff * 0.1
	backoff = backoff + (jitter * (float64(time.Now().UnixNano()%1000) / 500 - 1))

	// Cap at maximum
	if backoff > float64(te.config.RetryBackoffMax) {
		backoff = float64(te.config.RetryBackoffMax)
	}

	return time.Duration(backoff)
}

// ExecuteParallel executes multiple steps in parallel.
func (te *ToolExecutor) ExecuteParallel(
	ctx context.Context,
	steps []planner.EnhancedStep,
) ([]*ExecutionResult, error) {
	if len(steps) == 0 {
		return nil, nil
	}

	logger.InfoCF("executor", "Executing steps in parallel", map[string]any{
		"count": len(steps),
	})

	var wg sync.WaitGroup
	results := make([]*ExecutionResult, len(steps))
	errors := make([]error, len(steps))

	for i, step := range steps {
		wg.Add(1)
		go func(idx int, s planner.EnhancedStep) {
			defer wg.Done()
			result, err := te.Execute(ctx, s)
			results[idx] = result
			errors[idx] = err
		}(i, step)
	}

	wg.Wait()

	// Collect errors
	var combinedErr error
	for _, err := range errors {
		if err != nil {
			combinedErr = err
			break
		}
	}

	return results, combinedErr
}

// GetCircuitState returns the current circuit breaker state.
func (te *ToolExecutor) GetCircuitState() string {
	if te.circuitBreaker == nil {
		return "disabled"
	}
	return te.circuitBreaker.State()
}

// ResetCircuitBreaker resets the circuit breaker.
func (te *ToolExecutor) ResetCircuitBreaker() {
	if te.circuitBreaker != nil {
		te.circuitBreaker.mu.Lock()
		te.circuitBreaker.failures = 0
		te.circuitBreaker.state = "closed"
		te.circuitBreaker.mu.Unlock()

		logger.InfoC("executor", "Circuit breaker reset")
	}
}

// CalculateBackoff calculates the backoff duration for a given attempt.
// Exported for use by the agent loop.
func (te *ToolExecutor) CalculateBackoff(attempt int) time.Duration {
	base := te.config.RetryBackoffBase
	multiplier := te.config.RetryMultiplier

	// Exponential backoff: base * multiplier^attempt
	backoff := float64(base) * math.Pow(multiplier, float64(attempt))

	// Add jitter (±10%)
	jitter := backoff * 0.1
	backoff = backoff + (jitter * (float64(time.Now().UnixNano()%1000) / 500 - 1))

	// Cap at maximum
	if backoff > float64(te.config.RetryBackoffMax) {
		backoff = float64(te.config.RetryBackoffMax)
	}

	return time.Duration(backoff)
}

// contains is a helper for case-insensitive substring search.
func contains(s, substr string) bool {
	return len(s) >= len(substr) && 
		(s == substr || len(s) > len(substr) && 
		(s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || 
		findSubstring(s, substr)))
}

func findSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// sanitizeArgs removes sensitive data from args for logging.
func sanitizeArgs(args map[string]any) map[string]any {
	sanitized := make(map[string]any)
	sensitiveKeys := []string{"password", "secret", "token", "key", "api_key", "apikey"}

	for k, v := range args {
		isSensitive := false
		for _, sensitive := range sensitiveKeys {
			if contains(k, sensitive) {
				isSensitive = true
				break
			}
		}

		if isSensitive {
			sanitized[k] = "[REDACTED]"
		} else {
			sanitized[k] = v
		}
	}

	return sanitized
}
