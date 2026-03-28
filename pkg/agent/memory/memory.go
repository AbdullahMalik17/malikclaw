// MalikClaw - Ultra-lightweight personal AI agent
// Production-grade agent loop with PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package memory

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/observer"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/planner"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/reflector"
	"github.com/AbdullahMalik17/malikclaw/pkg/fileutil"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

// ActionRecord represents a single action and its result.
type ActionRecord struct {
	ID          string                 `json:"id"`
	Timestamp   time.Time              `json:"timestamp"`
	Goal        string                 `json:"goal"`
	StepID      string                 `json:"step_id"`
	Tool        string                 `json:"tool"`
	Args        map[string]any         `json:"args,omitempty"`
	Output      string                 `json:"output"`
	IsError     bool                   `json:"is_error"`
	ErrorMessage string                `json:"error_message,omitempty"`
	Duration    time.Duration          `json:"duration"`
	Metrics     map[string]any         `json:"metrics,omitempty"`
	Tags        []string               `json:"tags,omitempty"`
}

// Episode represents a complete goal execution episode.
type Episode struct {
	ID            string                   `json:"id"`
	Goal          string                   `json:"goal"`
	StartTime     time.Time                `json:"start_time"`
	EndTime       time.Time                `json:"end_time,omitempty"`
	Status        string                   `json:"status"` // "success", "partial", "failed"
	Plan          *planner.ExecutionPlan   `json:"plan,omitempty"`
	Actions       []ActionRecord           `json:"actions"`
	Reflection    *reflector.ReflectionResult `json:"reflection,omitempty"`
	Summary       string                   `json:"summary,omitempty"`
	LessonsLearned []string                `json:"lessons_learned,omitempty"`
}

// MemoryConfig configures memory behavior.
type MemoryConfig struct {
	Workspace          string        // Base workspace directory
	MaxEpisodes        int           // Maximum episodes to retain
	MaxActionsPerEpisode int         // Maximum actions per episode
	AutoSave           bool          // Auto-save after each action
	SaveInterval       time.Duration // Interval for periodic saves
	EnableIndexing     bool          // Enable action indexing for search
}

// DefaultMemoryConfig returns sensible defaults.
func DefaultMemoryConfig(workspace string) MemoryConfig {
	return MemoryConfig{
		Workspace:            workspace,
		MaxEpisodes:          100,
		MaxActionsPerEpisode: 1000,
		AutoSave:             true,
		SaveInterval:         5 * time.Minute,
		EnableIndexing:       true,
	}
}

// MemoryManager handles persistent storage of actions and episodes.
type MemoryManager struct {
	config          MemoryConfig
	mu              sync.RWMutex
	episodes        []*Episode
	currentEpisode  *Episode
	actionIndex     map[string][]int // action_id -> episode indices
	dirty           bool
	saveTicker      *time.Ticker
	stopSaveChan    chan struct{}
}

// NewMemoryManager creates a new memory manager.
func NewMemoryManager(workspace string) *MemoryManager {
	return NewMemoryManagerWithConfig(DefaultMemoryConfig(workspace))
}

// NewMemoryManagerWithConfig creates a memory manager with custom config.
func NewMemoryManagerWithConfig(config MemoryConfig) *MemoryManager {
	mm := &MemoryManager{
		config:       config,
		episodes:     make([]*Episode, 0),
		actionIndex:  make(map[string][]int),
		saveTicker:   time.NewTicker(config.SaveInterval),
		stopSaveChan: make(chan struct{}),
	}

	// Load existing memory
	mm.load()

	// Start auto-save if enabled
	if config.AutoSave {
		go mm.autoSaveLoop()
	}

	return mm
}

// StartEpisode begins a new episode for a goal.
func (mm *MemoryManager) StartEpisode(goal string) *Episode {
	mm.mu.Lock()
	defer mm.mu.Unlock()

	episode := &Episode{
		ID:        generateEpisodeID(goal),
		Goal:      goal,
		StartTime: time.Now(),
		Status:    "in_progress",
		Actions:   make([]ActionRecord, 0),
	}

	mm.currentEpisode = episode
	mm.episodes = append(mm.episodes, episode)
	mm.dirty = true

	logger.InfoCF("memory", "Episode started", map[string]any{
		"episode_id": episode.ID,
		"goal":       goal,
	})

	return episode
}

