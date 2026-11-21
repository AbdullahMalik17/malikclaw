package agent

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"

	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/memory"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/routing"
	"github.com/AbdullahMalik17/malikclaw/pkg/session"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

// AgentInstance represents a fully configured agent with its own workspace,
// session manager, context builder, and tool registry.
type AgentInstance struct {
	ID                        string
	Name                      string
	Model                     string
	Fallbacks                 []string
	Workspace                 string
	MaxIterations             int
	MaxTokens                 int
	Temperature               float64
	ThinkingLevel             ThinkingLevel
	ContextWindow             int
	SummarizeMessageThreshold int
	SummarizeTokenPercent     int
	Provider                  providers.LLMProvider
	Sessions                  session.SessionStore
	LearningStore             memory.LearningStore
	ContextBuilder            *ContextBuilder
	Tools                     *tools.ToolRegistry
	Subagents                 *config.SubagentsConfig
	SkillsFilter              []string
	Candidates                []providers.FallbackCandidate

	// Router is non-nil when model routing is configured and the light model
	// was successfully resolved. It scores each incoming message and decides
	// whether to route to LightCandidates or stay with Candidates.
	Router *routing.Router
	// LightCandidates holds the resolved provider candidates for the light model.
	// Pre-computed at agent creation to avoid repeated model_list lookups at runtime.
	LightCandidates []providers.FallbackCandidate

	// CostRouter performs complexity-aware 3-tier routing (fast / balanced / reasoning)
	// when configured via RoutingConfig.Mode == "smart" or tier fields.
	CostRouter *routing.SmartCostRouter
	// ProviderResolver resolves an LLMProvider and model ID for a fallback candidate
	// so multi-provider tiers (e.g. Ollama + Gemini + Anthropic) hit their own endpoints.
	ProviderResolver func(provider, model string) (providers.LLMProvider, string, error)

	resolveModelList func(raw string) (string, bool)
	defaultProvider  string
}

