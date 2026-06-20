# MalikClaw Project Information

## Purpose
MalikClaw is an ultra-efficient personal AI assistant designed for high performance on low-power hardware (SBCs, old phones).
* **Efficiency:** <10MB RAM, <1s boot time.
* **Cost:** Designed to run on $10 hardware (e.g., Orange Pi Zero).
* **Architecture:** Advanced agentic loop (PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE).

## Tech Stack
* **Language:** Go (1.25+)
* **Frontend:** Vanilla CSS (primary), React/TypeScript (web console).
* **Mobile:** ADB integration for Android control.
* **Integrations:** Gmail, Calendar, MCP (Model Context Protocol), Telegram, Discord, WhatsApp, etc.

## Core Codebase Structure
* `cmd/malikclaw/`: Main CLI entry point.
* `pkg/agent/`: Core agent loop logic (planner, executor, observer, reflector).
* `pkg/providers/`: LLM provider integrations (OpenAI, Anthropic, OpenRouter, etc.).
* `pkg/channels/`: Messaging platform integrations (Telegram, Discord, etc.).
* `pkg/tools/`: Built-in tools (web search, shell, file, ADB, Gmail).
* `web/`: Web UI (frontend/backend).
* `workspace/`: User-specific data (agents, skills, memory).