// RecordAction records an action in the current episode.
func (mm *MemoryManager) RecordAction(
	stepID, tool string,
	args map[string]any,
	output string,
	isError bool,
	errorMessage string,
	duration time.Duration,
	observation *observer.Observation,
) *ActionRecord {

	mm.mu.Lock()
	defer mm.mu.Unlock()

	if mm.currentEpisode == nil {
		logger.WarnC("memory", "No active episode to record action")
		return nil
	}

	action := ActionRecord{
		ID:          generateActionID(mm.currentEpisode.ID, stepID),
		Timestamp:   time.Now(),
		Goal:        mm.currentEpisode.Goal,
		StepID:      stepID,
		Tool:        tool,
		Args:        args,
		Output:      output,
		IsError:     isError,
		ErrorMessage: errorMessage,
		Duration:    duration,
		Metrics:     make(map[string]any),
	}

	// Copy metrics from observation if available
	if observation != nil {
		action.Metrics = observation.Metrics
		action.Tags = observation.Tags
	}

	// Truncate actions if limit reached
	if len(mm.currentEpisode.Actions) >= mm.config.MaxActionsPerEpisode {
		// Remove oldest action
		mm.currentEpisode.Actions = mm.currentEpisode.Actions[1:]
	}

	mm.currentEpisode.Actions = append(mm.currentEpisode.Actions, action)
	mm.currentEpisode.EndTime = time.Now()
	mm.dirty = true

	// Update index
	if mm.config.EnableIndexing {
		mm.actionIndex[action.ID] = append(mm.actionIndex[action.ID], len(mm.episodes)-1)
	}

	logger.DebugCF("memory", "Action recorded", map[string]any{
		"episode_id": mm.currentEpisode.ID,
		"action_id":  action.ID,
		"tool":       tool,
		"is_error":   isError,
	})

	return &action
}

// EndEpisode completes the current episode with reflection.
func (mm *MemoryManager) EndEpisode(reflection *reflector.ReflectionResult) *Episode {
	mm.mu.Lock()
	defer mm.mu.Unlock()

	if mm.currentEpisode == nil {
		return nil
	}

	mm.currentEpisode.EndTime = time.Now()
	mm.currentEpisode.Reflection = reflection

	// Set status based on reflection
	if reflection != nil {
		if reflection.GoalAchieved {
			mm.currentEpisode.Status = "success"
		} else if reflection.PartialProgress {
			mm.currentEpisode.Status = "partial"
		} else {
			mm.currentEpisode.Status = "failed"
		}
		mm.currentEpisode.LessonsLearned = reflection.LessonsLearned
		mm.currentEpisode.Summary = reflection.Reasoning
	} else {
		mm.currentEpisode.Status = "unknown"
	}

	mm.dirty = true

	// Trim episodes if needed
	mm.trimEpisodes()

	logger.InfoCF("memory", "Episode ended", map[string]any{
		"episode_id": mm.currentEpisode.ID,
		"status":     mm.currentEpisode.Status,
		"actions":    len(mm.currentEpisode.Actions),
	})

	return mm.currentEpisode
}

// GetCurrentEpisode returns the active episode.
func (mm *MemoryManager) GetCurrentEpisode() *Episode {
	mm.mu.RLock()
	defer mm.mu.RUnlock()
	return mm.currentEpisode
}

// GetEpisode retrieves an episode by ID.
func (mm *MemoryManager) GetEpisode(episodeID string) *Episode {
	mm.mu.RLock()
	defer mm.mu.RUnlock()

	for _, ep := range mm.episodes {
		if ep.ID == episodeID {
			return ep
		}
	}

	return nil
}

// GetEpisodes returns all episodes.
func (mm *MemoryManager) GetEpisodes() []*Episode {
	mm.mu.RLock()
	defer mm.mu.RUnlock()

	result := make([]*Episode, len(mm.episodes))
	copy(result, mm.episodes)
	return result
}

