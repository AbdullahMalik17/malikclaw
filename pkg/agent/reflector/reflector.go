// MalikClaw - Ultra-lightweight personal AI agent
// Production-grade agent loop with PLAN → ACT → OBSERVE → REFLECT → MEMORY UPDATE
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package reflector

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/observer"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent/planner"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

// ReflectionResult captures the outcome of reflection.
type ReflectionResult struct {
	IsSuccess       bool                   `json:"is_success"`
	Confidence      float64                `json:"confidence"` // 0-1 confidence in assessment
	Reasoning       string                 `json:"reasoning"`
	GoalAchieved    bool                   `json:"goal_achieved"`
	PartialProgress bool                   `json:"partial_progress"`
	NextActions     []string               `json:"next_actions,omitempty"`
	LessonsLearned  []string               `json:"lessons_learned,omitempty"`
	Metrics         map[string]any         `json:"metrics,omitempty"`
	Timestamp       time.Time              `json:"timestamp"`
}

// ReflectorConfig configures reflection behavior.
type ReflectorConfig struct {
	EnableLLMReflection bool            // Use LLM for deeper analysis
	Model               string          // Model to use for LLM reflection
	MinConfidence       float64         // Minimum confidence for success
	EnableLessonsLearned bool           // Extract lessons from each reflection
	ReflectionDepth     string          // "shallow", "medium", "deep"
}

// DefaultReflectorConfig returns sensible defaults.
func DefaultReflectorConfig() ReflectorConfig {
	return ReflectorConfig{
		EnableLLMReflection: true,
		Model:               "default",
		MinConfidence:       0.7,
		EnableLessonsLearned: true,
		ReflectionDepth:     "medium",
	}
}

// Reflector evaluates execution outcomes and provides insights.
type Reflector struct {
	config        ReflectorConfig
	provider      providers.LLMProvider
	history       []*ReflectionResult
}

// NewReflector creates a new reflector.
func NewReflector(provider providers.LLMProvider) *Reflector {
	return NewReflectorWithConfig(provider, DefaultReflectorConfig())
}

// NewReflectorWithConfig creates a reflector with custom config.
func NewReflectorWithConfig(provider providers.LLMProvider, config ReflectorConfig) *Reflector {
	return &Reflector{
		config:   config,
		provider: provider,
		history:  make([]*ReflectionResult, 0),
	}
}

// Reflect evaluates the execution and provides insights.
func (r *Reflector) Reflect(
	ctx context.Context,
	goal string,
	plan *planner.ExecutionPlan,
	observations []*observer.Observation,
) *ReflectionResult {

	startTime := time.Now()
	logger.InfoCF("reflector", "Starting reflection", map[string]any{
		"goal":           goal,
		"observations":   len(observations),
		"plan_complete":  plan.IsComplete,
	})

	result := &ReflectionResult{
		Timestamp: startTime,
		Metrics:   make(map[string]any),
	}

	// Perform heuristic evaluation
	heuristicResult := r.heuristicReflect(goal, plan, observations)

	// Optionally enhance with LLM
	if r.config.EnableLLMReflection && r.provider != nil {
		llmResult := r.llmReflect(ctx, goal, plan, observations, heuristicResult)
		// Merge results, preferring LLM insights when confident
		if llmResult.Confidence > heuristicResult.Confidence {
			result = llmResult
		} else {
			result = heuristicResult
			result.Reasoning = fmt.Sprintf("%s\n\nLLM Insights: %s", result.Reasoning, llmResult.Reasoning)
		}
	} else {
		result = heuristicResult
	}

	// Store in history
	r.history = append(r.history, result)

	// Add metrics
	result.Metrics["reflection_duration_ms"] = time.Since(startTime).Milliseconds()
	result.Metrics["total_observations"] = len(observations)
	result.Metrics["plan_steps"] = len(plan.Steps)

	logger.InfoCF("reflector", "Reflection complete", map[string]any{
		"is_success":      result.IsSuccess,
		"confidence":      result.Confidence,
		"goal_achieved":   result.GoalAchieved,
		"next_actions":    len(result.NextActions),
		"lessons_learned": len(result.LessonsLearned),
	})

	return result
}

