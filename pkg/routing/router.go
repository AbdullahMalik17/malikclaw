package routing

import (
	"context"
	"math"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

// defaultThreshold is used when the config threshold is zero or negative.
// At 0.35 a message needs at least one strong signal (code block, long text,
// or an attachment) before the heavy model is chosen.
const defaultThreshold = 0.35

// RouterConfig holds the validated model routing settings.
// It mirrors config.RoutingConfig but lives in pkg/routing to keep the
// dependency graph simple: pkg/agent resolves config → routing, not the reverse.
type RouterConfig struct {
	// LightModel is the model_name (from model_list) used for simple tasks.
	LightModel string

	// Threshold is the complexity score cutoff in [0, 1].
	// score >= Threshold → primary (heavy) model.
	// score <  Threshold → light model.
	Threshold float64
}

// Router selects the appropriate model tier for each incoming message.
// It is safe for concurrent use from multiple goroutines.
type Router struct {
	cfg        RouterConfig
	classifier Classifier
	profiles   []*agent.ProviderProfile
}

// New creates a Router with the given config and the default RuleClassifier.
// If cfg.Threshold is zero or negative, defaultThreshold (0.35) is used.
func New(cfg RouterConfig, profiles []*agent.ProviderProfile) *Router {
	if cfg.Threshold <= 0 {
		cfg.Threshold = defaultThreshold
	}
	return &Router{
		cfg:        cfg,
		classifier: &RuleClassifier{},
		profiles:   profiles,
	}
}

// Route evaluates the task string and history to return a matched provider profile.
func (r *Router) Route(ctx context.Context, task string, complexity float64, tags []string) (*agent.ProviderProfile, error) {
	var bestProfile *agent.ProviderProfile
	maxScore := -1.0

	for _, p := range r.profiles {
		score := r.calculateScore(p, complexity, tags)
		if score > maxScore {
			maxScore = score
			bestProfile = p
		}
	}
	return bestProfile, nil
}

func (r *Router) calculateScore(p *agent.ProviderProfile, complexity float64, tags []string) float64 {
	capMatch := 0.0
	for _, t := range tags {
		for _, c := range p.Capabilities {
			if t == c {
				capMatch += 1.0
			}
		}
	}

	compMatch := 1.0 - math.Abs(complexity-r.tierToComplexity(p.Tier))
	costEff := 1.0 - p.CostFactor

	return (capMatch * 0.5) + (compMatch * 0.3) + (costEff * 0.2)
}

func (r *Router) tierToComplexity(tier string) float64 {
	switch tier {
	case "ceo":
		return 0.9
	case "specialist":
		return 0.6
	case "lightweight":
		return 0.2
	default:
		return 0.5
	}
}
// newWithClassifier creates a Router with a custom Classifier.
// Intended for unit tests that need to inject a deterministic scorer.
func newWithClassifier(cfg RouterConfig, c Classifier, profiles []*agent.ProviderProfile) *Router {
	if cfg.Threshold <= 0 {
		cfg.Threshold = defaultThreshold
	}
	return &Router{cfg: cfg, classifier: c, profiles: profiles}
}
// SelectModel returns the model to use for this conversation turn along with
// the computed complexity score (for logging and debugging).
//
//   - If score < cfg.Threshold: returns (cfg.LightModel, true, score)
//   - Otherwise:               returns (primaryModel, false, score)
//
// The caller is responsible for resolving the returned model name into
// provider candidates (see AgentInstance.LightCandidates).
func (r *Router) SelectModel(
	msg string,
	history []providers.Message,
	primaryModel string,
) (model string, usedLight bool, score float64) {
	features := ExtractFeatures(msg, history)
	score = r.classifier.Score(features)
	if score < r.cfg.Threshold {
		return r.cfg.LightModel, true, score
	}
	return primaryModel, false, score
}

// LightModel returns the configured light model name.
func (r *Router) LightModel() string {
	return r.cfg.LightModel
}

// Threshold returns the complexity threshold in use.
func (r *Router) Threshold() float64 {
	return r.cfg.Threshold
}
