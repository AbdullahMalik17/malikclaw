package routing

import (
	"fmt"
	"strings"
)

// Tier represents a cost/latency/capability tier for multi-model routing.
type Tier string

const (
	// TierFast targets local or ultra-low-cost models (Ollama, Gemini Flash, Haiku, mini)
	// for greetings, classification, reminders, status checks, and short Q&A.
	TierFast Tier = "fast"

	// TierBalanced targets mid-tier models for everyday multi-tool workflows,
	// web research, drafting, and routine code edits.
	TierBalanced Tier = "balanced"

	// TierReasoning targets frontier reasoning models for architecture planning,
	// complex debugging, security audits, and multi-step decomposition.
	TierReasoning Tier = "reasoning"
)

// CostRouteDecision describes the selected tier, primary model, ordered fallbacks,
// estimated cost savings, and human-readable rationale.
type CostRouteDecision struct {
	Tier             Tier     `json:"tier"`
	Model            string   `json:"model"`
	Fallbacks        []string `json:"fallbacks,omitempty"`
	EstimatedSavings string   `json:"estimated_savings"`
	SavingsPercent   int      `json:"savings_percent"`
	ComplexityScore  float64  `json:"complexity_score"`
	Rationale        string   `json:"rationale"`
}

// CostRouterConfig configures primary models and fallback order per tier.
type CostRouterConfig struct {
	// Models maps each Tier to its preferred primary model identifier.
	Models map[Tier]string

	// Fallbacks maps each Tier to ordered fallback models tried on HTTP 429/5xx/timeout.
	Fallbacks map[Tier][]string

	// DefaultFallbackOrder is appended (deduplicated) after tier-specific fallbacks.
	DefaultFallbackOrder []string
}

// DefaultCostRouterConfig returns sensible late-2026 defaults across local/fast,
// balanced, and frontier reasoning tiers.
func DefaultCostRouterConfig() CostRouterConfig {
	return CostRouterConfig{
		Models: map[Tier]string{
			TierFast:      "gemini-2.5-flash",
			TierBalanced:  "claude-sonnet-4",
			TierReasoning: "claude-opus-4",
		},
		Fallbacks: map[Tier][]string{
			TierFast:      {"ollama/qwen2.5:7b", "gpt-4o-mini"},
			TierBalanced:  {"gpt-4.1", "gemini-2.5-pro"},
			TierReasoning: {"o3", "gemini-2.5-pro"},
		},
		DefaultFallbackOrder: []string{
			"gemini-2.5-flash",
			"ollama/qwen2.5:7b",
		},
	}
}

// SmartCostRouter performs deterministic complexity-aware routing across
// fast, balanced, and reasoning tiers to cut API spend without sacrificing quality.
// It is safe for concurrent use.
type SmartCostRouter struct {
	models               map[Tier]string
	fallbacks            map[Tier][]string
	defaultFallbackOrder []string
}

// NewSmartCostRouter creates a SmartCostRouter using cfg, filling any missing
// tier models with defaults from DefaultCostRouterConfig.
func NewSmartCostRouter(cfg CostRouterConfig) *SmartCostRouter {
	defaults := DefaultCostRouterConfig()

	models := make(map[Tier]string, 3)
	for tier, defModel := range defaults.Models {
		if m := strings.TrimSpace(cfg.Models[tier]); m != "" {
			models[tier] = m
		} else {
			models[tier] = defModel
		}
	}

	fallbacks := make(map[Tier][]string, 3)
	for _, tier := range []Tier{TierFast, TierBalanced, TierReasoning} {
		if custom, ok := cfg.Fallbacks[tier]; ok {
			fallbacks[tier] = copyNonEmpty(custom)
		} else {
			fallbacks[tier] = copyNonEmpty(defaults.Fallbacks[tier])
		}
	}

	defaultOrder := copyNonEmpty(cfg.DefaultFallbackOrder)
	if len(defaultOrder) == 0 && cfg.DefaultFallbackOrder == nil {
		defaultOrder = copyNonEmpty(defaults.DefaultFallbackOrder)
	}

	return &SmartCostRouter{
		models:               models,
		fallbacks:            fallbacks,
		defaultFallbackOrder: defaultOrder,
	}
}

var (
	reasoningKeywords = []string{
		"architecture", "architectural", "system design", "trade-off", "tradeoff",
		"security audit", "threat model", "vulnerability", "ssrf", "injection",
		"race condition", "deadlock", "memory leak", "root cause", "postmortem",
		"debug", "stack trace", "refactor the entire", "migration plan",
		"distributed", "consensus", "dag", "decompose", "multi-step plan",
		"step-by-step plan", "optimize performance", "complexity analysis",
	}

	balancedKeywords = []string{
		"research", "compare", "draft", "write a", "summarize this document",
		"implement", "code review", "unit test", "fix bug", "update",
		"create a script", "analyze", "report", "workflow", "integrate",
	}
)

