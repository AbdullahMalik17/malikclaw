# Production-Grade Agent Loop

This package implements a production-grade agent loop for MalikClaw with the cycle:

```
PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AgentLoop                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │ Planner  │ → │ Executor │ → │ Observer │ → │ Reflector│     │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘     │
│       ↑                                              │          │
│       └────────────── Memory Manager ────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Planner (`pkg/agent/planner/`)

**Purpose:** Decomposes high-level goals into actionable steps.

**Features:**
- LLM-based planning for complex goals
- Heuristic planning for simple goals
- Dynamic plan refinement based on observations
- Step state tracking (pending, in_progress, completed, failed)
- Configurable max steps and retries

**Key Types:**
```go
type ExecutionPlan struct {
    Goal           string
    Steps          []EnhancedStep
    CurrentStepIdx int
    IsComplete     bool
}

type EnhancedStep struct {
    Step        // Basic step info
    State       PlanState
    Attempts    int
    Result      *StepResult
    Error       string
    Duration    time.Duration
}
```

**Usage:**
```go
planner := planner.NewReActPlanner(provider, "claude-sonnet-4-5-20250929")
plan, err := planner.Plan(ctx, "List all Go files in the project", nil)
```

### 2. Executor (`pkg/agent/executor/`)

**Purpose:** Executes tool calls with retry logic and failure handling.

**Features:**
- Exponential backoff with jitter
- Circuit breaker pattern for cascading failure prevention
- Concurrent tool execution (configurable limit)
- Retry with configurable max attempts
- Timeout per tool execution

**Key Types:**
```go
type ExecutorConfig struct {
    MaxConcurrent         int
    Timeout               time.Duration
    RetryEnabled          bool
    MaxRetries            int
    RetryBackoffBase      time.Duration
    CircuitBreakerEnabled bool
    CircuitBreakerThreshold int
}

type ExecutionResult struct {
    StepID      string
    Output      string
    IsError     bool
    Attempts    int
    Duration    time.Duration
    Metrics     map[string]any
}
```

**Backoff Strategy:**
```
backoff = base × multiplier^attempt ± 10% jitter
capped at max backoff
```

**Usage:**
```go
executor := executor.NewToolExecutor(toolRegistry)
result, err := executor.Execute(ctx, step)
```

### 3. Observer (`pkg/agent/observer/`)

**Purpose:** Captures, normalizes, and tags execution observations.

**Features:**
- Output normalization (JSON formatting, whitespace cleanup)
- Auto-tagging based on content
- Confidence scoring
- Metrics collection
- Callback support for real-time processing

**Key Types:**
```go
type Observation struct {
    StepID      string
    Timestamp   time.Time
    RawOutput   string
    Normalized  string
    IsError     bool
    Confidence  float64
    Tags        []string
    Metrics     map[string]any
}
```

**Usage:**
```go
observer := observer.NewObserver()
obs := observer.Observe(ctx, execResult)

// Get observations by tag
fileOps := observer.GetObservationsByTag("file_operation")

// Get summary
summary := observer.GetSummary()
```

### 4. Reflector (`pkg/agent/reflector/`)

**Purpose:** Evaluates execution outcomes and provides insights.

**Features:**
- Heuristic evaluation (success rate, error analysis)
- LLM-enhanced reflection (optional)
- Lessons learned extraction
- Next action recommendations
- Confidence scoring

**Key Types:**
```go
type ReflectionResult struct {
    IsSuccess       bool
    Confidence      float64
    Reasoning       string
    GoalAchieved    bool
    PartialProgress bool
    NextActions     []string
    LessonsLearned  []string
}
```

**Usage:**
```go
reflector := reflector.NewReflector(provider)
reflection := reflector.Reflect(ctx, goal, plan, observations)

if reflection.GoalAchieved {
    // Goal completed successfully
} else {
    // Check next actions
    for _, action := range reflection.NextActions {
        // Take remedial action
    }
}
```

### 5. Memory (`pkg/agent/memory/`)

**Purpose:** Persistent storage of actions and episodes.

**Features:**
- Episode-based organization (one episode per goal)
- Action indexing for search
- Auto-save with configurable interval
- Statistics and analytics
- Configurable retention limits

**Key Types:**
```go
type Episode struct {
    ID             string
    Goal           string
    StartTime      time.Time
    EndTime        time.Time
    Status         string  // success, partial, failed
    Actions        []ActionRecord
    Reflection     *ReflectionResult
    LessonsLearned []string
}

