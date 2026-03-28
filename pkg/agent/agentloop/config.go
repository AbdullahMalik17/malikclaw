// MalikClaw - Ultra-lightweight personal AI agent
// Production-grade agent loop with PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package agentloop

import (
	"time"
)

// LoopConfig configures the agent loop behavior.
type LoopConfig struct {
	// Planner configuration
	Planner PlannerConfig `json:"planner"`

	// Executor configuration
	Executor ExecutorConfig `json:"executor"`

	// Observer configuration
	Observer ObserverConfig `json:"observer"`

	// Reflector configuration
	Reflector ReflectorConfig `json:"reflector"`

	// Memory configuration
	Memory MemoryConfig `json:"memory"`

	// Loop behavior
	MaxIterations       int           `json:"max_iterations"`        // Maximum loop iterations per goal
	IterationTimeout    time.Duration `json:"iteration_timeout"`     // Timeout per iteration
	GoalTimeout         time.Duration `json:"goal_timeout"`          // Overall timeout per goal
	EnableParallelTools bool          `json:"enable_parallel_tools"` // Execute tools in parallel when possible
	EnableReflection    bool          `json:"enable_reflection"`     // Enable reflection after each iteration
	EnableMemory        bool          `json:"enable_memory"`         // Enable memory persistence
	VerboseLogging      bool          `json:"verbose_logging"`       // Enable verbose logging
}

// PlannerConfig configures the planner.
type PlannerConfig struct {
	MaxSteps          int           `json:"max_steps"`
	MaxRetries        int           `json:"max_retries"`
	RetryBackoffBase  time.Duration `json:"retry_backoff_base"`
	EnableReflection  bool          `json:"enable_reflection"`
	TimeoutPerStep    time.Duration `json:"timeout_per_step"`
}

// ExecutorConfig configures the executor.
type ExecutorConfig struct {
	MaxConcurrent         int           `json:"max_concurrent"`
	Timeout               time.Duration `json:"timeout"`
	RetryEnabled          bool          `json:"retry_enabled"`
	MaxRetries            int           `json:"max_retries"`
	RetryBackoffBase      time.Duration `json:"retry_backoff_base"`
	RetryBackoffMax       time.Duration `json:"retry_backoff_max"`
	RetryMultiplier       float64       `json:"retry_multiplier"`
	CircuitBreakerEnabled bool          `json:"circuit_breaker_enabled"`
	CircuitBreakerThreshold int         `json:"circuit_breaker_threshold"`
	CircuitBreakerTimeout time.Duration `json:"circuit_breaker_timeout"`
}

// ObserverConfig configures the observer.
type ObserverConfig struct {
	EnableNormalization bool   `json:"enable_normalization"`
	EnableMetrics       bool   `json:"enable_metrics"`
	EnableTagging       bool   `json:"enable_tagging"`
	MaxOutputLength     int    `json:"max_output_length"`
	MinConfidence       float64 `json:"min_confidence"`
}

// ReflectorConfig configures the reflector.
type ReflectorConfig struct {
	EnableLLMReflection bool    `json:"enable_llm_reflection"`
	Model               string  `json:"model"`
	MinConfidence       float64 `json:"min_confidence"`
	EnableLessonsLearned bool   `json:"enable_lessons_learned"`
	ReflectionDepth     string  `json:"reflection_depth"`
}

// MemoryConfig configures memory management.
type MemoryConfig struct {
	Workspace            string        `json:"workspace"`
	MaxEpisodes          int           `json:"max_episodes"`
	MaxActionsPerEpisode int           `json:"max_actions_per_episode"`
	AutoSave             bool          `json:"auto_save"`
	SaveInterval         time.Duration `json:"save_interval"`
	EnableIndexing       bool          `json:"enable_indexing"`
}

