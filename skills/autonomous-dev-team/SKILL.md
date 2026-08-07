---
name: autonomous-dev-team
description: Multi-agent team execution with DAG task scheduling, specialized roles, and consensus synthesis.
version: 2.0.0
author: AbdullahMalik17
tags: [multi-agent, swarm, dag, orchestration, team]
---

# 🤖 Autonomous Multi-Agent Team Skill

Use this skill when decomposing complex software goals into parallel, role-based workflows using MalikClaw's supervisor DAG engine.

## Roles & Capabilities

- **Architect (`architect`)**: Decomposes high-level goals into modular DAG tasks (`DependsOn`).
- **Researcher (`researcher`)**: Gathers specs, API docs, web content, and context.
- **Engineer (`engineer`)**: Implements code, refactors functions, and writes unit tests.
- **QA & Auditor (`qa`)**: Runs lints, performs security checks, and audits edge cases.
- **Communicator (`communicator`)**: Formats technical summaries and user release notes.

## Execution Flow

1. Call `team_run` with the high-level goal:
```json
{
  "goal": "Build a secure OAuth 2.0 PKCE authentication module in Go"
}
```
2. The orchestrator generates subtasks with explicit dependencies and executes ready tasks concurrently.
3. Outputs are aggregated into a unified multi-agent consensus report.
