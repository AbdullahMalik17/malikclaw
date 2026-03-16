# Providers & Model Configuration 🧠

MalikClaw uses a **protocol-first** approach to model management. This allows you to integrate dozens of different LLM providers using a unified configuration format.

---

## 📋 The `model_list` System

All models are defined in the `model_list` array in your `config.json`. Each entry maps a friendly alias (`model_name`) to a specific protocol and provider.

### Core Configuration Fields
| Field | Description |
|-------|-------------|
| `model_name` | A unique alias you use to refer to this model. |
| `model` | The protocol/identifier (e.g., `openai/gpt-4o`). |
| `api_key` | Your API credential for that provider. |
| `api_base` | (Optional) The base URL for the API endpoint. |
| `auth_method` | (Optional) Set to `oauth` or `token` for session-based auth. |

---

## 🌐 Supported Protocols

MalikClaw supports a wide range of protocols. If a provider isn't listed, it usually works via the `openai/` protocol.

| Protocol Prefix | Target Provider | Typical API Base |
|-----------------|-----------------|------------------|
| `openai/` | OpenAI | `https://api.openai.com/v1` |
| `anthropic/` | Anthropic (SDK) | `https://api.anthropic.com/v1` |
| `anthropic-messages/` | Anthropic (Native) | `https://api.anthropic.com` |
| `gemini/` | Google Gemini | `https://generativelanguage.googleapis.com/v1beta` |
| `antigravity/` | Google Cloud Code Assist | (Managed internally) |
| `groq/` | Groq | `https://api.groq.com/openai/v1` |
| `deepseek/` | DeepSeek | `https://api.deepseek.com/v1` |
| `openrouter/` | OpenRouter | `https://openrouter.ai/api/v1` |
| `ollama/` | Ollama (Local) | `http://localhost:11434/v1` |
| `zhipu/` | Zhipu AI (GLM) | `https://open.bigmodel.cn/api/paas/v4` |
| `modelscope/` | ModelScope | `https://api-inference.modelscope.cn/v1` |

---

## 🦅 Antigravity (Google Cloud Code Assist)

Antigravity provides access to high-end models (including Claude 3.5 Opus) via Google's infrastructure. It requires a specific OAuth setup.

```json
{
  "model_name": "gemini-ultra",
  "model": "antigravity/gemini-2.0-flash",
  "auth_method": "oauth"
}
```
> **Setup**: Run `malikclaw auth login --provider google-antigravity` to authenticate.

---

## ⚡ High Availability & Fallbacks

MalikClaw can automatically switch to backup models if your primary provider is down or rate-limited.

```json
{
  "agents": {
    "defaults": {
      "model": "primary-gpt-4o",
      "fallbacks": ["secondary-claude-sonnet", "backup-deepseek"]
    }
  }
}
```

---

## 🤖 GitHub Copilot

MalikClaw can hook into an existing GitHub Copilot subscription.

### Connection Modes:
1.  **gRPC (Remote)**: Connects to a running Copilot CLI server.
2.  **stdio (Local)**: Spawns the `copilot` binary directly.

```json
{
  "model_name": "my-copilot",
  "model": "github-copilot/gpt-4o",
  "connect_mode": "stdio",
  "api_base": "copilot"
}
```

---

## 🛠️ Protocol-Specific Options

- **`thinking_level`**: For Claude models, set to `low`, `medium`, or `high`.
- **`max_tokens_field`**: Specify custom field names for token limits (e.g., `max_completion_tokens`).
- **`request_timeout`**: Integer seconds before timing out an LLM request.
