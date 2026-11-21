package agent

import (
	"path/filepath"
	"runtime"
	"testing"

	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/routing"
	"github.com/AbdullahMalik17/malikclaw/pkg/security"
	"github.com/AbdullahMalik17/malikclaw/pkg/skills"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

const maxCoreRuntimeHeapDeltaBytes = 10 * 1024 * 1024 // 10 MB

func initCoreRuntime(workspace string) any {
	_ = security.ScanPromptInjection("Assalam-o-Alaikum, check my morning briefing")
	_ = routing.NewSmartCostRouter(routing.CostRouterConfig{})

	loader := skills.NewSkillsLoader(workspace, filepath.Join(workspace, "global-skills"), "").
		WithUniversalDirs(filepath.Join(workspace, ".agents", "skills"), "")
	_ = loader.ListSkills()

	reg := tools.NewToolRegistry()
	reg.Register(tools.NewReadFileTool(workspace, true, 0, nil))
	reg.Register(tools.NewWriteFileTool(workspace, true, nil))
	reg.Register(tools.NewListDirTool(workspace, true, nil))
	reg.Register(tools.NewEditFileTool(workspace, true, nil))
	reg.Register(tools.NewAndroidControlToolWithRunner(workspace, nil, nil))

	cfg := &config.Config{
		Agents: config.AgentsConfig{
			Defaults: config.AgentDefaults{
				Workspace:         workspace,
				Provider:          "openai",
				ModelName:         "gpt-4o-mini",
				MaxTokens:         4096,
				MaxToolIterations: 10,
				Routing: &config.RoutingConfig{
					Enabled:        true,
					Mode:           "smart",
					FastModel:      "gemini-2.5-flash",
					BalancedModel:  "claude-sonnet-4",
					ReasoningModel: "claude-opus-4",
				},
			},
		},
		ModelList: []config.ModelConfig{
			{ModelName: "gpt-4o-mini", Model: "openai/gpt-4o-mini"},
		},
	}

	msgBus := bus.NewMessageBus()
	al := NewAgentLoop(cfg, msgBus, &mockProvider{})
	return []any{loader, reg, al}
}

func TestCoreRuntimeMemoryFootprint(t *testing.T) {
	tmpHome := t.TempDir()
	setTestHome(t, tmpHome)
	t.Setenv("MALIKCLAW_BUILTIN_SKILLS", t.TempDir())
	wsDir := t.TempDir()

	// Warm up one-time package globals before measuring runtime instance delta.
	warm := initCoreRuntime(wsDir)
	runtime.KeepAlive(warm)
	warm = nil

	runtime.GC()
	var before runtime.MemStats
	runtime.ReadMemStats(&before)

	retained := initCoreRuntime(wsDir)

	runtime.GC()
	var after runtime.MemStats
	runtime.ReadMemStats(&after)
	runtime.KeepAlive(retained)

	var delta uint64
	if after.HeapAlloc > before.HeapAlloc {
		delta = after.HeapAlloc - before.HeapAlloc
	}

	t.Logf("Core runtime memory footprint: delta=%d bytes (%.2f MB), HeapAlloc=%d bytes (%.2f MB), HeapInuse=%d bytes (%.2f MB)",
		delta, float64(delta)/(1024*1024),
		after.HeapAlloc, float64(after.HeapAlloc)/(1024*1024),
		after.HeapInuse, float64(after.HeapInuse)/(1024*1024),
	)

	if delta >= maxCoreRuntimeHeapDeltaBytes {
		t.Fatalf("core runtime heap delta %d bytes (%.2f MB) exceeded <10MB budget (%d bytes)",
			delta, float64(delta)/(1024*1024), maxCoreRuntimeHeapDeltaBytes)
	}
}

func BenchmarkCoreRuntimeFootprint(b *testing.B) {
	tmpHome := b.TempDir()
	b.Setenv("MALIKCLAW_HOME", "")
	b.Setenv("HOME", tmpHome)
	b.Setenv("USERPROFILE", tmpHome)
	b.Setenv("MALIKCLAW_BUILTIN_SKILLS", b.TempDir())
	wsDir := b.TempDir()

	b.ReportAllocs()
	runtime.GC()
	var before runtime.MemStats
	runtime.ReadMemStats(&before)

	var retained any
	for b.Loop() {
		retained = initCoreRuntime(wsDir)
	}

	runtime.GC()
	var after runtime.MemStats
	runtime.ReadMemStats(&after)
	runtime.KeepAlive(retained)

	var delta uint64
	if after.HeapAlloc > before.HeapAlloc {
		delta = after.HeapAlloc - before.HeapAlloc
	}
	b.ReportMetric(float64(delta)/(1024*1024), "MB_heap_alloc")
}
