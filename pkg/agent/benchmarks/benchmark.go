// MalikClaw - Ultra-lightweight personal AI agent
// Agent Performance Benchmarking and Metrics
// License: MIT

package benchmarks

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"sync"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/eval"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

// ExecutionMetrics tracks performance data for a single execution
type ExecutionMetrics struct {
	TaskID        string                 `json:"task_id"`
	StartTime     time.Time              `json:"start_time"`
	EndTime       time.Time              `json:"end_time"`
	Duration      time.Duration          `json:"duration"`
	MessageCount  int                    `json:"message_count"`
	TokenCount    int                    `json:"token_count"`
	ToolCalls     int                    `json:"tool_calls"`
	Errors        int                    `json:"errors"`
	Iteration     int                    `json:"iteration"`
	Evaluation    *eval.EvaluationResult `json:"evaluation,omitempty"`
	Success       bool                   `json:"success"`

	// Memory metrics
	StartAlloc uint64 `json:"start_alloc_bytes"`
	EndAlloc   uint64 `json:"end_alloc_bytes"`
	AllocDiff  int64  `json:"alloc_diff_bytes"`

	// Resource metrics
	NumGoroutines int `json:"num_goroutines"`
}

// BenchmarkResult aggregates metrics across multiple executions
type BenchmarkResult struct {
	TotalExecutions     int           `json:"total_executions"`
	SuccessfulCount     int           `json:"successful_count"`
	FailedCount         int           `json:"failed_count"`
	SuccessRate         float64       `json:"success_rate"`
	AverageDuration     time.Duration `json:"average_duration"`
	AverageMessageCount float64       `json:"average_message_count"`
	AverageTokenCount   float64       `json:"average_token_count"`
	AverageToolCalls    float64       `json:"average_tool_calls"`
	TotalTokens         int           `json:"total_tokens"`
	MinDuration         time.Duration `json:"min_duration"`
	MaxDuration         time.Duration `json:"max_duration"`
	AverageScore        float64       `json:"average_score"`
	AverageAllocDiff    float64       `json:"average_alloc_diff"`
}

// Benchmark tracks and analyzes agent performance
type Benchmark struct {
	mu          sync.RWMutex
	executions  []ExecutionMetrics
	ctx         context.Context
	maxExecSize int    // Maximum number of executions to keep in memory
	exportPath  string // Path to auto-save results
}

// NewBenchmark creates a new benchmark tracker
func NewBenchmark(ctx context.Context, maxExecSize int) *Benchmark {
	if maxExecSize <= 0 {
		maxExecSize = 1000
	}
	home, _ := os.UserHomeDir()
	path := filepath.Join(home, ".malikclaw", "benchmarks", "results.json")

	return &Benchmark{
		ctx:         ctx,
		executions:  make([]ExecutionMetrics, 0, maxExecSize),
		maxExecSize: maxExecSize,
		exportPath:  path,
	}
}

// StartExecution returns initial metrics for a new task
func (b *Benchmark) StartExecution(taskID string) ExecutionMetrics {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return ExecutionMetrics{
		TaskID:        taskID,
		StartTime:     time.Now(),
		StartAlloc:    m.Alloc,
		NumGoroutines: runtime.NumGoroutine(),
	}
}

