# Providers & Model Configuration 🧠

MalikClaw uses a **protocol-first** model abstraction layer (`pkg/providers`). This allows seamless integration across dozens of cloud and local LLM providers using a unified configuration structure.

---

## 📋 The `model_list` Configuration System

All models are declared inside the `model_list` array within `~/.malikclaw/config.json`. Each entry maps a friendly alias (`model_name`) to a specific model protocol and provider credential.

### Core Configuration Schema
| Field | Type | Description |
|-------|------|-------------|
| `model_name` | String | Unique friendly identifier used across agents (e.g. `gpt-4o`, `claude-3-5-sonnet`). |
| `model` | String | Protocol prefix and remote model ID (e.g. `openai/gpt-4o`, `antigravity/gemini-2.0-flash`). |
| `api_key` | String | API key or token credential for the designated provider. |
| `api_base` | String | (Optional) Custom endpoint base URL (e.g. local Ollama or OpenAI reverse proxy). |
| `auth_method` | String | (Optional) Set to `oauth` or `token` for session-based authentication. |

---

## 🌐 Supported Model Protocols & Drivers

MalikClaw provides native drivers for major AI providers and generic OpenAI-compatible APIs:

| Protocol Prefix | Target Provider | Base URL / Driver |
|-----------------|-----------------|-------------------|
| `openai/` | OpenAI | `https://api.openai.com/v1` |
| `anthropic/` | Anthropic (SDK) | `https://api.anthropic.com/v1` |
| `anthropic-messages/` | Anthropic (Native Messages API) | `https://api.anthropic.com` |
| `gemini/` | Google Gemini API | `https://generativelanguage.googleapis.com/v1beta` |
| `antigravity/` | Google Cloud Code Assist / AGY | Internal OAuth Client |
| `groq/` | Groq LPU Inference | `https://api.groq.com/openai/v1` |
| `deepseek/` | DeepSeek API | `https://api.deepseek.com/v1` |
| `openrouter/` | OpenRouter Unified API | `https://openrouter.ai/api/v1` |
| `ollama/` | Ollama (Local Models) | `http://localhost:11434/v1` |
| `zhipu/` | Zhipu AI (GLM-4) | `https://open.bigmodel.cn/api/paas/v4` |
| `modelscope/` | ModelScope Inference | `https://api-inference.modelscope.cn/v1` |

---

## 🦅 Antigravity (Google Cloud Code Assist)

Antigravity provides direct access to Google Cloud's AI models (including Gemini 2.0 Flash / Pro) via OAuth credentials:

```json
{
  "model_name": "gemini-flash",
  "model": "antigravity/gemini-2.0-flash",
  "auth_method": "oauth"
}
```
> **Authentication**: Authenticate by running:
> ```bash
> malikclaw auth login --provider google-antigravity
> ```

---

## ⚡ High Availability & Model Fallback Chains

MalikClaw automatically fails over to backup models if a primary provider experiences downtime, rate limits, or context window limits:

```json
{
  "agents": {
    "defaults": {
      "model": "primary-gpt-4o",
      "fallbacks": ["secondary-claude-sonnet", "local-ollama-deepseek"]
    }
  }
}
```

---

## 🤖 GitHub Copilot Integration

Hook directly into an active GitHub Copilot subscription without extra API keys:

```json
{
  "model_name": "copilot-gpt4",
  "model": "github-copilot/gpt-4o",
  "connect_mode": "stdio",
  "api_base": "copilot"
}
```

---

## 🛠️ Advanced Model Settings

- **`thinking_level`**: Controls Anthropic reasoning depth (`low`, `medium`, `high`).
- **`max_tokens_field`**: Custom override for token limits (e.g. `max_completion_tokens`).
- **`request_timeout`**: Timeout in seconds before triggering fallback models (default: 60s).