// ClassifyAndRoute classifies a prompt and active tool count into TierFast,
// TierBalanced, or TierReasoning, returning the selected model, fallback chain,
// estimated cost savings, and routing rationale.
func (r *SmartCostRouter) ClassifyAndRoute(prompt string, toolCount int) CostRouteDecision {
	if toolCount < 0 {
		toolCount = 0
	}

	trimmed := strings.TrimSpace(prompt)
	lower := strings.ToLower(trimmed)
	tokens := estimateTokens(trimmed)
	codeBlocks := countCodeBlocks(trimmed)
	hasMedia := hasAttachments(trimmed)

	reasoningHits := countKeywordMatches(lower, reasoningKeywords)
	balancedHits := countKeywordMatches(lower, balancedKeywords)

	var score float64
	var reasons []string

	if reasoningHits > 0 {
		score += 0.65
		if reasoningHits >= 2 {
			score += 0.15
		}
		reasons = append(reasons, fmt.Sprintf("reasoning signals (%d)", reasoningHits))
	}

	if balancedHits > 0 {
		score += 0.25
		reasons = append(reasons, fmt.Sprintf("workflow signals (%d)", balancedHits))
	}

	switch {
	case toolCount >= 6:
		score += 0.45
		reasons = append(reasons, fmt.Sprintf("heavy multi-tool orchestration (%d tools)", toolCount))
	case toolCount >= 2:
		score += 0.30
		reasons = append(reasons, fmt.Sprintf("multi-tool workflow (%d tools)", toolCount))
	case toolCount == 1:
		score += 0.10
		reasons = append(reasons, "single tool call")
	}

	switch {
	case tokens > 300:
		score += 0.35
		reasons = append(reasons, fmt.Sprintf("long prompt (~%d tokens)", tokens))
	case tokens > 80:
		score += 0.15
		reasons = append(reasons, fmt.Sprintf("medium prompt (~%d tokens)", tokens))
	}

	switch {
	case codeBlocks >= 2:
		score += 0.40
		reasons = append(reasons, fmt.Sprintf("%d code blocks", codeBlocks))
	case codeBlocks == 1:
		score += 0.25
		reasons = append(reasons, "code block present")
	}

	if hasMedia {
		score += 0.35
		reasons = append(reasons, "media attachment present")
	}

	if score > 1.0 {
		score = 1.0
	}

	var tier Tier
	switch {
	case score >= 0.65 || reasoningHits >= 2 || (reasoningHits >= 1 && (codeBlocks > 0 || toolCount >= 3 || tokens > 120)):
		tier = TierReasoning
	case score >= 0.25 || toolCount >= 2 || codeBlocks == 1 || hasMedia:
		tier = TierBalanced
	default:
		tier = TierFast
	}

	rationale := "simple everyday query routed to fast/low-cost tier"
	if len(reasons) > 0 {
		rationale = fmt.Sprintf("routed to %s tier: %s", tier, strings.Join(reasons, ", "))
	}

	savingsLabel, savingsPct := estimatedSavingsForTier(tier)
	model := r.models[tier]

	return CostRouteDecision{
		Tier:             tier,
		Model:            model,
		Fallbacks:        r.FallbackModels(tier),
		EstimatedSavings: savingsLabel,
		SavingsPercent:   savingsPct,
		ComplexityScore:  score,
		Rationale:        rationale,
	}
}

// FallbackModels returns the deduplicated fallback model chain for tier,
// excluding the tier's primary model.
func (r *SmartCostRouter) FallbackModels(tier Tier) []string {
	primary := r.models[tier]
	seen := map[string]struct{}{}
	if primary != "" {
		seen[primary] = struct{}{}
	}

	var out []string
	appendUnique := func(list []string) {
		for _, m := range list {
			if m == "" {
				continue
			}
			if _, exists := seen[m]; exists {
				continue
			}
			seen[m] = struct{}{}
			out = append(out, m)
		}
	}

	appendUnique(r.fallbacks[tier])
	appendUnique(r.defaultFallbackOrder)
	return out
}

func estimatedSavingsForTier(tier Tier) (string, int) {
	switch tier {
	case TierFast:
		return "~85% vs frontier", 85
	case TierBalanced:
		return "~50% vs frontier", 50
	case TierReasoning:
		return "0% (frontier reasoning)", 0
	default:
		return "0%", 0
	}
}

func countKeywordMatches(lower string, keywords []string) int {
	hits := 0
	for _, kw := range keywords {
		if strings.Contains(lower, kw) {
			hits++
		}
	}
	return hits
}

func copyNonEmpty(in []string) []string {
	out := make([]string, 0, len(in))
	for _, s := range in {
		if trimmed := strings.TrimSpace(s); trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}
