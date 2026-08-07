# Contributing to MalikClaw 🤝

Thank you for your interest in contributing to **MalikClaw**! MalikClaw is an open-source, community-driven project dedicated to building the world's most efficient, production-grade personal AI assistant engine.

We welcome all forms of contribution: bug fixes, new model providers, messaging channels, custom tools, performance optimizations, documentation improvements, and translations.

---

## 📜 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [How to Add a Custom LLM Provider](#how-to-add-a-custom-llm-provider)
- [How to Add a Custom Tool](#how-to-add-a-custom-tool)
- [How to Add a Custom Messaging Channel](#how-to-add-a-custom-messaging-channel)
- [AI-Assisted Contribution Policy](#ai-assisted-contribution-policy)
- [Pull Request Process & Reviewers](#pull-request-process--reviewers)

---

## Code of Conduct

We follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand our community standards.

---

## 🛠️ Development Setup

### Prerequisites
- **Go 1.21+** (Go 1.24 recommended)
- **Git**
- **Make** (optional, but recommended)

### Step 1: Fork & Clone Repository
```bash
git clone https://github.com/<your-username>/malikclaw.git
cd malikclaw
git remote add upstream https://github.com/AbdullahMalik17/malikclaw.git
```

### Step 2: Build & Run Local Tests
```bash
# Install dependencies
make deps

# Run code formatters and linters
make fmt
make lint

# Run all unit tests
make test

# Build local binary
make build
```

---

## 🔌 How to Add a Custom LLM Provider

All model providers implement the `providers.LLMProvider` interface in `pkg/providers/`:

```go
package myprovider

import (
	"context"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

type MyCustomProvider struct {
	apiKey string
	model  string
}

func NewMyCustomProvider(apiKey, model string) (*MyCustomProvider, error) {
	return &MyCustomProvider{apiKey: apiKey, model: model}, nil
}

func (p *MyCustomProvider) Completion(ctx context.Context, req *providers.CompletionRequest) (*providers.CompletionResponse, error) {
	// Implement model API call logic here
	return &providers.CompletionResponse{
		Content: "Hello from custom provider!",
	}, nil
}

func (p *MyCustomProvider) Name() string {
	return "myprovider"
}
```

Register your new provider in `pkg/providers/registry.go`.

---

## 🛠️ How to Add a Custom Tool

Tools are implemented under `pkg/tools/`:

```go
package tools

import (
	"context"
	"fmt"
)

type CustomTool struct{}

func NewCustomTool() *CustomTool {
	return &CustomTool{}
}

func (t *CustomTool) Name() string {
	return "custom_tool"
}

func (t *CustomTool) Description() string {
	return "Executes custom logic for MalikClaw agent"
}

func (t *CustomTool) Execute(ctx context.Context, params map[string]interface{}) (interface{}, error) {
	input, ok := params["input"].(string)
	if !ok {
		return nil, fmt.Errorf("missing string parameter 'input'")
	}
	return fmt.Sprintf("Processed input: %s", input), nil
}
```

Register your new tool in `pkg/tools/registry.go`.

---

## 💬 How to Add a Custom Messaging Channel

Channels implement event listening and publishing in `pkg/channels/`:

```go
package mychannel

import (
	"context"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
)

type MyChannelAdapter struct {
	bus *bus.MessageBus
}

func NewChannel(b *bus.MessageBus) *MyChannelAdapter {
	return &MyChannelAdapter{bus: b}
}

func (c *MyChannelAdapter) Start(ctx context.Context) error {
	// Listen to incoming platform webhooks/events and post to bus
	return nil
}

func (c *MyChannelAdapter) SendMessage(ctx context.Context, msg bus.OutboundMessage) error {
	// Deliver message to channel API
	return nil
}
```

---

## 🤖 AI-Assisted Contribution Policy

MalikClaw embraces AI-assisted coding. However, contributors remain 100% accountable for submitted code:
- **Disclose AI usage** in the Pull Request template (`Fully AI-generated`, `Mostly AI-generated`, or `Mostly Human-written`).
- **Understand & test** every line of code. PRs containing unverified hallucinated code or sandbox security escapes will be closed.
- **Pass all checks**: Ensure `make check` passes before opening a PR.

---

## 📬 Pull Request Process & Reviewers

1. Create a feature branch: `git checkout -b feat/my-new-feature`.
2. Commit changes using clear imperative messages (`feat: add custom provider`).
3. Rebase onto `upstream/main`: `git rebase upstream/main`.
4. Open a PR targeting `main` and complete the PR template.

### Reviewers List
| Area | Reviewer |
| :--- | :--- |
| **Providers** | `@yinwm` |
| **Channels** | `@yinwm`, `@alexhoshina` |
| **Agent Core & Loops** | `@lxowalle`, `@Zhaoyikaiii` |
| **Tools & Security** | `@lxowalle` |
| **CI / Infrastructure** | `@imguoguo` |
