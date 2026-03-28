// MalikClaw - Ultra-lightweight personal AI agent
// Production-grade agent loop with PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package observer

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/executor"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

// Observation captures the result of a step execution.
type Observation struct {
	StepID        string                 `json:"step_id"`
	Timestamp     time.Time              `json:"timestamp"`
	RawOutput     string                 `json:"raw_output"`
	Normalized    string                 `json:"normalized"`
	IsError       bool                   `json:"is_error"`
	ErrorMessage  string                 `json:"error_message,omitempty"`
	Metrics       map[string]any         `json:"metrics,omitempty"`
	ToolResult    *tools.ToolResult      `json:"-"`
	Duration      time.Duration          `json:"duration"`
	Confidence    float64                `json:"confidence"` // 0-1 confidence in observation quality
	Tags          []string               `json:"tags,omitempty"`
	Metadata      map[string]string      `json:"metadata,omitempty"`
}

// ObservationSummary provides a summary of multiple observations.
type ObservationSummary struct {
	TotalObservations int                    `json:"total"`
	Successful        int                    `json:"successful"`
	Failed            int                    `json:"failed"`
	TotalDuration     time.Duration          `json:"total_duration"`
	KeyFindings       []string               `json:"key_findings"`
	Errors            []string               `json:"errors,omitempty"`
	Metrics           map[string]any         `json:"metrics,omitempty"`
}

// ObserverConfig configures observation behavior.
type ObserverConfig struct {
	EnableNormalization bool            // Normalize outputs for consistency
	EnableMetrics       bool            // Collect execution metrics
	EnableTagging       bool            // Auto-tag observations
	MaxOutputLength     int             // Maximum output length to store
	MinConfidence       float64         // Minimum confidence threshold
	LogLevel            string          // Log level for observations
}

// DefaultObserverConfig returns sensible defaults.
func DefaultObserverConfig() ObserverConfig {
	return ObserverConfig{
		EnableNormalization: true,
		EnableMetrics:       true,
		EnableTagging:       true,
		MaxOutputLength:     10000,
		MinConfidence:       0.5,
		LogLevel:            "info",
	}
}

// Observer captures, normalizes, and stores execution observations.
type Observer struct {
	config      ObserverConfig
	mu          sync.RWMutex
	observations []*Observation
	callbacks   []ObservationCallback
}

// ObservationCallback is called when a new observation is recorded.
type ObservationCallback func(*Observation)

// NewObserver creates a new observer.
func NewObserver() *Observer {
	return NewObserverWithConfig(DefaultObserverConfig())
}

// NewObserverWithConfig creates an observer with custom config.
func NewObserverWithConfig(config ObserverConfig) *Observer {
	return &Observer{
		config:       config,
		observations: make([]*Observation, 0),
		callbacks:    make([]ObservationCallback, 0),
	}
}

// Observe captures and processes an execution result.
func (ob *Observer) Observe(ctx context.Context, result *executor.ExecutionResult) *Observation {
	startTime := time.Now()

	logger.DebugCF("observer", "Recording observation", map[string]any{
		"step_id": result.StepID,
		"is_error": result.IsError,
	})

	// Create observation
	observation := &Observation{
		StepID:       result.StepID,
		Timestamp:    startTime,
		RawOutput:    result.Output,
		IsError:      result.IsError,
		ErrorMessage: result.ErrorMessage,
		Duration:     result.Duration,
		ToolResult:   result.ToolResult,
		Metrics:      make(map[string]any),
		Metadata:     make(map[string]string),
	}

	// Copy metrics
	if result.Metrics != nil {
		for k, v := range result.Metrics {
			observation.Metrics[k] = v
		}
	}

	// Normalize output
	if ob.config.EnableNormalization {
		observation.Normalized = ob.normalizeOutput(result.Output, result.IsError)
	} else {
		observation.Normalized = result.Output
	}

	// Truncate if needed
	if len(observation.Normalized) > ob.config.MaxOutputLength {
		observation.Normalized = observation.Normalized[:ob.config.MaxOutputLength] + "... [truncated]"
		observation.Metadata["truncated"] = "true"
	}

	// Calculate confidence
	observation.Confidence = ob.calculateConfidence(observation)

	// Auto-tag if enabled
	if ob.config.EnableTagging {
		observation.Tags = ob.generateTags(observation)
	}

	// Store observation
	ob.mu.Lock()
	ob.observations = append(ob.observations, observation)
	ob.mu.Unlock()

	// Invoke callbacks
	ob.invokeCallbacks(observation)

	logger.InfoCF("observer", "Observation recorded", map[string]any{
		"step_id":     observation.StepID,
		"confidence":  observation.Confidence,
		"tags":        observation.Tags,
		"duration_ms": observation.Duration.Milliseconds(),
	})

	return observation
}

