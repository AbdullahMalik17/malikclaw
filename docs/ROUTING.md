# Smart Model Routing 🧭

> **Version:** v2.0.0 · **Package:** `pkg/routing/cost_router.go` · **Config:** `agents.defaults.routing`

MalikClaw **v2.0.0** ships a deterministic, complexity-aware **3-tier cost router**. Instead of sending every message to your most expensive frontier model, each turn is scored and dispatched to the cheapest tier that can plausibly handle it — `fast` ➔ `balanced` ➔ `reasoning` — with an automatic per-tier fallback chain.

No keyword heuristics are required for the language of your prompt, no extra API call is made to classify, and no data leaves your machine to route.

---

## 🚀 1. Enabling The Router

Routing is **opt-in and off by default**. Add a `routing` block to an agent in `~/.malikclaw/config.json`:

```json
{
  "agents": {
    "defaults": {
      "routing": {
        "enabled": true,
        "mode": "smart",
        "fast_model": "gemini-2.5-flash",
        "balanced_model": "claude-sonnet-4",
        "reasoning_model": "claude-opus-4"
      }
    }
  }
}
```

Set `enabled: false` (or delete the block) to route every turn to the agent's primary `model_name`.

> ⚠️ **Configuration file only.** Unlike most MalikClaw settings, the `routing` block has **no environment variable overrides** — there is no `MALIKCLAW_AGENTS_DEFAULTS_ROUTING_*`. Edit the file printed by `malikclaw config path`, and confirm the result with `malikclaw config show`.

---

## 📚 2. The Three Tiers

| Tier | Targets | Typical Work | Default Primary | Default Fallbacks |
| :--- | :--- | :--- | :--- | :--- |
| `fast` | Local or ultra-low-cost models | Greetings, classification, reminders, status checks, short Q&A | `gemini-2.5-flash` | `ollama/qwen2.5:7b`, `gpt-4o-mini` |
| `balanced` | Mid-tier models | Everyday multi-tool workflows, web research, drafting, routine code edits | `claude-sonnet-4` | `gpt-4.1`, `gemini-2.5-pro` |
| `reasoning` | Frontier reasoning models | Architecture planning, complex debugging, security audits, multi-step decomposition | `claude-opus-4` | `o3`, `gemini-2.5-pro` |

The default fallback chain appended to **every** tier is `gemini-2.5-flash` ➔ `ollama/qwen2.5:7b`.

Reported savings vs. always using a frontier model: **~85%** on `fast`, **~50%** on `balanced`, **0%** on `reasoning`. These are the router's own static estimates, not measured billing.

---

## 🧮 3. How A Turn Is Classified

`ClassifyAndRoute(prompt, activeToolCount)` builds a complexity score in `[0, 1]` from five structural signals:

- **Reasoning keywords** — `architecture`, `system design`, `threat model`, `vulnerability`, `ssrf`, `race condition`, `root cause`, `postmortem`, `migration plan`, `distributed`, `step-by-step plan`, … → `+0.65` (`+0.15` more when two or more match).
- **Workflow keywords** — `research`, `compare`, `draft`, `implement`, `code review`, `unit test`, `fix bug`, `integrate`, `report`, … → `+0.25`.
- **Active tool count** — `≥6` tools `+0.45`, `≥2` tools `+0.30`, `1` tool `+0.10`.
- **Prompt length** — estimated tokens (CJK characters count 1:1, other scripts ÷4) above `300` `+0.35`, above `80` `+0.15`.
- **Code blocks & attachments** — one fenced code block `+0.25`, two or more `+0.40`; an embedded `data:image/…` URI or a media file reference `+0.35`.

The score then maps to a tier:

```
reasoning  ➜  score ≥ 0.65, OR ≥2 reasoning keywords, OR 1 reasoning keyword
             combined with any code block / ≥3 tools / >120 tokens
balanced   ➜  score ≥ 0.25, OR ≥2 tools, OR exactly 1 code block, OR media attached
fast       ➜  everything else
```

Because a single reasoning keyword plus one code block is enough to reach `reasoning`, **short technical questions still escalate**. To keep more traffic on cheap models, raise the bar by pointing `reasoning_model` at a mid-tier model instead of tuning the score — the thresholds themselves are compiled in and are **not configurable**.

---

## 🔧 4. Full Configuration Reference

