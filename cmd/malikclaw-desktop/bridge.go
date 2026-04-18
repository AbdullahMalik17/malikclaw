package main

import (
	"context"
	"sync/atomic"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

type Bridge struct {
	ctx          context.Context
	agentLoop    *agent.AgentLoop
	bus          *bus.MessageBus
	config       *config.Config
	tps          atomic.Pointer[float64]
}

func NewBridge() *Bridge {
	return &Bridge{}
}

func (b *Bridge) startup(ctx context.Context) {
	b.ctx = ctx
}

type Metrics struct {
	PromptTokens     int64   `json:"promptTokens"`
	CompletionTokens int64   `json:"completionTokens"`
	TPS              float64 `json:"tps"`
}

func (b *Bridge) GetMetrics() Metrics {
	if b.agentLoop == nil {
		return Metrics{}
	}

	comp := b.agentLoop.GetCompletionTokens()
	dur := b.agentLoop.GetLastDuration()

	tps := 0.0
	if dur > 0 {
		tps = float64(comp) / (float64(dur) / float64(time.Second))
	}

	return Metrics{
		PromptTokens:     b.agentLoop.GetPromptTokens(),
		CompletionTokens: comp,
		TPS:              tps,
	}
}

func (b *Bridge) StartWhatsApp() error {
	// Implementation will link to WhatsApp channel start with QR callback
	return nil
}