// ObserveMultiple captures multiple observations and returns a summary.
func (ob *Observer) ObserveMultiple(ctx context.Context, results []*executor.ExecutionResult) *ObservationSummary {
	observations := make([]*Observation, 0, len(results))

	for _, result := range results {
		obs := ob.Observe(ctx, result)
		observations = append(observations, obs)
	}

	return ob.createSummary(observations)
}

// GetObservation retrieves an observation by step ID.
func (ob *Observer) GetObservation(stepID string) *Observation {
	ob.mu.RLock()
	defer ob.mu.RUnlock()

	for _, obs := range ob.observations {
		if obs.StepID == stepID {
			return obs
		}
	}

	return nil
}

// GetAllObservations returns all recorded observations.
func (ob *Observer) GetAllObservations() []*Observation {
	ob.mu.RLock()
	defer ob.mu.RUnlock()

	// Return a copy to avoid race conditions
	result := make([]*Observation, len(ob.observations))
	copy(result, ob.observations)
	return result
}

// GetObservationsByTag returns observations matching a tag.
func (ob *Observer) GetObservationsByTag(tag string) []*Observation {
	ob.mu.RLock()
	defer ob.mu.RUnlock()

	var result []*Observation
	for _, obs := range ob.observations {
		for _, t := range obs.Tags {
			if t == tag {
				result = append(result, obs)
				break
			}
		}
	}

	return result
}

// GetRecentObservations returns the N most recent observations.
func (ob *Observer) GetRecentObservations(n int) []*Observation {
	ob.mu.RLock()
	defer ob.mu.RUnlock()

	if n >= len(ob.observations) {
		result := make([]*Observation, len(ob.observations))
		copy(result, ob.observations)
		return result
	}

	start := len(ob.observations) - n
	result := make([]*Observation, n)
	copy(result, ob.observations[start:])
	return result
}

// ClearObservations clears all stored observations.
func (ob *Observer) ClearObservations() {
	ob.mu.Lock()
	ob.observations = make([]*Observation, 0)
	ob.mu.Unlock()

	logger.DebugC("observer", "Observations cleared")
}

// RegisterCallback registers a callback for new observations.
func (ob *Observer) RegisterCallback(cb ObservationCallback) {
	ob.mu.Lock()
	defer ob.mu.Unlock()
	ob.callbacks = append(ob.callbacks, cb)
}

// GetSummary returns a summary of all observations.
func (ob *Observer) GetSummary() *ObservationSummary {
	ob.mu.RLock()
	defer ob.mu.RUnlock()
	return ob.createSummary(ob.observations)
}

// normalizeOutput cleans and standardizes output format.
func (ob *Observer) normalizeOutput(output string, isError bool) string {
	if output == "" {
		return ""
	}

	// Trim whitespace
	normalized := strings.TrimSpace(output)

	// Remove excessive newlines
	for strings.Contains(normalized, "\n\n\n") {
		normalized = strings.ReplaceAll(normalized, "\n\n\n", "\n\n")
	}

	// If error, ensure consistent format
	if isError && !strings.HasPrefix(strings.ToLower(normalized), "error") {
		normalized = "Error: " + normalized
	}

	// Try to parse as JSON and re-format for consistency
	if strings.HasPrefix(normalized, "{") || strings.HasPrefix(normalized, "[") {
		var data any
		if err := json.Unmarshal([]byte(normalized), &data); err == nil {
			// Re-marshal with consistent formatting
			if formatted, err := json.MarshalIndent(data, "", "  "); err == nil {
				normalized = string(formatted)
			}
		}
	}

	return normalized
}