// RecordExecution records metrics for a single execution
func (b *Benchmark) RecordExecution(metrics ExecutionMetrics) error {
	if metrics.TaskID == "" {
		return fmt.Errorf("task_id required")
	}

	b.mu.Lock()
	defer b.mu.Unlock()

	// Capture end state if not already set
	if metrics.EndTime.IsZero() {
		metrics.EndTime = time.Now()
	}

	// Calculate duration if not set
	if metrics.Duration == 0 && !metrics.EndTime.IsZero() && !metrics.StartTime.IsZero() {
		metrics.Duration = metrics.EndTime.Sub(metrics.StartTime)
	}

	// Capture end memory if not set
	if metrics.EndAlloc == 0 {
		var m runtime.MemStats
		runtime.ReadMemStats(&m)
		metrics.EndAlloc = m.Alloc
		metrics.AllocDiff = int64(metrics.EndAlloc) - int64(metrics.StartAlloc)
	}

	// Determine success based on evaluation if present
	if metrics.Evaluation != nil {
		metrics.Success = metrics.Evaluation.Success || metrics.Evaluation.SuccessScore >= 0.8
	}

	b.executions = append(b.executions, metrics)

	// Keep only recent executions if size exceeds limit
	if len(b.executions) > b.maxExecSize {
		b.executions = b.executions[len(b.executions)-b.maxExecSize:]
	}

	logger.InfoCF("benchmarks", fmt.Sprintf("Recorded execution: %s (%.2fs, success: %v)",
		metrics.TaskID, metrics.Duration.Seconds(), metrics.Success),
		map[string]any{
			"task_id":        metrics.TaskID,
			"duration_ms":    metrics.Duration.Milliseconds(),
			"message_count":  metrics.MessageCount,
			"token_count":    metrics.TokenCount,
			"alloc_diff":     metrics.AllocDiff,
			"goroutines":     metrics.NumGoroutines,
		})

	// Auto-save to disk
	data, err := json.MarshalIndent(b.executions, "", "  ")
	if err != nil {
		return err
	}

	dir := filepath.Dir(b.exportPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	return os.WriteFile(b.exportPath, data, 0644)
}

// ExportJSON saves all benchmark results to a JSON file.
func (b *Benchmark) ExportJSON(path string) error {
	b.mu.RLock()
	defer b.mu.RUnlock()

	if path == "" {
		home, _ := os.UserHomeDir()
		path = filepath.Join(home, ".malikclaw", "benchmarks", "results.json")
	}

	data, err := json.MarshalIndent(b.executions, "", "  ")
	if err != nil {
		return err
	}

	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

// GenerateReport creates a human-readable summary of the benchmark results.
func (b *Benchmark) GenerateReport() string {
	res := b.GetResult()
	if res.TotalExecutions == 0 {
		return "No benchmark data available."
	}

	report := fmt.Sprintf("MalikClaw Benchmark Report\n")
	report += fmt.Sprintf("==========================\n")
	report += fmt.Sprintf("Total Tasks:        %d\n", res.TotalExecutions)
	report += fmt.Sprintf("Success Rate:       %.2f%%\n", res.SuccessRate*100)
	report += fmt.Sprintf("Avg Duration:       %.2fs\n", res.AverageDuration.Seconds())
	report += fmt.Sprintf("Min/Max Duration:   %.2fs / %.2fs\n", res.MinDuration.Seconds(), res.MaxDuration.Seconds())
	report += fmt.Sprintf("Avg Memory Diff:    %s\n", formatBytes(res.AverageAllocDiff))
	report += fmt.Sprintf("Avg Tokens:         %.1f\n", res.AverageTokenCount)
	report += fmt.Sprintf("Avg Tool Calls:     %.1f\n", res.AverageToolCalls)
	report += fmt.Sprintf("Average Score:      %.2f\n", res.AverageScore)

	return report
}

func formatBytes(b float64) string {
	const unit = 1024
	if b < 0 {
		return fmt.Sprintf("- %s", formatBytes(-b))
	}
	if b < unit {
		return fmt.Sprintf("%.2f B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.2f %cB", b/float64(div), "KMGTPE"[exp])
}

// ImportJSON loads benchmark results from a JSON file.
func (b *Benchmark) ImportJSON(path string) error {
	if path == "" {
		home, _ := os.UserHomeDir()
		path = filepath.Join(home, ".malikclaw", "benchmarks", "results.json")
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	var results []ExecutionMetrics
	if err := json.Unmarshal(data, &results); err != nil {
		return err
	}

	b.mu.Lock()
	b.executions = results
	b.mu.Unlock()

	return nil
}

// GetResult calculates aggregated metrics
func (b *Benchmark) GetResult() *BenchmarkResult {
	b.mu.RLock()
	defer b.mu.RUnlock()

	if len(b.executions) == 0 {
		return &BenchmarkResult{}
	}

	result := &BenchmarkResult{
		TotalExecutions: len(b.executions),
	}

	var (
		totalDuration     time.Duration
		totalMessageCount float64
		totalTokenCount   int
		totalToolCalls    float64
		totalAllocDiff    float64
		scoreSum          float64
		minDuration       = time.Duration(1<<63 - 1)
		maxDuration       time.Duration
	)

	for _, exec := range b.executions {
		if exec.Success {
			result.SuccessfulCount++
		} else {
			result.FailedCount++
		}

		totalDuration += exec.Duration
		totalMessageCount += float64(exec.MessageCount)
		totalTokenCount += exec.TokenCount
		totalToolCalls += float64(exec.ToolCalls)
		totalAllocDiff += float64(exec.AllocDiff)

		if exec.Duration < minDuration {
			minDuration = exec.Duration
		}
		if exec.Duration > maxDuration {
			maxDuration = exec.Duration
		}

		if exec.Evaluation != nil {
			scoreSum += exec.Evaluation.SuccessScore
		}
	}

	result.SuccessRate = float64(result.SuccessfulCount) / float64(result.TotalExecutions)
	result.AverageDuration = time.Duration(int64(totalDuration) / int64(result.TotalExecutions))
	result.AverageMessageCount = totalMessageCount / float64(result.TotalExecutions)
	result.AverageTokenCount = float64(totalTokenCount) / float64(result.TotalExecutions)
	result.AverageToolCalls = totalToolCalls / float64(result.TotalExecutions)
	result.TotalTokens = totalTokenCount
	result.MinDuration = minDuration
	result.MaxDuration = maxDuration
	result.AverageAllocDiff = totalAllocDiff / float64(result.TotalExecutions)

	if result.SuccessfulCount > 0 {
		result.AverageScore = scoreSum / float64(result.SuccessfulCount)
	}

	if minDuration == time.Duration(1<<63-1) {
		result.MinDuration = 0
	}

	return result
}

// GetExecutions returns all recorded executions (for analysis)
func (b *Benchmark) GetExecutions() []ExecutionMetrics {
	b.mu.RLock()
	defer b.mu.RUnlock()

	// Return a copy
	executions := make([]ExecutionMetrics, len(b.executions))
	copy(executions, b.executions)
	return executions
}

// GetRecentExecutions returns the last N executions
func (b *Benchmark) GetRecentExecutions(n int) []ExecutionMetrics {
	b.mu.RLock()
	defer b.mu.RUnlock()

	if n <= 0 || n > len(b.executions) {
		n = len(b.executions)
	}

	executions := make([]ExecutionMetrics, n)
	copy(executions, b.executions[len(b.executions)-n:])
	return executions
}

// Clear resets all recorded executions
func (b *Benchmark) Clear() {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.executions = make([]ExecutionMetrics, 0, b.maxExecSize)
}

// GetCount returns the number of recorded executions
func (b *Benchmark) GetCount() int {
	b.mu.RLock()
	defer b.mu.RUnlock()
	return len(b.executions)
}

// FindByTaskID finds executions matching a task ID
func (b *Benchmark) FindByTaskID(taskID string) []ExecutionMetrics {
	b.mu.RLock()
	defer b.mu.RUnlock()

	var matches []ExecutionMetrics
	for _, exec := range b.executions {
		if exec.TaskID == taskID {
			matches = append(matches, exec)
		}
	}
	return matches
}

// AnalyzeTrend analyzes success rate trends over time
func (b *Benchmark) AnalyzeTrend(windowSize int) []float64 {
	b.mu.RLock()
	defer b.mu.RUnlock()

	if len(b.executions) == 0 || windowSize <= 0 {
		return []float64{}
	}

	var trends []float64
	for i := windowSize; i <= len(b.executions); i++ {
		window := b.executions[i-windowSize : i]
		successCount := 0
		for _, exec := range window {
			if exec.Success {
				successCount++
			}
		}
		trends = append(trends, float64(successCount)/float64(windowSize))
	}

	return trends
}