// NewAgentInstance creates an agent instance from config.
func NewAgentInstance(
	agentCfg *config.AgentConfig,
	defaults *config.AgentDefaults,
	cfg *config.Config,
	provider providers.LLMProvider,
) *AgentInstance {
	workspace := resolveAgentWorkspace(agentCfg, defaults)
	os.MkdirAll(workspace, 0o755)

	model := resolveAgentModel(agentCfg, defaults)
	fallbacks := resolveAgentFallbacks(agentCfg, defaults)

	restrict := defaults.RestrictToWorkspace
	readRestrict := restrict && !defaults.AllowReadOutsideWorkspace

	// Compile path whitelist patterns from config.
	allowReadPaths := compilePatterns(cfg.Tools.AllowReadPaths)
	allowWritePaths := compilePatterns(cfg.Tools.AllowWritePaths)

	toolsRegistry := tools.NewToolRegistry()

	if cfg.Tools.IsToolEnabled("read_file") {
		maxReadFileSize := cfg.Tools.ReadFile.MaxReadFileSize
		toolsRegistry.Register(tools.NewReadFileTool(workspace, readRestrict, maxReadFileSize, allowReadPaths))
	}
	if cfg.Tools.IsToolEnabled("write_file") {
		toolsRegistry.Register(tools.NewWriteFileTool(workspace, restrict, allowWritePaths))
	}
	if cfg.Tools.IsToolEnabled("list_dir") {
		toolsRegistry.Register(tools.NewListDirTool(workspace, readRestrict, allowReadPaths))
	}
	if cfg.Tools.IsToolEnabled("exec") {
		execTool, err := tools.NewExecToolWithConfig(workspace, restrict, cfg)
		if err != nil {
			log.Fatalf("Critical error: unable to initialize exec tool: %v", err)
		}
		toolsRegistry.Register(execTool)
	}

	if cfg.Tools.IsToolEnabled("edit_file") {
		toolsRegistry.Register(tools.NewEditFileTool(workspace, restrict, allowWritePaths))
	}
	if cfg.Tools.IsToolEnabled("append_file") {
		toolsRegistry.Register(tools.NewAppendFileTool(workspace, restrict, allowWritePaths))
	}

	sessionsDir := filepath.Join(workspace, "sessions")
	sessions := initSessionStore(sessionsDir)
	learning, _ := memory.NewJSONLLearningStore(workspace)

	mcpDiscoveryActive := cfg.Tools.MCP.Enabled && cfg.Tools.MCP.Discovery.Enabled
	contextBuilder := NewContextBuilder(workspace).WithToolDiscovery(
		mcpDiscoveryActive && cfg.Tools.MCP.Discovery.UseBM25,
		mcpDiscoveryActive && cfg.Tools.MCP.Discovery.UseRegex,
	)

	agentID := routing.DefaultAgentID
	agentName := ""
	var subagents *config.SubagentsConfig
	var skillsFilter []string

	if agentCfg != nil {
		agentID = routing.NormalizeAgentID(agentCfg.ID)
		agentName = agentCfg.Name
		subagents = agentCfg.Subagents
		skillsFilter = agentCfg.Skills
	}

	maxIter := defaults.MaxToolIterations
	if maxIter == 0 {
		maxIter = 20
	}

	maxTokens := defaults.MaxTokens
	if maxTokens == 0 {
		maxTokens = 8192
	}

	temperature := 0.7
	if defaults.Temperature != nil {
		temperature = *defaults.Temperature
	}

	var thinkingLevelStr string
	if mc, err := cfg.GetModelConfig(model); err == nil {
		thinkingLevelStr = mc.ThinkingLevel
	}
	thinkingLevel := parseThinkingLevel(thinkingLevelStr)

	summarizeMessageThreshold := defaults.SummarizeMessageThreshold
	if summarizeMessageThreshold == 0 {
		summarizeMessageThreshold = 20
	}

	summarizeTokenPercent := defaults.SummarizeTokenPercent
	if summarizeTokenPercent == 0 {
		summarizeTokenPercent = 75
	}

	// Resolve fallback candidates
	modelCfg := providers.ModelConfig{
		Primary:   model,
		Fallbacks: fallbacks,
	}
	resolveFromModelList := func(raw string) (string, bool) {
		ensureProtocol := func(model string) string {
			model = strings.TrimSpace(model)
			if model == "" {
				return ""
			}
			if strings.Contains(model, "/") {
				return model
			}
			return "openai/" + model
		}

		raw = strings.TrimSpace(raw)
		if raw == "" {
			return "", false
		}

		if cfg != nil {
			if mc, err := cfg.GetModelConfig(raw); err == nil && mc != nil && strings.TrimSpace(mc.Model) != "" {
				return ensureProtocol(mc.Model), true
			}

			for i := range cfg.ModelList {
				fullModel := strings.TrimSpace(cfg.ModelList[i].Model)
				if fullModel == "" {
					continue
				}
				if fullModel == raw {
					return ensureProtocol(fullModel), true
				}
				_, modelID := providers.ExtractProtocol(fullModel)
				if modelID == raw {
					return ensureProtocol(fullModel), true
				}
			}
		}

		return "", false
	}

	candidates := providers.ResolveCandidatesWithLookup(modelCfg, defaults.Provider, resolveFromModelList)

	// Model routing setup: support both 3-tier SmartCostRouter (v2) and legacy
	// light_model Router (v1) for backward compatibility.
	var router *routing.Router
	var lightCandidates []providers.FallbackCandidate
	var costRouter *routing.SmartCostRouter
	if rc := defaults.Routing; rc != nil && rc.Enabled {
		useSmart := strings.EqualFold(strings.TrimSpace(rc.Mode), "smart") ||
			strings.TrimSpace(rc.FastModel) != "" ||
			strings.TrimSpace(rc.BalancedModel) != "" ||
			strings.TrimSpace(rc.ReasoningModel) != "" ||
			len(rc.TierFallbacks) > 0 ||
			len(rc.DefaultFallbackOrder) > 0 ||
			strings.TrimSpace(rc.LightModel) == ""

		if useSmart {
			costCfg := routing.CostRouterConfig{
				Models: map[routing.Tier]string{
					routing.TierFast:      rc.FastModel,
					routing.TierBalanced:  rc.BalancedModel,
					routing.TierReasoning: rc.ReasoningModel,
				},
				Fallbacks:            make(map[routing.Tier][]string),
				DefaultFallbackOrder: rc.DefaultFallbackOrder,
			}
			for k, v := range rc.TierFallbacks {
				switch strings.ToLower(strings.TrimSpace(k)) {
				case string(routing.TierFast):
					costCfg.Fallbacks[routing.TierFast] = v
				case string(routing.TierBalanced):
					costCfg.Fallbacks[routing.TierBalanced] = v
				case string(routing.TierReasoning):
					costCfg.Fallbacks[routing.TierReasoning] = v
				}
			}
			costRouter = routing.NewSmartCostRouter(costCfg)
		} else if rc.LightModel != "" {
			lightModelCfg := providers.ModelConfig{Primary: rc.LightModel}
			resolved := providers.ResolveCandidatesWithLookup(lightModelCfg, defaults.Provider, resolveFromModelList)
			if len(resolved) > 0 {
				router = routing.New(routing.RouterConfig{
					LightModel: rc.LightModel,
					Threshold:  rc.Threshold,
				}, nil)

				lightCandidates = resolved
			} else {
				log.Printf("routing: light_model %q not found in model_list — routing disabled for agent %q",
					rc.LightModel, agentID)
			}
		}
	}

	var primaryKey string
	if len(candidates) > 0 {
		primaryKey = providers.ModelKey(candidates[0].Provider, candidates[0].Model)
	}

	var providerCacheMu sync.RWMutex
	providerCache := make(map[string]providers.LLMProvider)

	providerResolver := func(providerName, modelName string) (providers.LLMProvider, string, error) {
		key := providers.ModelKey(providerName, modelName)
		if provider != nil && primaryKey != "" && key == primaryKey {
			return provider, modelName, nil
		}

		providerCacheMu.RLock()
		if cached, ok := providerCache[key]; ok {
			providerCacheMu.RUnlock()
			return cached, modelName, nil
		}
		providerCacheMu.RUnlock()

		if cfg != nil {
			for i := range cfg.ModelList {
				mc := cfg.ModelList[i]
				if mc.APIKey == "" && mc.AuthMethod == "" && mc.APIBase == "" {
					continue
				}
				matched := false
				if strings.EqualFold(strings.TrimSpace(mc.ModelName), strings.TrimSpace(modelName)) ||
					strings.EqualFold(strings.TrimSpace(mc.ModelName), strings.TrimSpace(providerName+"/"+modelName)) {
					matched = true
				} else if ref := providers.ParseModelRef(mc.Model, defaults.Provider); ref != nil {
					if providers.ModelKey(ref.Provider, ref.Model) == key {
						matched = true
					}
				}
				if !matched {
					continue
				}

				resolvedProv, resolvedModelID, err := providers.CreateProviderFromConfig(&mc)
				if err == nil && resolvedProv != nil {
					providerCacheMu.Lock()
					providerCache[key] = resolvedProv
					providerCacheMu.Unlock()
					if resolvedModelID == "" {
						resolvedModelID = modelName
					}
					return resolvedProv, resolvedModelID, nil
				}
			}
		}

		return provider, modelName, nil
	}

	return &AgentInstance{
		ID:                        agentID,
		Name:                      agentName,
		Model:                     model,
		Fallbacks:                 fallbacks,
		Workspace:                 workspace,
		MaxIterations:             maxIter,
		MaxTokens:                 maxTokens,
		Temperature:               temperature,
		ThinkingLevel:             thinkingLevel,
		ContextWindow:             maxTokens,
		SummarizeMessageThreshold: summarizeMessageThreshold,
		SummarizeTokenPercent:     summarizeTokenPercent,
		Provider:                  provider,
		Sessions:                  sessions,
		LearningStore:             learning,
		ContextBuilder:            contextBuilder,
		Tools:                     toolsRegistry,
		Subagents:                 subagents,
		SkillsFilter:              skillsFilter,
		Candidates:                candidates,
		Router:                    router,
		LightCandidates:           lightCandidates,
		CostRouter:                costRouter,
		ProviderResolver:          providerResolver,
		resolveModelList:          resolveFromModelList,
		defaultProvider:           defaults.Provider,
	}
}

