# MalikClaw Architecture Guide 🦞

🦅 **MalikClaw** is an ultra-lightweight personal AI Assistant built in Go, designed for efficiency, performance, and self-evolution on low-cost hardware.

---

## 🏗️ System Overview

The MalikClaw architecture is built around three core layers that work together to provide a seamless, agentic experience with a minimal footprint.

### 1. The Gateway (pkg/channels)
The Gateway is a unified multi-channel messaging hub. It translates platform-specific protocols (Telegram, Discord, WhatsApp, etc.) into a canonical internal message format.
- **Unified Registry**: All channels are registered in a central registry for easy management.
- **Protocol Adapters**: Each channel has its own adapter to handle platform-specific message structures, media, and formatting.
- **Shared Webhook Server**: All HTTP-based webhooks are served on a single, shared server to minimize resource usage.

### 2. The Agent Loop (pkg/agent)
The core "brain" of MalikClaw. It manages the conversation flow, context building, and tool execution.
- **Context Builder**: Intelligently constructs the system prompt by combining personality files (`SOUL.md`, `IDENTITY.md`, etc.), memory, and dynamic context (time, session).
- **Message Bus**: A high-performance, buffered message bus for inbound/outbound communication.
- **Tool Registry**: Dynamically manages available tools and handles sandboxed execution.
- **Self-Evolution (Guardian)**: A specialized engine that allows the agent to analyze, improve, and apply patches to its own source code.

### 3. The Provider Layer (pkg/providers)
A protocol-based abstraction layer for interacting with LLMs.
- **Model-Centric Routing**: Uses `model_list` to decouple agents from specific providers.
- **Protocol Families**: Supports OpenAI-compatible, Anthropic-native, and other custom protocols via a unified factory.
- **Fault Tolerance**: Implements automatic failover and cooldown logic for high availability.

---

## 🛡️ Security Model

MalikClaw is designed with a **Sandboxed Execution Policy** by default:
- **Workspace Restriction**: Tools (file I/O, shell exec) are restricted to the configured workspace directory.
- **Dangerous Pattern Guard**: A built-in safety layer blocks destructive shell commands (e.g., `rm -rf /`).
- **Unified Policy**: Security boundaries are enforced consistently across the main agent, subagents, and heartbeat tasks.

---

## 🧠 Memory & Personality

Inspired by `nanobot` and `PicoClaw`, MalikClaw uses Markdown-based "Personality Files" located in the workspace:
- **SOUL.md**: Defines the core values, tone, and character of the agent.
- **IDENTITY.md**: Defines the agent's name, purpose, and capabilities.
- **USER.md**: Stores user preferences and personal information to maintain long-term context.
- **MEMORY.md**: A persistent, long-term memory file managed by the agent itself.

---

## ⚡ Performance Optimization

MalikClaw is engineered for the "10MB/1s/10$" challenge:
- **Go implementation**: Compiled binaries with zero external dependencies for fast startup and low RAM usage.
- **Efficient Context Caching**: Minimizes redundant processing by caching static system prompt parts.
- **Binary Footprint**: Optional feature flags (tags) allow for building ultra-slim binaries for embedded systems.

---

## 🌍 Community Focus

MalikClaw is built with a **Urdu-First Strategy**, providing native RTL support and bilingual onboarding, specifically optimized for South Asian developers and edge hardware enthusiasts.

آگے بڑھو، ملک کلاؤ! (Go ahead, MalikClaw!)
