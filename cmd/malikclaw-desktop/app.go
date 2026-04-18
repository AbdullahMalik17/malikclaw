package main

import (
	"context"
	"fmt"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx    context.Context
	bridge *Bridge
}

func NewApp(bridge *Bridge) *App {
	return &App{
		bridge: bridge,
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	go a.emitMetricsLoop()
}

func (a *App) emitMetricsLoop() {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-a.ctx.Done():
			return
		case <-ticker.C:
			if a.bridge != nil {
				metrics := a.bridge.GetMetrics()
				runtime.EventsEmit(a.ctx, "metrics-update", metrics)
			}
		}
	}
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
