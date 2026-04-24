package routing

import "github.com/AbdullahMalik17/malikclaw/pkg/agent"

var DefaultProfiles = []*agent.ProviderProfile{
	{
		ProviderID:   "antigravity",
		Tier:         "ceo",
		Capabilities: []string{"browser", "vision", "frontend"},
		MaxContext:   200000,
		CostFactor:   1.0,
	},
	{
		ProviderID:   "qwen",
		Tier:         "specialist",
		Capabilities: []string{"deep_reasoning", "logic", "repo-scale"},
		MaxContext:   1000000,
		CostFactor:   0.5,
	},
	{
		ProviderID:   "codex",
		Tier:         "specialist",
		Capabilities: []string{"background_automation", "enterprise"},
		MaxContext:   128000,
		CostFactor:   0.8,
	},
	{
		ProviderID:   "gemini",
		Tier:         "lightweight",
		Capabilities: []string{"fast_exec", "mcp-tool"},
		MaxContext:   1000000,
		CostFactor:   0.2,
	},
}
