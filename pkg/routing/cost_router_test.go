package routing

import (
	"strings"
	"testing"
)

func TestSmartCostRouterClassifyAndRoute(t *testing.T) {
	router := NewSmartCostRouter(DefaultCostRouterConfig())

	tests := []struct {
		name           string
		prompt         string
		toolCount      int
		wantTier       Tier
		wantModel      string
		wantMinSavings int
	}{
		{
			name:           "simple greeting routes to fast",
			prompt:         "Hey, what's the weather like today?",
			toolCount:      0,
			wantTier:       TierFast,
			wantModel:      "gemini-2.5-flash",
			wantMinSavings: 80,
		},
		{
			name:           "simple reminder with single tool routes to fast",
			prompt:         "Remind me to buy milk at 6pm.",
			toolCount:      1,
			wantTier:       TierFast,
			wantModel:      "gemini-2.5-flash",
			wantMinSavings: 80,
		},
		{
			name:           "multi-tool everyday workflow routes to balanced",
			prompt:         "Check my calendar and draft an email reply for tomorrow's meeting.",
			toolCount:      3,
			wantTier:       TierBalanced,
			wantModel:      "claude-sonnet-4",
			wantMinSavings: 40,
		},
		{
			name:           "single code block edit routes to balanced",
			prompt:         "Please update this function:\n```go\nfunc add(a, b int) int { return a + b }\n```",
			toolCount:      0,
			wantTier:       TierBalanced,
			wantModel:      "claude-sonnet-4",
			wantMinSavings: 40,
		},
		{
			name:           "architecture planning routes to reasoning",
			prompt:         "Design the system architecture and trade-offs for a multi-tenant MCP gateway.",
			toolCount:      0,
			wantTier:       TierReasoning,
			wantModel:      "claude-opus-4",
			wantMinSavings: 0,
		},
		{
			name:           "security audit routes to reasoning",
			prompt:         "Perform a security audit of our SSRF and prompt injection defenses.",
			toolCount:      1,
			wantTier:       TierReasoning,
			wantModel:      "claude-opus-4",
			wantMinSavings: 0,
		},
		{
			name:           "complex debugging with stack trace routes to reasoning",
			prompt:         "Debug this deadlock and race condition in the worker pool.",
			toolCount:      2,
			wantTier:       TierReasoning,
			wantModel:      "claude-opus-4",
			wantMinSavings: 0,
		},
		{
			name:           "heavy multi-tool orchestration with long prompt routes to reasoning",
			prompt:         strings.Repeat("Analyze this workflow step and verify outputs. ", 40),
			toolCount:      6,
			wantTier:       TierReasoning,
			wantModel:      "claude-opus-4",
			wantMinSavings: 0,
		},
		{
			name:           "negative tool count normalized safely",
			prompt:         "Hello!",
			toolCount:      -5,
			wantTier:       TierFast,
			wantModel:      "gemini-2.5-flash",
			wantMinSavings: 80,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			decision := router.ClassifyAndRoute(tc.prompt, tc.toolCount)
			if decision.Tier != tc.wantTier {
				t.Errorf("Tier = %q, want %q (score=%.2f, rationale=%q)", decision.Tier, tc.wantTier, decision.ComplexityScore, decision.Rationale)
			}
			if decision.Model != tc.wantModel {
				t.Errorf("Model = %q, want %q", decision.Model, tc.wantModel)
			}
			if decision.SavingsPercent < tc.wantMinSavings {
				t.Errorf("SavingsPercent = %d, want >= %d", decision.SavingsPercent, tc.wantMinSavings)
			}
			if decision.EstimatedSavings == "" {
				t.Errorf("EstimatedSavings should not be empty")
			}
			if decision.Rationale == "" {
				t.Errorf("Rationale should not be empty")
			}
			if len(decision.Fallbacks) == 0 {
				t.Errorf("expected non-empty fallback list for tier %q", decision.Tier)
			}
			for _, fb := range decision.Fallbacks {
				if fb == decision.Model {
					t.Errorf("primary model %q must not appear in Fallbacks %v", decision.Model, decision.Fallbacks)
				}
			}
		})
	}
}

func TestSmartCostRouterCustomConfigAndFallbackOrder(t *testing.T) {
	cfg := CostRouterConfig{
		Models: map[Tier]string{
			TierFast:      "ollama/llama3.2:3b",
			TierBalanced:  "qwen-2.5-coder",
			TierReasoning: "deepseek-r1",
		},
		Fallbacks: map[Tier][]string{
			TierFast:      {"gemini-2.5-flash", "ollama/llama3.2:3b"}, // duplicate of primary should be removed
			TierBalanced:  {"claude-sonnet-4"},
			TierReasoning: {"claude-opus-4", "o3"},
		},
		DefaultFallbackOrder: []string{"gemini-2.5-flash", "gpt-4o-mini"},
	}

	r := NewSmartCostRouter(cfg)

	fast := r.ClassifyAndRoute("Hi there", 0)
	if fast.Model != "ollama/llama3.2:3b" {
		t.Fatalf("fast.Model = %q, want ollama/llama3.2:3b", fast.Model)
	}
	wantFastFB := []string{"gemini-2.5-flash", "gpt-4o-mini"}
	if len(fast.Fallbacks) != len(wantFastFB) {
		t.Fatalf("fast.Fallbacks = %v, want %v", fast.Fallbacks, wantFastFB)
	}
	for i := range wantFastFB {
		if fast.Fallbacks[i] != wantFastFB[i] {
			t.Errorf("fast.Fallbacks[%d] = %q, want %q", i, fast.Fallbacks[i], wantFastFB[i])
		}
	}

	reasoning := r.ClassifyAndRoute("Create a migration plan and threat model for the vault", 2)
	if reasoning.Tier != TierReasoning || reasoning.Model != "deepseek-r1" {
		t.Fatalf("got tier=%q model=%q, want reasoning/deepseek-r1", reasoning.Tier, reasoning.Model)
	}
	wantReasoningFB := []string{"claude-opus-4", "o3", "gemini-2.5-flash", "gpt-4o-mini"}
	if len(reasoning.Fallbacks) != len(wantReasoningFB) {
		t.Fatalf("reasoning.Fallbacks = %v, want %v", reasoning.Fallbacks, wantReasoningFB)
	}
	for i := range wantReasoningFB {
		if reasoning.Fallbacks[i] != wantReasoningFB[i] {
			t.Errorf("reasoning.Fallbacks[%d] = %q, want %q", i, reasoning.Fallbacks[i], wantReasoningFB[i])
		}
	}
}
