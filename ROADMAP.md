# MalikClaw Project Roadmap 🦅

> **Vision**: Build the world's most efficient, production-grade, zero-dependency personal AI agent infrastructure. Run full autonomous AI agent workflows anywhere—from $10 edge hardware to high-throughput cloud clusters.

---

## 🎯 Strategic Roadmap Pillars

### 🚀 Pillar 1: Extreme Edge Footprint & Memory Optimization
- [x] **Sub-10MB Idle Footprint**: Achieved `<10MB` RAM usage in v1.0.0.
- [ ] **Ultra-Embedded Support (<20MB Target)**: Run full agentic cycles on 64MB RAM embedded boards (RISC-V, MIPS, low-tier IoT gateways).
- [ ] **Zero-Allocation Hot Paths**: Optimize Go memory pools to reduce GC pause times below 1ms.

### 🛡️ Pillar 2: Defense-in-Depth Security & Hardening
- [x] **Workspace Directory Jailing**: Restrict tool read/write access to `~/.malikclaw/workspace`.
- [x] **Shell Execution Regex Filter**: Intercept and reject privilege escalation and destructive commands.
- [ ] **Prompt Injection Defense Engine**: Structural JSON schema validation to neutralize jailbreaks and prompt manipulation.
- [ ] **SSRF & Network Boundary Firewall**: Built-in IP blocklists preventing agents from accessing internal cloud metadata endpoints (`169.254.169.254`).
- [ ] **ChaCha20-Poly1305 Encrypted Vault**: AES/ChaCha20 encrypted storage for API keys and sensitive tokens.

### 🔌 Pillar 3: Protocol-First Connectivity & Local Model Supremacy
- [x] **Multi-Provider Routing**: Native integration with OpenAI, Anthropic, Gemini, Antigravity, Ollama, DeepSeek, Groq, Zhipu, OpenRouter.
- [ ] **Ollama & vLLM Deep Optimization**: Streaming token optimization and local context window auto-resizing.
- [ ] **OneBot Protocol & Universal IM Standard**: Standardized integration for QQ, WeChat, Matrix, DingTalk, Feishu, and Signal.
- [ ] **Attachment & Multi-Modal Pipelines**: Native pipeline for image, audio transcript, and video frame input across all channels.

### 🧠 Pillar 4: Autonomous Multi-Agent Swarms & MCP
- [x] **Production 5-Stage Agent Loop**: Plan ➔ Act ➔ Observe ➔ Reflect ➔ Memory Update cycle.
- [x] **Model Context Protocol (MCP)**: Attach third-party MCP tool servers dynamically.
- [ ] **Smart Multi-Model Cost Router**: Automatically route simple subtasks to fast/cheap local models (Ollama/Llama 3.3) and complex reasoning to frontier models (Claude 3.7 / GPT-4o).
- [ ] **Peer-to-Peer Agent Swarms**: Decentralized communication between multiple local MalikClaw nodes across a mesh network.

### 🌐 Pillar 5: Developer Experience & Global Community
- [x] **One-Line Installers**: `install.sh` and `install.ps1` cross-platform scripts.
- [x] **Bento Grid Web UI & Dashboard**: Interactive status dashboard listening on port 18790.
- [ ] **Skill Marketplace & Plugin Registry**: Automated skill discovery (`malikclaw skills install <skill-name>`).
- [ ] **Multilingual Expansion**: Add localized interfaces for Arabic, Spanish, German, Hindi, and Bengali.

---

## 🤝 Call for Contributions

We welcome community feedback and PRs! If you'd like to work on any item listed in this roadmap:
1. Browse open issues on [GitHub Issues](https://github.com/AbdullahMalik17/malikclaw/issues).
2. Read the [Contributing Guide](CONTRIBUTING.md).
3. Join the community discussions!