```json
{
  "agents": {
    "defaults": {
      "routing": {
        "enabled": true,
        "mode": "smart",
        "fast_model": "gemini-2.5-flash",
        "balanced_model": "claude-sonnet-4",
        "reasoning_model": "claude-opus-4",
        "tier_fallbacks": {
          "fast": ["ollama/qwen2.5:7b", "gpt-4o-mini"],
          "balanced": ["gpt-4.1"],
          "reasoning": ["o3", "gemini-2.5-pro"]
        },
        "default_fallback_order": ["gemini-2.5-flash", "ollama/qwen2.5:7b"]
      }
    }
  }
}
```

| Key | Type | Description |
| :--- | :--- | :--- |
| `enabled` | bool | Master switch. `false` routes everything to `model_name`. |
| `mode` | string | `"smart"` (3-tier router) or `"legacy"` (v1 single light-model router). |
| `fast_model` | string | Primary model for `TierFast`. |
| `balanced_model` | string | Primary model for `TierBalanced`. |
| `reasoning_model` | string | Primary model for `TierReasoning`. |
| `tier_fallbacks` | object | Per-tier ordered fallback list. Keys must be `fast`, `balanced`, or `reasoning`; unknown keys are ignored. |
| `default_fallback_order` | array | Appended (deduplicated) after each tier's own fallbacks. |
| `light_model` | string | **Legacy v1 only** — model used for low-complexity turns. |
| `threshold` | float | **Legacy v1 only** — complexity cut-off in `[0,1]`. |

Routing lives on `agents.defaults` only. Entries in `agents.list[]` have **no** `routing` key, so all agents share the same tier models, fallback chains, and thresholds.

### Smart vs. Legacy selection

The 3-tier router takes over when `mode` is `smart` **or** when any of `fast_model`, `balanced_model`, `reasoning_model`, `tier_fallbacks`, `default_fallback_order` is set **or** `light_model` is empty. Only an explicit `mode: "legacy"` **with** a non-empty `light_model` keeps you on the v1 single-threshold router. An empty tier falls back to the compiled default for that tier, so a partially filled config still routes across all three.

---

## 🔄 5. Runtime Behaviour & Fallbacks

1. On each **conversation turn**, `AgentLoop.selectCandidates` asks the router for a tier, using the count of tools currently registered on the agent as `toolCount`.
2. The chosen model plus its fallback chain is resolved against your configured providers (the same `model_list` resolution used everywhere else), then your agent's own primary candidates are appended as a last resort.
3. The tier is **held for the whole turn** — tool follow-up iterations reuse the same model, so a multi-step tool chain never switches providers mid-flight.
4. Failures on the primary (`429`, `5xx`, timeouts) fall through the chain in order.

**Every model you name must be resolvable by your configured providers.** An unresolvable `fast_model` is silently dropped from the candidate list, which can push a "cheap" tier straight onto the next entry — or onto the agent's default model.

Each decision is logged at `INFO` under the `agent` component as `SmartCostRouter decision` with `tier`, `model`, `complexity_score`, `estimated_savings`, and a plain-language `rationale`. Run `malikclaw agent --debug` or `malikclaw gateway --debug` to audit routing before trusting it.

---

## 🧪 6. Local-First Example

Route the `fast` tier to a local Ollama server and keep only genuinely hard turns in the cloud:

```json
{
  "agents": {
    "defaults": {
      "routing": {
        "enabled": true,
        "mode": "smart",
        "fast_model": "ollama/qwen2.5:7b",
        "balanced_model": "gemini-2.5-flash",
        "reasoning_model": "claude-opus-4",
        "tier_fallbacks": {
          "fast": ["gemini-2.5-flash"],
          "reasoning": ["claude-sonnet-4"]
        }
      }
    }
  }
}
```

> 🔒 Local loopback model servers are a network-boundary exception. Provider base URLs are **not** passed through the SSRF firewall, but every other outbound path (web tools, MCP servers, skill registries, media downloads) is — see `SECURITY.md` for the `allow_localhost` opt-ins.

---

## ⚠️ 7. Limits

- **Keyword and structure based.** The classifier reads your prompt's shape, not its semantics. A one-line "what's the capital of France?" lands on `fast`; a paste of an architecture review template lands on `reasoning` even if the task is trivial.
- **Savings are estimates.** `estimated_savings` is a fixed label per tier, not a live price calculation.
- **Fallback ≠ failover budget.** A badly configured chain can retry down through several paid providers on one turn.
- **One tier per turn.** A turn that starts simple and grows complicated mid-flight stays on its starting tier.
