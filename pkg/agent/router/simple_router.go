package router

import (
	"context"
	"fmt"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

type SimpleRouter struct {
	candidates []providers.FallbackCandidate
}

func NewSimpleRouter(candidates []providers.FallbackCandidate) *SimpleRouter {
	return &SimpleRouter{candidates: candidates}
}

func (sr *SimpleRouter) Route(ctx context.Context, task string) (providers.FallbackCandidate, error) {
	if len(sr.candidates) == 0 {
		return providers.FallbackCandidate{}, fmt.Errorf("no candidates available for routing")
	}
	// Basic routing: return the primary candidate for all tasks.
	return sr.candidates[0], nil
}