// calculateConfidence computes confidence score for an observation.
func (ob *Observer) calculateConfidence(obs *Observation) float64 {
	confidence := 1.0

	// Reduce confidence for errors
	if obs.IsError {
		confidence -= 0.3
	}

	// Reduce confidence for short outputs (might be incomplete)
	if len(obs.Normalized) < 10 {
		confidence -= 0.2
	}

	// Reduce confidence for very long outputs (might be noisy)
	if len(obs.Normalized) > ob.config.MaxOutputLength/2 {
		confidence -= 0.1
	}

	// Check for uncertainty indicators
	uncertaintyWords := []string{"maybe", "possibly", "uncertain", "unknown", "partial"}
	for _, word := range uncertaintyWords {
		if strings.Contains(strings.ToLower(obs.Normalized), word) {
			confidence -= 0.1
			break
		}
	}

	// Ensure confidence is in valid range
	if confidence < 0 {
		confidence = 0
	}
	if confidence > 1 {
		confidence = 1
	}

	return confidence
}

// generateTags creates relevant tags for an observation.
func (ob *Observer) generateTags(obs *Observation) []string {
	tags := make([]string, 0)

	// Error tag
	if obs.IsError {
		tags = append(tags, "error")
	}

	// Content-based tags
	content := strings.ToLower(obs.Normalized)
	tagKeywords := map[string]string{
		"file":      "file_operation",
		"directory": "file_operation",
		"read":      "read_operation",
		"write":     "write_operation",
		"created":   "create_operation",
		"deleted":   "delete_operation",
		"search":    "search_operation",
		"found":     "search_operation",
		"error":     "error",
		"failed":    "error",
		"success":   "success",
		"completed": "success",
		"json":      "json_output",
		"list":      "list_operation",
	}

	for keyword, tag := range tagKeywords {
		if strings.Contains(content, keyword) {
			// Avoid duplicate tags
			hasTag := false
			for _, t := range tags {
				if t == tag {
					hasTag = true
					break
				}
			}
			if !hasTag {
				tags = append(tags, tag)
			}
		}
	}

	// Duration-based tags
	if obs.Duration < 100*time.Millisecond {
		tags = append(tags, "fast")
	} else if obs.Duration > 10*time.Second {
		tags = append(tags, "slow")
	}

	return tags
}

// createSummary creates a summary from observations.
func (ob *Observer) createSummary(observations []*Observation) *ObservationSummary {
	summary := &ObservationSummary{
		TotalObservations: len(observations),
		Successful:        0,
		Failed:            0,
		Metrics:           make(map[string]any),
	}

	keyFindings := make([]string, 0)
	errors := make([]string, 0)
	totalDuration := time.Duration(0)

	for _, obs := range observations {
		totalDuration += obs.Duration

		if obs.IsError {
			summary.Failed++
			if obs.ErrorMessage != "" {
				errors = append(errors, fmt.Sprintf("%s: %s", obs.StepID, obs.ErrorMessage))
			}
		} else {
			summary.Successful++
			// Extract key findings from successful observations
			if obs.Confidence >= ob.config.MinConfidence {
				finding := ob.extractKeyFinding(obs)
				if finding != "" {
					keyFindings = append(keyFindings, finding)
				}
			}
		}
	}

	summary.TotalDuration = totalDuration
	summary.KeyFindings = keyFindings
	summary.Errors = errors

	// Add aggregate metrics
	if len(observations) > 0 {
		summary.Metrics["success_rate"] = float64(summary.Successful) / float64(len(observations))
		summary.Metrics["avg_duration_ms"] = totalDuration.Milliseconds() / int64(len(observations))
	}

	return summary
}

// extractKeyFinding extracts a key finding from an observation.
func (ob *Observer) extractKeyFinding(obs *Observation) string {
	// Simple heuristic: take first meaningful sentence
	lines := strings.Split(obs.Normalized, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if len(line) > 20 && len(line) < 200 {
			return line
		}
	}

	// Fallback to truncated output
	if len(obs.Normalized) > 100 {
		return obs.Normalized[:100] + "..."
	}

	return obs.Normalized
}

// invokeCallbacks calls all registered callbacks.
func (ob *Observer) invokeCallbacks(obs *Observation) {
	ob.mu.RLock()
	callbacks := make([]ObservationCallback, len(ob.callbacks))
	copy(callbacks, ob.callbacks)
	ob.mu.RUnlock()

	for _, cb := range callbacks {
		go cb(obs) // Call in goroutine to avoid blocking
	}
}