// GetRecentEpisodes returns the N most recent episodes.
func (mm *MemoryManager) GetRecentEpisodes(n int) []*Episode {
	mm.mu.RLock()
	defer mm.mu.RUnlock()

	if n >= len(mm.episodes) {
		result := make([]*Episode, len(mm.episodes))
		copy(result, mm.episodes)
		return result
	}

	start := len(mm.episodes) - n
	result := make([]*Episode, n)
	copy(result, mm.episodes[start:])
	return result
}

// SearchActions searches for actions matching criteria.
func (mm *MemoryManager) SearchActions(query string, toolFilter string) []ActionRecord {
	mm.mu.RLock()
	defer mm.mu.RUnlock()

	var results []ActionRecord
	queryLower := strings.ToLower(query)

	for _, ep := range mm.episodes {
		for _, action := range ep.Actions {
			// Apply tool filter
			if toolFilter != "" && action.Tool != toolFilter {
				continue
			}

			// Search in output and tool name
			if query == "" ||
				strings.Contains(strings.ToLower(action.Output), queryLower) ||
				strings.Contains(strings.ToLower(action.Tool), queryLower) {
				results = append(results, action)
			}
		}
	}

	// Sort by timestamp (most recent first)
	sort.Slice(results, func(i, j int) bool {
		return results[i].Timestamp.After(results[j].Timestamp)
	})

	return results
}

// GetActionsByTool returns all actions for a specific tool.
func (mm *MemoryManager) GetActionsByTool(tool string) []ActionRecord {
	return mm.SearchActions("", tool)
}

// GetErrorActions returns all failed actions.
func (mm *MemoryManager) GetErrorActions() []ActionRecord {
	mm.mu.RLock()
	defer mm.mu.RUnlock()

	var results []ActionRecord
	for _, ep := range mm.episodes {
		for _, action := range ep.Actions {
			if action.IsError {
				results = append(results, action)
			}
		}
	}

	return results
}

// GetStatistics returns memory statistics.
func (mm *MemoryManager) GetStatistics() MemoryStatistics {
	mm.mu.RLock()
	defer mm.mu.RUnlock()

	stats := MemoryStatistics{
		TotalEpisodes:   len(mm.episodes),
		TotalActions:    0,
		SuccessfulActions: 0,
		FailedActions:   0,
		ToolsUsed:       make(map[string]int),
	}

	for _, ep := range mm.episodes {
		stats.TotalActions += len(ep.Actions)
		for _, action := range ep.Actions {
			if action.IsError {
				stats.FailedActions++
			} else {
				stats.SuccessfulActions++
			}
			stats.ToolsUsed[action.Tool]++
		}
	}

	if stats.TotalActions > 0 {
		stats.SuccessRate = float64(stats.SuccessfulActions) / float64(stats.TotalActions)
	}

	return stats
}

// MemoryStatistics holds memory usage statistics.
type MemoryStatistics struct {
	TotalEpisodes     int                `json:"total_episodes"`
	TotalActions      int                `json:"total_actions"`
	SuccessfulActions int                `json:"successful_actions"`
	FailedActions     int                `json:"failed_actions"`
	SuccessRate       float64            `json:"success_rate"`
	ToolsUsed         map[string]int     `json:"tools_used"`
}