type ActionRecord struct {
    ID          string
    Timestamp   time.Time
    Tool        string
    Args        map[string]any
    Output      string
    IsError     bool
    Duration    time.Duration
}
```

**Usage:**
```go
mem := memory.NewMemoryManager("/path/to/workspace")
defer mem.Close()

// Start episode
mem.StartEpisode("My goal")

// Record actions
mem.RecordAction(stepID, tool, args, output, isError, errorMsg, duration, obs)

// End episode with reflection
mem.EndEpisode(reflection)

// Search past actions
actions := mem.SearchActions("file", "list_dir")
```

### 6. Agent Loop (`pkg/agent/agentloop/`)

**Purpose:** Orchestrates all components in the PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE cycle.

**Features:**
- Async goal execution
- Configurable timeouts and limits
- Statistics tracking
- Circuit breaker integration
- Memory persistence

**Key Types:**
```go
type LoopConfig struct {
    Planner       PlannerConfig
    Executor      ExecutorConfig
    Observer      ObserverConfig
    Reflector     ReflectorConfig
    Memory        MemoryConfig
    
    MaxIterations    int
    IterationTimeout time.Duration
    GoalTimeout      time.Duration
    EnableReflection bool
    EnableMemory     bool
}

type ExecutionResult struct {
    Goal           string
    Success        bool
    PartialSuccess bool
    ErrorMessage   string
    Plan           *ExecutionPlan
    Reflection     *ReflectionResult
    Iterations     int
    Duration       time.Duration
}
```

**Usage:**
```go
// Create loop with defaults
config := agentloop.DefaultLoopConfig("/workspace")
loop := agentloop.NewAgentLoop(config, toolRegistry, provider)
defer loop.Close()

// Execute goal synchronously
result, err := loop.ExecuteGoal(ctx, "Find all TODO comments in the codebase")

// Execute goal asynchronously
resultChan := loop.ExecuteGoalAsync(ctx, "My goal")
result := <-resultChan

// Access statistics
stats := loop.GetStatistics()
fmt.Printf("Success rate: %.1f%%\n", stats.SuccessRate*100)
```

## Configuration

### Default Configuration

```go
config := agentloop.DefaultLoopConfig("/workspace")
```

### Custom Configuration

```go
config := agentloop.LoopConfig{
    Planner: planner.PlannerConfig{
        MaxSteps:         20,
        MaxRetries:       3,
        RetryBackoffBase: time.Second,
        EnableReflection: true,
    },
    Executor: executor.ExecutorConfig{
        MaxConcurrent:         5,
        Timeout:               2 * time.Minute,
        RetryEnabled:          true,
        MaxRetries:            3,
        RetryBackoffBase:      time.Second,
        RetryBackoffMax:       30 * time.Second,
        CircuitBreakerEnabled: true,
        CircuitBreakerThreshold: 5,
    },
    MaxIterations:    50,
    GoalTimeout:      time.Hour,
    EnableReflection: true,
    EnableMemory:     true,
}

loop := agentloop.NewAgentLoop(config, toolRegistry, provider)
```

### Fluent Configuration

```go
config := agentloop.DefaultLoopConfig("/workspace").
    WithMaxIterations(100).
    WithGoalTimeout(2 * time.Hour).
    WithVerboseLogging(true).
    WithReflection(true)
```

## Execution Flow

```
1. ExecuteGoal(goal)
   │
   ├─→ PLAN: Create execution plan
   │   └─→ planner.Plan(goal, history)
   │
   ├─→ LOOP (until complete or max iterations)
   │   │
   │   ├─→ ACT: Execute next step
   │   │   └─→ executor.Execute(step)
   │   │       ├─→ Retry with exponential backoff
   │   │       └─→ Circuit breaker check
   │   │
   │   ├─→ OBSERVE: Capture result
   │   │   └─→ observer.Observe(result)
   │   │       ├─→ Normalize output
   │   │       ├─→ Calculate confidence
   │   │       └─→ Generate tags
   │   │
   │   ├─→ MEMORY UPDATE: Record action
   │   │   └─→ memory.RecordAction(...)
   │   │
   │   └─→ REFLECT (every N iterations)
   │       └─→ reflector.Reflect(goal, plan, observations)
   │           ├─→ Evaluate success
   │           ├─→ Extract lessons
   │           └─→ Recommend next actions
   │
   └─→ Return ExecutionResult
