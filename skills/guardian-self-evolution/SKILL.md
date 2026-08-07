---
name: guardian-self-evolution
description: Autonomous self-evolution engine for codebase self-healing, benchmark evaluation, and code optimization.
version: 2.0.0
author: AbdullahMalik17
tags: [evolution, self-healing, guardian, benchmark, refactoring]
---

# 🛡️ Guardian Self-Evolution Skill

Use this skill when auditing codebase health, fixing runtime errors autonomously, or running performance benchmarks.

## Workflow Phases

1. **Diagnosis**: Run `go test` and `golangci-lint` to gather failure traces.
2. **Patch Generation**: Formulate minimal diff patch addressing root cause.
3. **Sandbox Verification**: Apply patch, verify tests pass, ensure no memory regressions (<10MB ceiling).
4. **Learning Store Update**: Commit successful repair pattern to `LearningStore` for future zero-shot resolution.
