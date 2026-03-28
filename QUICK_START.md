# MalikClaw Integrated System: Quick Start Guide

## System Overview

MalikClaw is now a fully integrated AI agent system with:
- **Agent Loop**: Plan → Act → Observe → Reflect execution cycle
- **Evaluation**: LLM-based self-assessment of task results
- **Memory**: Learning from past evaluations
- **Benchmarks**: Performance tracking and analytics
- **CLI**: `malikclaw run` command for task execution

## Installation & Setup

### Prerequisites
- Go 1.19+ (for building from source)
- LLM API keys (OpenAI, Anthropic, etc.)

### Build
```bash
cd e:\WEB DEVELOPMENT\malikclaw
go build -o bin/malikclaw.exe ./cmd/malikclaw/
```

### Configure
Create or update `config.json`:
```json
{
  "agents": {
    "defaults": {
      "model": "gpt-4",
      "max_tokens": 4096,
      "temperature": 0.3,
      "workspace": "./workspace"
    }
  },
  "providers": {
    "openai": {
      "api_key": "your-key-here"
    }
  }
}
```

## Quick Start Examples

### 1. Simple Task
```bash
./bin/malikclaw.exe run "What is 2+2?"
```

**Output**:
```
✓ Agent initialized with 15 tools

Task Result
══════════════════════════════════════════════════════════════════
The sum of 2 plus 2 equals 4.
══════════════════════════════════════════════════════════════════

Evaluation Results
Success: ✓
Score: 1.0/1.0
```

### 2. Task with Context Persistence
```bash
# First message
./bin/malikclaw.exe run "Remember my name is Alice" --session "alice-session"

# Second message (context preserved)
./bin/malikclaw.exe run "What's my name?" --session "alice-session"
```

Output shows agent remembers "Alice" from the first message.

### 3. Task with Metrics
```bash
./bin/malikclaw.exe run "Search for recent AI breakthroughs" --metrics
```

Shows:
- Duration
- Message count
- Token usage estimate
- Execution metrics

### 4. Debug Mode
```bash
./bin/malikclaw.exe run "Complex task" --debug
```

Displays all internal logs for troubleshooting.

### 5. Custom Model Selection
```bash
./bin/malikclaw.exe run "Analyze code" --model gpt-4-turbo
```

## How It Works

### Execution Flow
```
1. User Input
   ↓
2. Agent Loop receives task
   ↓
3. Planner creates execution plan
   ↓
4. Executor runs tools from plan
   ↓
5. Evaluator assesses success
   ↓
6. Memory records evaluation
   ↓
7. Benchmarks tracks metrics
   ↓
8. Response returned to user
```

### Learning Process
```
Execution 1: Task → Evaluation → Learning Store
   ↑
   └── Next Execution: Retrieves lessons, avoids past mistakes
```

### Metrics Tracking
```
Each Execution Records:
- Duration
- Message count
- Token usage
- Tool calls
- Success/failure
- Evaluation score
```

## Command Reference

### `malikclaw run`

**Basic Usage**:
```bash
malikclaw run "<your task>"
```

**Available Flags**:

| Flag | Short | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--debug` | `-d` | bool | false | Enable debug logging |
| `--verbose` | `-v` | bool | false | Enable info-level logging |
| `--model` | `-m` | string | "" | Override model selection |
| `--session` | `-s` | string | "cli:run" | Session key for context |
| `--timeout` | `-t` | duration | 30s | Execution timeout |
| `--metrics` | - | bool | false | Show metrics after run |
| `--help` | `-h` | - | - | Show help text |

**Examples**:
```bash
# Different models
malikclaw run "Task" -m gpt-4
malikclaw run "Task" -m claude-3
malikclaw run "Task" -m mistral

# Logging levels
malikclaw run "Task" -v     # Info logs
malikclaw run "Task" -d     # Debug logs
malikclaw run "Task" -dd    # Very verbose

# Session management
malikclaw run "Task 1" -s session1
malikclaw run "Task 2" -s session1  # Session1 context preserved

# Extended timeout for complex tasks
malikclaw run "Complex analysis" -t 2m