// heuristicReflect performs rule-based evaluation.
func (r *Reflector) heuristicReflect(
	goal string,
	plan *planner.ExecutionPlan,
	observations []*observer.Observation,
) *ReflectionResult {

	result := &ReflectionResult{
		Timestamp: time.Now(),
		Metrics:   make(map[string]any),
	}

	// Calculate success metrics
	totalObs := len(observations)
	if totalObs == 0 {
		result.IsSuccess = false
		result.Confidence = 0.5
		result.Reasoning = "No observations to evaluate"
		return result
	}

	successfulObs := 0
	errorObs := 0
	for _, obs := range observations {
		if obs.IsError {
			errorObs++
		} else {
			successfulObs++
		}
	}

	successRate := float64(successfulObs) / float64(totalObs)
	result.Metrics["success_rate"] = successRate
	result.Metrics["error_count"] = errorObs

	// Determine goal achievement
	result.GoalAchieved = plan.IsComplete && successRate >= r.config.MinConfidence
	result.PartialProgress = plan.CurrentStepIdx > 0 && !plan.IsComplete

	// Calculate overall confidence
	result.Confidence = successRate
	if result.PartialProgress {
		result.Confidence *= 0.8 // Reduce confidence for incomplete plans
	}
	if errorObs > totalObs/2 {
		result.Confidence *= 0.5 // Penalize high error rate
	}

	result.IsSuccess = result.Confidence >= r.config.MinConfidence

	// Build reasoning
	var reasoning strings.Builder
	reasoning.WriteString(fmt.Sprintf("Executed %d/%d steps. ", plan.CurrentStepIdx, len(plan.Steps)))
	reasoning.WriteString(fmt.Sprintf("Success rate: %.0f%%. ", successRate*100))

	if result.GoalAchieved {
		reasoning.WriteString("Goal appears to be achieved based on completion and success metrics.")
	} else if result.PartialProgress {
		reasoning.WriteString("Partial progress made but goal not fully achieved.")
	} else {
		reasoning.WriteString("Goal not achieved. ")
		if errorObs > 0 {
			reasoning.WriteString(fmt.Sprintf("%d errors encountered. ", errorObs))
		}
	}

	result.Reasoning = reasoning.String()

	// Determine next actions
	if !result.GoalAchieved {
		result.NextActions = r.determineNextActions(plan, observations)
	}

	// Extract lessons learned
	if r.config.EnableLessonsLearned {
		result.LessonsLearned = r.extractLessons(observations)
	}

	return result
}

// llmReflect uses LLM for deeper analysis.
func (r *Reflector) llmReflect(
	ctx context.Context,
	goal string,
	plan *planner.ExecutionPlan,
	observations []*observer.Observation,
	heuristicResult *ReflectionResult,
) *ReflectionResult {

	// Build reflection prompt
	systemPrompt := `You are a reflective AI assistant. Evaluate the execution of a plan and provide insights.

Analyze:
1. Was the goal achieved?
2. What went well?
3. What went wrong?
4. What should be done next?
5. What lessons can be learned?

Respond with JSON in this format:
{
  "goal_achieved": true,
  "confidence": 0.85,
  "reasoning": "Brief explanation",
  "next_actions": ["action1", "action2"],
  "lessons_learned": ["lesson1", "lesson2"]
}`

	// Build context from observations
	var obsContext strings.Builder
	obsContext.WriteString(fmt.Sprintf("Goal: %s\n\n", goal))
	obsContext.WriteString("Execution Summary:\n")
	obsContext.WriteString(fmt.Sprintf("- Steps completed: %d/%d\n", plan.CurrentStepIdx, len(plan.Steps)))
	obsContext.WriteString(fmt.Sprintf("- Plan complete: %v\n\n", plan.IsComplete))

	obsContext.WriteString("Observations:\n")
	for i, obs := range observations {
		status := "success"
		if obs.IsError {
			status = "error"
		}
		obsContext.WriteString(fmt.Sprintf("%d. [%s] %s: %s\n", i+1, status, obs.StepID, truncate(obs.Normalized, 200)))
	}

	messages := []providers.Message{
		{Role: "system", Content: systemPrompt},
		{Role: "user", Content: obsContext.String()},
	}

	// Call LLM
	response, err := r.provider.Chat(ctx, messages, nil, r.config.Model, nil)
	if err != nil {
		logger.ErrorCF("reflector", "LLM reflection failed", map[string]any{
			"error": err.Error(),
		})
		// Return heuristic result with LLM failure noted
		heuristicResult.Reasoning += "\n[LLM reflection unavailable]"
		return heuristicResult
	}

	// Parse response
	var llmResponse struct {
		GoalAchieved   bool     `json:"goal_achieved"`
		Confidence     float64  `json:"confidence"`
		Reasoning      string   `json:"reasoning"`
		NextActions    []string `json:"next_actions"`
		LessonsLearned []string `json:"lessons_learned"`
	}

	if err := parseJSONResponse(response.Content, &llmResponse); err != nil {
		logger.ErrorCF("reflector", "Failed to parse LLM reflection", map[string]any{
			"error": err.Error(),
		})
		return heuristicResult
	}

	return &ReflectionResult{
		IsSuccess:       llmResponse.Confidence >= r.config.MinConfidence,
		Confidence:      llmResponse.Confidence,
		Reasoning:       llmResponse.Reasoning,
		GoalAchieved:    llmResponse.GoalAchieved,
		PartialProgress: !llmResponse.GoalAchieved && plan.CurrentStepIdx > 0,
		NextActions:     llmResponse.NextActions,
		LessonsLearned:  llmResponse.LessonsLearned,
		Timestamp:       time.Now(),
		Metrics:         make(map[string]any),
	}
}