// ResolveCandidates resolves raw model identifiers/aliases into deduplicated
// FallbackCandidate entries using the agent's model_list lookup and default provider.
func (a *AgentInstance) ResolveCandidates(rawModels []string) []providers.FallbackCandidate {
	if len(rawModels) == 0 {
		return nil
	}
	mc := providers.ModelConfig{
		Primary: rawModels[0],
	}
	if len(rawModels) > 1 {
		mc.Fallbacks = rawModels[1:]
	}
	return providers.ResolveCandidatesWithLookup(mc, a.defaultProvider, a.resolveModelList)
}

// ResolveProvider returns the LLMProvider and model ID for a candidate,
// using ProviderResolver when available and falling back to a.Provider.
func (a *AgentInstance) ResolveProvider(providerName, modelName string) (providers.LLMProvider, string) {
	if a.ProviderResolver != nil {
		if p, m, err := a.ProviderResolver(providerName, modelName); err == nil && p != nil {
			if m == "" {
				m = modelName
			}
			return p, m
		}
	}
	return a.Provider, modelName
}

// resolveAgentWorkspace determines the workspace directory for an agent.
func resolveAgentWorkspace(agentCfg *config.AgentConfig, defaults *config.AgentDefaults) string {
	if agentCfg != nil && strings.TrimSpace(agentCfg.Workspace) != "" {
		return expandHome(strings.TrimSpace(agentCfg.Workspace))
	}
	// Use the configured default workspace (respects MALIKCLAW_HOME)
	if agentCfg == nil || agentCfg.Default || agentCfg.ID == "" || routing.NormalizeAgentID(agentCfg.ID) == "main" {
		return expandHome(defaults.Workspace)
	}
	// For named agents without explicit workspace, use default workspace with agent ID suffix
	id := routing.NormalizeAgentID(agentCfg.ID)
	return filepath.Join(expandHome(defaults.Workspace), "..", "workspace-"+id)
}