```

## Error Handling

### Retry Strategy

```
Attempt 1: Immediate
Attempt 2: base × 2^1 ± jitter
Attempt 3: base × 2^2 ± jitter
...
Max: capped at retryBackoffMax
```

### Non-Retryable Errors

The following errors are NOT retried:
- "not found"
- "invalid argument"
- "permission denied"
- "unauthorized"
- "forbidden"
- "not implemented"

### Circuit Breaker

```
Closed → Open: After threshold consecutive failures
Open → Half-Open: After timeout
Half-Open → Closed: On success
Half-Open → Open: On failure
```

## Logging

All components use structured logging with the `logger` package:

```go
// Planner
INFO  [planner] Creating execution plan  goal="..."  model="..."
INFO  [planner] Execution plan created   goal="..."  step_count=5

// Executor
DEBUG [executor] Executing step  step_id="..."  tool="..."  attempt=1
INFO  [executor] Step executed successfully  step_id="..."  duration="1.2s"
WARN  [executor] Step failed  step_id="..."  error="..."  attempts=3

// Observer
INFO  [observer] Observation recorded  step_id="..."  confidence=0.85  tags=["file"]

// Reflector
INFO  [reflector] Starting reflection  goal="..."  observations=10
INFO  [reflector] Reflection complete  is_success=true  confidence=0.92

// Memory
INFO  [memory] Episode started  episode_id="..."  goal="..."
INFO  [memory] Action recorded  action_id="..."  tool="list_dir"
```

## Statistics

Track loop performance:

```go
stats := loop.GetStatistics()

fmt.Printf("Total goals: %d\n", stats.TotalGoals)
fmt.Printf("Successful: %d (%.1f%%)\n", 
    stats.SuccessfulGoals, 
    stats.SuccessRate*100)
fmt.Printf("Average duration: %v\n", stats.AvgDuration)
fmt.Printf("Total actions: %d\n", stats.TotalActions)
```

## Best Practices

1. **Set appropriate timeouts:** Configure `GoalTimeout` based on expected task complexity.

2. **Tune retry parameters:** Adjust `MaxRetries` and backoff based on tool reliability.

3. **Enable circuit breaker:** Prevents cascading failures when tools are unreliable.

4. **Use memory persistence:** Enables learning from past executions and searching history.

5. **Monitor confidence scores:** Low confidence observations may indicate issues.

6. **Review lessons learned:** Use reflection output to improve future executions.

## Example: Complete Workflow

```go
package main

import (
    "context"
    "fmt"
    "log"
    "time"

    "github.com/AbdullahMalik17/malikclaw/pkg/agent/agentloop"
    "github.com/AbdullahMalik17/malikclaw/pkg/tools"
    "github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

func main() {
    ctx := context.Background()

    // Initialize components
    toolRegistry := tools.NewToolRegistry()
    // ... register tools ...

    provider := // ... initialize LLM provider ...

    // Create agent loop
    config := agentloop.DefaultLoopConfig("/workspace").
        WithMaxIterations(50).
        WithGoalTimeout(30 * time.Minute)

    loop := agentloop.NewAgentLoop(config, toolRegistry, provider)
    defer loop.Close()

    // Execute goal
    goal := "Find all Go files with TODO comments and create a summary"
    
    result, err := loop.ExecuteGoal(ctx, goal)
    if err != nil {
        log.Fatalf("Execution failed: %v", err)
    }

    // Process result
    fmt.Printf("Goal: %s\n", result.Goal)
    fmt.Printf("Success: %v\n", result.Success)
    fmt.Printf("Duration: %v\n", result.Duration)
    fmt.Printf("Iterations: %d\n", result.Iterations)

    if result.Reflection != nil {
        fmt.Printf("Confidence: %.1f%%\n", result.Reflection.Confidence*100)
        fmt.Printf("Lessons learned:\n")
        for _, lesson := range result.Reflection.LessonsLearned {
            fmt.Printf("  - %s\n", lesson)
        }
    }

    // Access memory
    mem := loop.GetMemory()
    episodes := mem.GetRecentEpisodes(5)
    for _, ep := range episodes {
        fmt.Printf("Episode: %s - %s (%s)\n", 
            ep.ID, ep.Goal, ep.Status)
    }
}
```

## Migration from Legacy Code

The new agent loop is backward compatible with existing code:

```go
// Old code still works
planner := planner.NewReActPlanner(provider, model)
executor := executor.NewToolExecutor(registry)

// New code uses enhanced components
config := agentloop.DefaultLoopConfig(workspace)
loop := agentloop.NewAgentLoop(config, registry, provider)
```

## License

MIT License - See LICENSE file for details.
