# Providers & Model Configuration 🧠

MalikClaw uses a **model-centric configuration** approach. This allows you to easily switch between providers (OpenAI, Anthropic, Zhipu, etc.) without changing your agent's code.

---

## 📋 The `model_list` Concept

The `model_list` is an array of model configurations in your `config.json`. Each entry defines a `model_name` (your own alias) and the underlying `model` (protocol and platform name).

### Example Configuration
```json
{
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-your-openai-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_key": "sk-ant-your-anthropic-key"
    },
    {
      "model_name": "deepseek-chat",
      "model": "openai/deepseek-chat",
      "api_base": "https://api.deepseek.com/v1",
      "api_key": "sk-your-deepseek-key"
    }
  ],
  "agents": {
    "defaults": {
      "model": "gpt-5.4"
    }
  }
}
```

---

## 🌐 Supported Protocols

MalikClaw identifies the provider protocol via a prefix in the `model` field:

| Prefix | Protocol | Description |
|--------|----------|-------------|
| `openai/` | OpenAI-compatible | Works with DeepSeek, Qwen, Groq, etc. |
| `anthropic/` | Anthropic-native | Claude series direct access |
| `gemini/` | Gemini-native | Google Gemini API (OpenAI-compat) |
| `ollama/` | Ollama-native | Local LLM access (OpenAI-compat) |

---

## ⚡ Fallback Logic

You can configure fallback models to ensure high availability. If the primary model fails, MalikClaw will automatically try the next one in the list.

```json
{
  "agents": {
    "defaults": {
      "model": "gpt-5.4",
      "fallbacks": ["claude-sonnet-4.6", "deepseek-chat"]
    }
  }
}
```

---

## 🏗️ Multi-Agent Support

Each agent can have its own primary and fallback models:

```json
{
  "agents": {
    "coder": {
      "model": "claude-sonnet-4.6"
    },
    "general": {
      "model": "gpt-5.4"
    }
  }
}
```

---

## 🚀 Migration from Legacy Config

If you are using the old `providers` format, MalikClaw will automatically detect it and suggest a migration. For a detailed guide, see the [Migration Guide](/docs/migration/model-list-migration).