// DefaultLoopConfig returns sensible defaults for production use.
func DefaultLoopConfig(workspace string) LoopConfig {
	return LoopConfig{
		Planner: PlannerConfig{
			MaxSteps:          20,
			MaxRetries:        3,
			RetryBackoffBase:  time.Second,
			EnableReflection:  true,
			TimeoutPerStep:    5 * time.Minute,
		},
		Executor: ExecutorConfig{
			MaxConcurrent:         5,
			Timeout:               2 * time.Minute,
			RetryEnabled:          true,
			MaxRetries:            3,
			RetryBackoffBase:      time.Second,
			RetryBackoffMax:       30 * time.Second,
			RetryMultiplier:       2.0,
			CircuitBreakerEnabled: true,
			CircuitBreakerThreshold: 5,
			CircuitBreakerTimeout: time.Minute,
		},
		Observer: ObserverConfig{
			EnableNormalization: true,
			EnableMetrics:       true,
			EnableTagging:       true,
			MaxOutputLength:     10000,
			MinConfidence:       0.5,
		},
		Reflector: ReflectorConfig{
			EnableLLMReflection: true,
			Model:               "default",
			MinConfidence:       0.7,
			EnableLessonsLearned: true,
			ReflectionDepth:     "medium",
		},
		Memory: MemoryConfig{
			Workspace:            workspace,
			MaxEpisodes:          100,
			MaxActionsPerEpisode: 1000,
			AutoSave:             true,
			SaveInterval:         5 * time.Minute,
			EnableIndexing:       true,
		},
		MaxIterations:       50,
		IterationTimeout:    10 * time.Minute,
		GoalTimeout:         1 * time.Hour,
		EnableParallelTools: true,
		EnableReflection:    true,
		EnableMemory:        true,
		VerboseLogging:      false,
	}
}

// WithPlannerMaxSteps sets the maximum number of steps in a plan.
func (c LoopConfig) WithPlannerMaxSteps(max int) LoopConfig {
	c.Planner.MaxSteps = max
	return c
}

// WithExecutorMaxRetries sets the maximum retry attempts.
func (c LoopConfig) WithExecutorMaxRetries(max int) LoopConfig {
	c.Executor.MaxRetries = max
	return c
}

// WithMaxIterations sets the maximum loop iterations.
func (c LoopConfig) WithMaxIterations(max int) LoopConfig {
	c.MaxIterations = max
	return c
}

// WithGoalTimeout sets the overall goal timeout.
func (c LoopConfig) WithGoalTimeout(timeout time.Duration) LoopConfig {
	c.GoalTimeout = timeout
	return c
}

// WithMemory sets the memory configuration.
func (c LoopConfig) WithMemory(config MemoryConfig) LoopConfig {
	c.Memory = config
	return c
}

// WithWorkspace sets the workspace for memory storage.
func (c LoopConfig) WithWorkspace(workspace string) LoopConfig {
	c.Memory.Workspace = workspace
	return c
}

// WithVerboseLogging enables or disables verbose logging.
func (c LoopConfig) WithVerboseLogging(verbose bool) LoopConfig {
	c.VerboseLogging = verbose
	return c
}

// WithReflection enables or disables reflection.
func (c LoopConfig) WithReflection(enabled bool) LoopConfig {
	c.EnableReflection = enabled
	return c
}

// Validate checks if the configuration is valid.
func (c LoopConfig) Validate() error {
	if c.MaxIterations <= 0 {
		return &ConfigError{"max_iterations must be positive"}
	}
	if c.Planner.MaxSteps <= 0 {
		return &ConfigError{"planner.max_steps must be positive"}
	}
	if c.Executor.MaxConcurrent <= 0 {
		return &ConfigError{"executor.max_concurrent must be positive"}
	}
	if c.Memory.MaxEpisodes <= 0 {
		return &ConfigError{"memory.max_episodes must be positive"}
	}
	return nil
}

// ConfigError represents a configuration validation error.
type ConfigError struct {
	Message string
}

func (e *ConfigError) Error() string {
	return "invalid configuration: " + e.Message
}
