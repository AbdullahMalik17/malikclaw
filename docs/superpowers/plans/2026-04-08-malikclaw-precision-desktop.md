# MalikClaw Precision Desktop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform MalikClaw into a high-precision, unified desktop application using Wails v2, optimized for high-performance offline AI operations.

**Architecture:** Use Wails v2 to bridge a Go backend (managing the Agent Loop and local LLM providers) with a React frontend. Bindings will replace internal HTTP calls for better performance and security.

**Tech Stack:** Go 1.25+, Wails v2, React 19, Tailwind CSS, Ollama/vLLM (local providers).

---

### Task 1: Project Initialization & Wails Scaffold

**Files:**
- Create: `wails.json`
- Create: `cmd/malikclaw-desktop/main.go`
- Create: `cmd/malikclaw-desktop/app.go`
- Modify: `Makefile`

- [ ] **Step 1: Create `wails.json` configuration**

```json
{
  "$schema": "https://wails.io/schemas/config.v2.json",
  "name": "malikclaw",
  "outputfilename": "malikclaw-desktop",
  "frontend:dir": "web/frontend",
  "frontend:install": "pnpm install",
  "frontend:build": "pnpm build",
  "frontend:dev:watcher": "pnpm dev",
  "frontend:dev:serverUrl": "http://localhost:5173",
  "author": {
    "name": "Abdullah Malik",
    "email": "contact@malikclaw.ai"
  }
}
```

- [ ] **Step 2: Create the desktop entry point `cmd/malikclaw-desktop/main.go`**

```go
package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "MalikClaw Precision Desktop",
		Width:  1280,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
```

- [ ] **Step 3: Create `cmd/malikclaw-desktop/app.go` for lifecycle management**

```go
package main

import (
	"context"
	"fmt"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
```

- [ ] **Step 4: Update `Makefile` to include desktop build targets**

```makefile
desktop-dev:
	wails dev

desktop-build:
	wails build
```

- [ ] **Step 5: Commit scaffolding**

```bash
git add wails.json cmd/malikclaw-desktop/ Makefile
git commit -m "feat: scaffold wails desktop application"
```

---

### Task 2: Backend Bridge & API Bindings

**Files:**
- Create: `cmd/malikclaw-desktop/bridge.go`
- Modify: `web/backend/api/router.go`
- Modify: `cmd/malikclaw-desktop/main.go`

- [ ] **Step 1: Refactor `api.Handler` to be bindable**
Modify `web/backend/api/router.go` to expose underlying service methods that Wails can call directly.

- [ ] **Step 2: Implement `bridge.go` to wrap existing API logic for Wails**

```go
package main

import (
	"github.com/AbdullahMalik17/malikclaw/web/backend/api"
)

type Bridge struct {
	handler *api.Handler
}

func NewBridge(configPath string) *Bridge {
	return &Bridge{
		handler: api.NewHandler(configPath),
	}
}

func (b *Bridge) GetStatus() (interface{}, error) {
	// Wrap existing logic from b.handler.GetStatus
	return nil, nil 
}
```

- [ ] **Step 3: Update `main.go` to bind the Bridge**

```go
// In main.go
bridge := NewBridge(configPath)
// ... in options.App
Bind: []interface{}{
    app,
    bridge,
},
```

- [ ] **Step 4: Commit Bridge implementation**

```bash
git add cmd/malikclaw-desktop/bridge.go web/backend/api/router.go
git commit -m "feat: implement wails backend bridge for API"
```

---

### Task 3: Performance Monitor & Metrics

**Files:**
- Modify: `pkg/agent/instance.go`
- Modify: `cmd/malikclaw-desktop/app.go`
- Create: `web/frontend/src/components/desktop/PerformanceMonitor.tsx`

- [ ] **Step 1: Expose TPS and Resource metrics in `pkg/agent`**
Add fields for `TokensPerSecond`, `GPUMemoryUsed`, and `TotalTokens` to the Agent status struct.

- [ ] **Step 2: Create a background goroutine in `app.go` to emit performance events**

```go
func (a *App) startMetricsEmitter() {
	go func() {
		for {
			// Get metrics from agent
			// runtime.EventsEmit(a.ctx, "metrics-update", metrics)
			time.Sleep(500 * time.Millisecond)
		}
	}()
}
```

- [ ] **Step 3: Implement the `PerformanceMonitor` component in React**

```tsx
export const PerformanceMonitor = () => {
  // Listen for 'metrics-update' using Wails runtime
  return (
    <div className="p-4 bg-card rounded-lg border">
      <h4 className="text-xs font-bold uppercase">Real-time Performance</h4>
      <div className="text-2xl font-bold">12.4 TPS</div>
      {/* GPU/VRAM bars */}
    </div>
  );
};
```

- [ ] **Step 4: Commit Performance Monitor**

```bash
git add pkg/agent/instance.go cmd/malikclaw-desktop/app.go web/frontend/src/components/desktop/PerformanceMonitor.tsx
git commit -m "feat: add real-time performance monitoring to desktop"
```

---

### Task 4: Parameter Tuning & Native Polish

**Files:**
- Create: `web/frontend/src/components/desktop/ParameterTuning.tsx`
- Modify: `cmd/malikclaw-desktop/app.go`

- [ ] **Step 1: Implement `ParameterTuning` with native-feeling sliders**
Use Radix UI or shadcn/ui components to create precise sliders for Temperature, Top-P, and Top-K.

- [ ] **Step 2: Add System Tray support in `app.go`**

```go
import "github.com/getlantern/systray"

func (a *App) setupTray() {
	systray.Run(onReady, onExit)
}

func onReady() {
	systray.SetIcon(iconData)
	systray.SetTitle("MalikClaw")
	mOpen := systray.AddMenuItem("Open Dashboard", "Open the main window")
	mQuit := systray.AddMenuItem("Quit", "Quit the application")
    // Handle clicks
}
```

- [ ] **Step 3: Integrate everything into the main layout**
Add the `PerformanceMonitor` and `ParameterTuning` to a new `DesktopLayout` component.

- [ ] **Step 4: Commit final polish**

```bash
git add web/frontend/src/components/desktop/ParameterTuning.tsx cmd/malikclaw-desktop/app.go
git commit -m "feat: add parameter tuning and system tray support"
```