// determineNextActions suggests next steps based on current state.
func (r *Reflector) determineNextActions(
	plan *planner.ExecutionPlan,
	observations []*observer.Observation,
) []string {

	actions := make([]string, 0)

	// Check for failed steps that can be retried
	for i := plan.CurrentStepIdx; i < len(plan.Steps); i++ {
		step := &plan.Steps[i]
		if step.State == planner.PlanStateFailed && plan.CanRetry(i) {
			actions = append(actions, fmt.Sprintf("Retry step %s with adjusted parameters", step.ID))
		}
	}

	// Check for error patterns
	errorPatterns := make(map[string]int)
	for _, obs := range observations {
		if obs.IsError {
			// Categorize error
			if strings.Contains(strings.ToLower(obs.ErrorMessage), "timeout") {
				errorPatterns["timeout"]++
			} else if strings.Contains(strings.ToLower(obs.ErrorMessage), "permission") {
				errorPatterns["permission"]++
			} else if strings.Contains(strings.ToLower(obs.ErrorMessage), "not found") {
				errorPatterns["not_found"]++
			}
		}
	}

	// Add remediation actions
	if errorPatterns["timeout"] > 0 {
		actions = append(actions, "Increase timeout for slow operations")
	}
	if errorPatterns["permission"] > 0 {
		actions = append(actions, "Check permissions and credentials")
	}
	if errorPatterns["not_found"] > 0 {
		actions = append(actions, "Verify paths and resource names")
	}

	// If plan incomplete, suggest continuing
	if !plan.IsComplete && plan.CurrentStepIdx < len(plan.Steps) {
		remaining := len(plan.Steps) - plan.CurrentStepIdx
		actions = append(actions, fmt.Sprintf("Continue with remaining %d steps", remaining))
	}

	return actions
}

// extractLessons derives lessons from observations.
func (r *Reflector) extractLessons(observations []*observer.Observation) []string {
	lessons := make([]string, 0)

	// Analyze error patterns
	errorCount := 0
	for _, obs := range observations {
		if obs.IsError {
			errorCount++
		}
	}

	if errorCount > 0 {
		total := len(observations)
		errorRate := float64(errorCount) / float64(total) * 100
		lessons = append(lessons, fmt.Sprintf("Error rate was %.0f%% - consider improving error handling", errorRate))
	}

	// Check for slow operations
	for _, obs := range observations {
		if obs.Duration > 5*time.Second {
			lessons = append(lessons, fmt.Sprintf("Operation %s took %v - consider optimization", obs.StepID, obs.Duration))
			break // Only report first slow operation
		}
	}

	// Check for low confidence observations
	lowConfidence := 0
	for _, obs := range observations {
		if obs.Confidence < 0.5 {
			lowConfidence++
		}
	}
	if lowConfidence > 0 {
		lessons = append(lessons, fmt.Sprintf("%d observations had low confidence - verify data quality", lowConfidence))
	}

	return lessons
}

// GetReflectionHistory returns past reflections.
func (r *Reflector) GetReflectionHistory() []*ReflectionResult {
	result := make([]*ReflectionResult, len(r.history))
	copy(result, r.history)
	return result
}

// GetLastReflection returns the most recent reflection.
func (r *Reflector) GetLastReflection() *ReflectionResult {
	if len(r.history) == 0 {
		return nil
	}
	return r.history[len(r.history)-1]
}

// ClearHistory clears reflection history.
func (r *Reflector) ClearHistory() {
	r.history = make([]*ReflectionResult, 0)
}

// Helper functions

func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}

// parseJSONResponse parses a JSON response from LLM.
func parseJSONResponse(content string, target any) error {
	// Try direct parse first
	content = strings.TrimSpace(content)
	
	// Remove markdown code blocks if present
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimPrefix(content, "```")
	content = strings.TrimSuffix(content, "```")
	content = strings.TrimSpace(content)

	// Use json.Unmarshal to parse
	return json.Unmarshal([]byte(content), target)
}
