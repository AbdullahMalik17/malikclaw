# MalikClaw Module Integration Guide

## Overview
This document outlines the completed integration of core MalikClaw modules: Agent Loop, Evaluation, Memory, and Benchmarks.

## Architecture

### Module Communication Flow

```
User Input
    ↓
Run Command (CLI)
    ↓
Agent Loop (loop.go)
    ├─ Planner (ReActPlanner) → Creates ExecutionPlan
    ├─ Executor (ToolExecutor) → Executes steps
    ├─ Evaluator (Critic) → Evaluates results
    └─ Router (SimpleRouter) → Selects models
    ↓
Memory Store (LearningStore) → Persists evaluations
    ↓
Benchmarks (Benchmark) → Tracks metrics
    ↓
Output to User
```

## Integrated Modules

### 1. Agent Loop (`pkg/agent/loop.go`)
- **Core Responsibility**: Message processing and orchestration
- **Components**:
  - Message routing and session management
  - Context building with history and summaries
  - Tool execution with retry logic
  - Media/audio transcription integration
  - MCP (Model Context Protocol) support

**Key Methods**:
- `ProcessDirect()` - Execute task from CLI
- `ProcessDirectWithChannel()` - Execute with channel context
- `runAgentLoop()` - Core message processing
- `runLLMIteration()` - LLM execution with tools
- `runAgenticLoop()` - Advanced Plan→Act→Observe→Reflect cycle

### 2. Evaluation Module (`pkg/agent/eval/`)
- **Core Responsibility**: Self-assessment of task execution
- **Components**:
  - Critic LLM-based evaluator
  - Structured evaluation results
  - Success scoring (0.0-1.0)
  - Action feedback for refinement

**Key Features**:
- Success/failure determination
- Efficiency scoring
- Correctness validation
- Actionable improvement suggestions

**Evaluation Result Structure**:
```go
type EvaluationResult struct {
    Success       bool      // Goal achieved
    SuccessScore  float64   // 0.0-1.0
    Efficiency    float64   // Quality of approach
    Correctness   float64   // Accuracy of result
    WhatWentWrong string    // Error description
    HowToImprove  string    // Improvement advice
    Feedback      string    // Refine message
}
```

### 3. Memory Module (`pkg/memory/`)
- **Core Responsibility**: Long-term learning from evaluations
- **Components**:
  - JSONL-based LearningStore
  - Evaluation persistence
  - Success rate calculation
  - Recent learning retrieval

**Key Features**:
- `RecordEvaluation()` - Save evaluation results
- `GetRecentLearnings()` - Fetch last N evaluations
- `GetCumulativeSuccessRate()` - Track progress
- Automatic lesson injection into system prompts

**Integration Point**: When processing messages, agent retrieves recent lessons and injects them as "CRITICAL PAST LESSONS TO AVOID MISTAKES" into system prompts.

### 4. Benchmarks Module (`pkg/agent/benchmarks/`)
- **Core Responsibility**: Performance metrics and analytics
- **Components**:
  - Execution metrics tracking
  - Aggregated benchmark results
  - Success rate analysis
  - Trend analysis

**Key Features**:
- `RecordExecution()` - Log performance data
- `GetResult()` - Aggregate metrics
- `GetExecutions()` - Access raw data
- `AnalyzeTrend()` - Sliding window success tracking

**Tracked Metrics**:
```go
type ExecutionMetrics struct {
    TaskID        string
    StartTime     time.Time
    EndTime       time.Time
    Duration      time.Duration
    MessageCount  int
    TokenCount    int
    ToolCalls     int
    Errors        int
    Iteration     int
    Evaluation    *EvaluationResult
    Success       bool
}
```

## CLI Interface

### Command: `malikclaw run`

**Usage**:
```bash
malikclaw run "<task>" [flags]
```

**Examples**:
```bash
# Simple task execution
malikclaw run "What time is it?"

# With specific model
malikclaw run "Analyze this data" --model gpt-4

# With metrics display
malikclaw run "Search for news" --metrics

# With debug logging
malikclaw run "Complex task" --debug --verbose
```

**Flags**:
- `-d, --debug` - Enable debug logging (shows all internal logs)
- `-v, --verbose` - Enable verbose logging (info level)
- `-m, --model string` - Override model selection
- `-s, --session string` - Persist context across runs (default: "cli:run")
- `-t, --timeout duration` - Set execution timeout (default: 30s)
- `--metrics` - Display execution metrics
- `-h, --help` - Show help

## Module Integration Points

### 1. Planner Integration
- **Entry**: `NewAgentLoop` initializes ReActPlanner
- **Type**: `Planner` interface in `pkg/agent/interfaces.go`
- **Uses**: LLMProvider for plan decomposition
- **Output**: ExecutionPlan with EnhancedSteps

### 2. Executor Integration
- **Entry**: `NewAgentLoop` initializes ToolExecutor
- **Type**: `Executor` interface
- **Uses**: ToolRegistry for tool invocation
- **Features**: Circuit breaker, retry logic, timeouts
- **Output**: ExecutionResult with metrics

### 3. Evaluator Integration
- **Entry**: `NewAgentLoop` initializes Critic
- **Type**: `Evaluator` interface
- **Uses**: LLMProvider for evaluation prompts
- **Trigger**: Called in runAgenticLoop after plan execution
- **Output**: EvaluationResult