// Save persists memory to disk.
func (mm *MemoryManager) Save() error {
	mm.mu.Lock()
	defer mm.mu.Unlock()

	memoryDir := filepath.Join(mm.config.Workspace, "agent_memory")
	if err := os.MkdirAll(memoryDir, 0o755); err != nil {
		return fmt.Errorf("failed to create memory directory: %w", err)
	}

	// Save episodes
	episodesFile := filepath.Join(memoryDir, "episodes.json")
	data, err := json.MarshalIndent(mm.episodes, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal episodes: %w", err)
	}

	if err := fileutil.WriteFileAtomic(episodesFile, data, 0o644); err != nil {
		return fmt.Errorf("failed to write episodes: %w", err)
	}

	// Save action index
	if mm.config.EnableIndexing {
		indexFile := filepath.Join(memoryDir, "action_index.json")
		indexData, err := json.MarshalIndent(mm.actionIndex, "", "  ")
		if err != nil {
			return fmt.Errorf("failed to marshal action index: %w", err)
		}
		if err := fileutil.WriteFileAtomic(indexFile, indexData, 0o644); err != nil {
			return fmt.Errorf("failed to write action index: %w", err)
		}
	}

	mm.dirty = false
	logger.InfoCF("memory", "Memory saved", map[string]any{
		"episodes": len(mm.episodes),
		"actions":  mm.GetStatistics().TotalActions,
	})

	return nil
}

// Close saves and cleans up resources.
func (mm *MemoryManager) Close() error {
	// Stop auto-save
	close(mm.stopSaveChan)
	mm.saveTicker.Stop()

	// Final save
	if mm.dirty {
		return mm.Save()
	}

	return nil
}

// autoSaveLoop periodically saves memory.
func (mm *MemoryManager) autoSaveLoop() {
	for {
		select {
		case <-mm.saveTicker.C:
			if mm.dirty {
				if err := mm.Save(); err != nil {
					logger.ErrorCF("memory", "Auto-save failed", map[string]any{
						"error": err.Error(),
					})
				}
			}
		case <-mm.stopSaveChan:
			return
		}
	}
}

// load loads memory from disk.
func (mm *MemoryManager) load() {
	memoryDir := filepath.Join(mm.config.Workspace, "agent_memory")
	episodesFile := filepath.Join(memoryDir, "episodes.json")

	if _, err := os.Stat(episodesFile); os.IsNotExist(err) {
		logger.DebugC("memory", "No existing memory file found, starting fresh")
		return
	}

	data, err := os.ReadFile(episodesFile)
	if err != nil {
		logger.ErrorCF("memory", "Failed to load memory", map[string]any{
			"error": err.Error(),
		})
		return
	}

	var episodes []*Episode
	if err := json.Unmarshal(data, &episodes); err != nil {
		logger.ErrorCF("memory", "Failed to parse memory", map[string]any{
			"error": err.Error(),
		})
		return
	}

	mm.episodes = episodes
	logger.InfoCF("memory", "Memory loaded", map[string]any{
		"episodes": len(episodes),
	})

	// Load action index
	if mm.config.EnableIndexing {
		indexFile := filepath.Join(memoryDir, "action_index.json")
		if indexData, err := os.ReadFile(indexFile); err == nil {
			var index map[string][]int
			if err := json.Unmarshal(indexData, &index); err == nil {
				mm.actionIndex = index
			}
		}
	}
}

// trimEpisodes removes old episodes if limit exceeded.
func (mm *MemoryManager) trimEpisodes() {
	if len(mm.episodes) <= mm.config.MaxEpisodes {
		return
	}

	// Sort by end time (oldest first)
	sort.Slice(mm.episodes, func(i, j int) bool {
		return mm.episodes[i].EndTime.Before(mm.episodes[j].EndTime)
	})

	// Remove oldest episodes
	removed := len(mm.episodes) - mm.config.MaxEpisodes
	mm.episodes = mm.episodes[removed:]

	logger.DebugCF("memory", "Trimmed old episodes", map[string]any{
		"removed": removed,
		"remaining": len(mm.episodes),
	})
}

// Helper functions

func generateEpisodeID(goal string) string {
	timestamp := time.Now().Format("20060102150405")
	hash := simpleHash(goal + timestamp)
	return fmt.Sprintf("ep_%s_%s", timestamp, hash[:8])
}

func generateActionID(episodeID, stepID string) string {
	timestamp := time.Now().Format("150405.000")
	return fmt.Sprintf("%s_%s_%s", episodeID, stepID, timestamp)
}

func simpleHash(s string) string {
	var hash uint32
	for i := 0; i < len(s); i++ {
		hash = hash*31 + uint32(s[i])
	}
	return fmt.Sprintf("%08x", hash)
}