// resolveAgentModel resolves the primary model for an agent.
func resolveAgentModel(agentCfg *config.AgentConfig, defaults *config.AgentDefaults) string {
	if agentCfg != nil && agentCfg.Model != nil && strings.TrimSpace(agentCfg.Model.Primary) != "" {
		return strings.TrimSpace(agentCfg.Model.Primary)
	}
	return defaults.GetModelName()
}

// resolveAgentFallbacks resolves the fallback models for an agent.
func resolveAgentFallbacks(agentCfg *config.AgentConfig, defaults *config.AgentDefaults) []string {
	if agentCfg != nil && agentCfg.Model != nil && agentCfg.Model.Fallbacks != nil {
		return agentCfg.Model.Fallbacks
	}
	return defaults.ModelFallbacks
}

func compilePatterns(patterns []string) []*regexp.Regexp {
	compiled := make([]*regexp.Regexp, 0, len(patterns))
	for _, p := range patterns {
		re, err := regexp.Compile(p)
		if err != nil {
			fmt.Printf("Warning: invalid path pattern %q: %v\n", p, err)
			continue
		}
		compiled = append(compiled, re)
	}
	return compiled
}

// Close releases resources held by the agent's session store.
func (a *AgentInstance) Close() error {
	if a.Sessions != nil {
		return a.Sessions.Close()
	}
	return nil
}

// initSessionStore creates the session persistence backend.
// It uses the JSONL store by default and auto-migrates legacy JSON sessions.
// Falls back to SessionManager if the JSONL store cannot be initialized or
// if migration fails (which indicates the store cannot write reliably).
func initSessionStore(dir string) session.SessionStore {
	store, err := memory.NewJSONLStore(dir)
	if err != nil {
		log.Printf("memory: init store: %v; using json sessions", err)
		return session.NewSessionManager(dir)
	}

	if n, merr := memory.MigrateFromJSON(context.Background(), dir, store); merr != nil {
		// Migration failure means the store could not write data.
		// Fall back to SessionManager to avoid a split state where
		// some sessions are in JSONL and others remain in JSON.
		log.Printf("memory: migration failed: %v; falling back to json sessions", merr)
		store.Close()
		return session.NewSessionManager(dir)
	} else if n > 0 {
		log.Printf("memory: migrated %d session(s) to jsonl", n)
	}

	return session.NewJSONLBackend(store)
}

func expandHome(path string) string {
	if path == "" {
		return path
	}
	if path[0] == '~' {
		home, _ := os.UserHomeDir()
		if len(path) > 1 && path[1] == '/' {
			return home + path[1:]
		}
		return home
	}
	return path
}
