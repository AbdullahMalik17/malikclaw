---
name: open-research
description: "Autonomous web research and content extraction. Best for deep dives into topics, news, and technical documentation."
metadata: {"malikclaw":{"emoji":"🔎","requires":{"tools":["web_search","web_fetch"]}}}
---

# Open Research 🦅

This skill enables **autonomous research** by combining search and fetching. Use this to go beyond simple queries—act as an investigator.

## When to use (trigger phrases)

Use this skill when the user asks for:
- "Research the latest on [Topic]"
- "Find the documentation for [Library] and summarize it"
- "Look up the specs for [Hardware] and compare it with [Hardware]"
- "Investigate [Event/News] and give me a detailed report"

## Core Workflow

1. **Search**: Use `web_search` to find relevant links.
2. **Fetch**: Use `web_fetch` to extract content from the most promising URLs.
3. **Synthesize**: Combine the extracted information into a high-signal report.

## Examples

### Deep Dive into a Project
```bash
# First find the repo/docs
web_search "MalikClaw GitHub repository"

# Then fetch the README or ARCHITECTURE
web_fetch "https://github.com/AbdullahMalik17/malikclaw/blob/main/README.md"
```

### Technical Comparison
```bash
# Search for specs
web_search "Raspberry Pi 5 vs Orange Pi 5 specs"

# Fetch detailed benchmarks
web_fetch "https://example-benchmark-site.com/pi5-vs-opi5"
```

## Proactive Investigation
If a search result seems incomplete, **don't stop**. Follow the links. If a site is blocked, try another source.

## Best Practices
- **Parallel Fetching**: Fetch multiple URLs if the information is spread across sites.
- **Context Management**: Be selective with what you fetch to keep the context window lean and efficient (the "MalikClaw Way").
- **Citations**: Always cite your sources with `[Source Name](URL)`.