# Combine multiple flags
malikclaw run "Task" -m gpt-4 --metrics -v -t 60s
```

## Understanding Output

### Success Response
```
Task Result
══════════════════════════════════════════════════════════════════
[Response from agent in markdown format]
══════════════════════════════════════════════════════════════════

Execution Metrics
  Duration: 2.3s
  Messages: 5
  Estimated Tokens: ~450

Evaluation Results
  Status: ✓ Success
  Score: 0.95/1.0
  Feedback: Task completed with minor inefficiencies
```

### Failed Response
```
Evaluation Results
  Status: ✗ Failed
  Score: 0.45/1.0
  Feedback: Incomplete analysis. Missing verification steps.
```

## Performance Tips

### 1. Faster Execution
- Use smaller models: `--model gpt-3.5-turbo`
- Reduce context: Use shorter session keys
- Set appropriate timeout

### 2. Better Results
- Use larger models: `--model gpt-4`
- Persist sessions for context
- Enable debug logging to understand reasoning

### 3. Cost Optimization
- Monitor token usage: Use `--metrics`
- Cache results: Reuse session keys
- Batch similar tasks

## File Structure

```
workspace/
├── agents/
│   └── default/
│       ├── tools/           # Tool definitions
│       ├── sessions/        # Conversation history
│       └── learning.jsonl   # Evaluation records
├── state/                   # Channel state info
└── media/                   # Temporary media storage
```

## Advanced Features

### Session Persistence
Tasks in the same session maintain conversation context:
```bash
./bin/malikclaw.exe run "I like pizza" --session "preferences"
./bin/malikclaw.exe run "What food do I like?" --session "preferences"
# Remembers: "You like pizza from our earlier conversation"
```

### Learning from History
Recent evaluations are automatically injected:
```
System Prompt Includes:
"CRITICAL PAST LESSONS TO AVOID MISTAKES:
 Lesson 1: When... Improvement: ...
 Lesson 2: When... Improvement: ..."
```

### Metrics Analysis
Access benchmarks programmatically:
```bash
# In Go code:
benchmark := agentLoop.GetBenchmark()
results := benchmark.GetResult()
```

## Troubleshooting

### "No model available"
- Check config.json has valid provider setup
- Verify API keys are set correctly
- Test: `malikclaw --config ./config.json run "test"`

### "Evaluation failed"
- Check LLM provider is responding
- Verify sufficient tokens available
- Enable debug mode: `-d`

### "Session not found"
- Session keys are case-sensitive
- Default session: "cli:run"
- List sessions: Check workspace/agents/default/sessions/

### Timeout errors
- Increase timeout: `--timeout 2m`
- Check network connectivity
- Monitor provider rate limits

## Next Steps

1. **Configure Your API Keys**: Set up valid provider credentials
2. **Test Simple Tasks**: Verify basic functionality
3. **Enable Learning**: Run multiple tasks to build knowledge
4. **Monitor Metrics**: Use `--metrics` to track performance
5. **Customize System Prompt**: Adjust agent behavior in config
6. **Integrate with External Tools**: Add custom tools to toolbox

## Support & Documentation

- **Full docs**: See `docs/MODULE_INTEGRATION.md`
- **Debug logs**: Check `DEBUG_LOGS_AND_FIXES.md`
- **Architecture**: Read `ARCHITECTURE.md`
- **Examples**: Run `malikclaw run --help`

## Security Notes

✅ API keys stored in config.json (don't commit!)
✅ Tool execution sandboxed
✅ Learning store validated
✅ No external network calls except to providers
✅ Session data persisted locally

## Performance Benchmarks

Typical execution times:
- Simple tasks: 1-2 seconds
- Complex analysis: 5-15 seconds
- Multi-step plans: 10-30 seconds

Token usage:
- Simple: 200-500 tokens
- Complex: 1000-3000 tokens
- With learning: +10% overhead

## Summary

You now have a fully integrated AI agent system with:
✅ Intelligent task planning
✅ Tool execution with safety
✅ Self-evaluating results
✅ Progressive learning
✅ Performance tracking
✅ Easy CLI interface

Start with: `./bin/malikclaw.exe run "Your task here"`
