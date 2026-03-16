# ADR 1: Integration of Self-Evolution Engine (Guardian)

## Status
Proposed

## Context
The project `malikclaw` (forked from `nanobot`) aims to be a highly efficient AI assistant for low-resource hardware. A key feature of advanced autonomous agents (like those in `Digital-FTE`) is the ability to self-correct and improve their own source code.

## Decision
We have integrated a "Self-Evolution Engine" called **Guardian**. 
- It provides a `self_improve` tool.
- It allows the agent to analyze its own repository at `E:\WEB DEVELOPMENT\malikclaw`.
- It uses the LLM to propose and apply patches directly to the source code.

## Rationale
- **Autonomy**: Enhances the agent's ability to operate without human intervention for small bug fixes or optimizations.
- **Portability**: By implementing it as a Go tool rather than an external Python script, we maintain the project's single-binary focus.

## Consequences
- **Security**: The agent has write access to its own source code. This is mitigated by `restrict_to_workspace` settings, but users should be aware of the risk.
- **Complexity**: Adds more responsibility to the core agent loop.