### 4. Router Integration
- **Entry**: `NewAgentLoop` initializes SimpleRouter
- **Type**: `Router` interface
- **Purpose**: Model selection based on task
- **Future**: Can implement intelligent routing strategies

### 5. Memory Integration
- **Entry**: Agent.LearningStore (created per agent)
- **Flow**: Evaluations → LearningStore → injected into system prompt
- **Benefit**: Progressive improvement through learned lessons

### 6. Benchmarks Integration
- **Entry**: `NewAgentLoop` creates Benchmark tracker
- **Flow**: Metrics collected during execution → recorded
- **Access**: `agentLoop.GetBenchmark()`
- **Benefit**: Performance tracking and trend analysis

## Fixed Issues

### 1. Interface Mismatch (FIXED)
- **Problem**: Interfaces in `interfaces.go` didn't match implementations
- **Solution**: Updated interfaces to use correct types:
  - Planner: Returns `*ExecutionPlan` (not TaskPlan)
  - Executor: Takes `EnhancedStep` (not Step)
  - Executor: Returns `*ExecutionResult` (not string)

### 2. Variable Declaration (FIXED)
- **Problem**: Undefined `err` variable in runAgentLoop
- **Solution**: Added proper variable declaration before use

### 3. Unused Variable (FIXED)
- **Problem**: activeModel extracted but never used
- **Solution**: Removed unused variable assignment

### 4. ExecutionResult Handling (FIXED)
- **Problem**: Code expected string but got *ExecutionResult
- **Solution**: Updated code to extract Observation from ExecutionResult

## Debug Logs Generated

### Compilation Errors Fixed:
```
✓ Fixed: successSum declared but not used
✓ Fixed: err variable undefined  
✓ Fixed: activeModel declared but not used
✓ Fixed: Observation type mismatch
✓ Fixed: Interface type mismatches
```

### System Logs Available:
- Agent initialization: Tool count, workspace setup
- Message processing: Channel, sender, session info
- Tool execution: Tool name, arguments, results
- Evaluation: Success scores, feedback, next steps
- Learning: Recent lessons retrieved and applied
- Benchmarks: Execution metrics recorded

## Testing the Integration

### 1. Basic Task Execution
```bash
./bin/malikclaw.exe run "2 + 2 = ?"
```

### 2. With Metrics
```bash
./bin/malikclaw.exe run "Simple task" --metrics
```

### 3. With Debug Output
```bash
./bin/malikclaw.exe run "Debug task" --debug
```

### 4. Session Persistence
```bash
./bin/malikclaw.exe run "First message" --session "mytest"
./bin/malikclaw.exe run "Second message" --session "mytest"
# Second message has context of first
```

## Performance Characteristics

### Token Estimation
- **Method**: 2.5 characters per token
- **Accuracy**: ±5-10% for English text
- **Languages**: Underestimates CJK (Chinese, Japanese, Korean) text

### Execution Metrics
- Message count: Total turns in conversation
- Tool calls: Number of function invocations
- Duration: Wall-clock time
- Iterations: LLM request rounds

### Success Rate Tracking
- Default window: Last 1000 executions
- Calculation: Successful / Total
- Used for: Trend analysis and improvement tracking

## Future Enhancements

1. **Advanced Routing**
   - Cost-aware model selection
   - Latency-based fallback
   - Provider health monitoring

2. **Enhanced Benchmarks**
   - Cost tracking per execution
   - A/B comparison framework
   - Performance regression detection

3. **Learning Optimization**
   - Semantic clustering of lessons
   - Importance weighting
   - Automated lesson curation

4. **Extended Evaluation**
   - Multi-dimensional scoring
   - Custom evaluation criteria
   - User feedback integration

## Configuration

### Agent Configuration
Located in `config/config.example.json`:
- MaxTokens: Context window size
- Temperature: Response randomness
- MaxToolIterations: Maximum tool use cycles
- ExperimentalAgenticLoop: Enable Plan→Act→Observe→Reflect

### Benchmark Configuration
- Max execution size: 1000 (configurable)
- Metric aggregation: Real-time
- Trend window: Configurable

## Troubleshooting

### Problem: "No default agent for run command"
**Cause**: Agent not properly initialized
**Solution**: Check config file exists and contains valid agent definitions

### Problem: "Evaluation failed: context"
**Cause**: LLM provider error during evaluation
**Solution**: Verify provider credentials and model availability

### Problem: "Learning store error"
**Cause**: Workspace directory permission issue
**Solution**: Ensure workspace directory is writable

## Building and Deployment

```bash
# Clean build
go clean ./...
go mod tidy
go build -o bin/malikclaw.exe ./cmd/malikclaw/

# Test compilation
go test ./...

# Cross-compilation (example: Linux)
GOOS=linux GOARCH=amd64 go build -o bin/malikclaw ./cmd/malikclaw/
```

## Summary

The integrated MalikClaw system now provides:
- ✅ End-to-end task execution with evaluation
- ✅ Persistent learning from past attempts
- ✅ Performance benchmarking
- ✅ CLI interface for task execution
- ✅ Modular architecture for extensibility
- ✅ Comprehensive logging and diagnostics

All modules communicate correctly with proper error handling and fallback mechanisms.
