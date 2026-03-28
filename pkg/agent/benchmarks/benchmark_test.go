package benchmarks

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestBenchmark(t *testing.T) {
	b := NewBenchmark(context.Background(), 10)
	
	// Create a temp file for testing export/import
	tmpFile := "test_results.json"
	defer os.Remove(tmpFile)
	b.exportPath = tmpFile

	// Start and record an execution
	metrics := b.StartExecution("test-task")
	time.Sleep(10 * time.Millisecond) // Ensure duration > 0
	metrics.Success = true
	metrics.MessageCount = 5
	metrics.TokenCount = 100
	
	err := b.RecordExecution(metrics)
	assert.NoError(t, err)
	
	// Verify metrics were recorded
	assert.Equal(t, 1, b.GetCount())
	results := b.GetResult()
	assert.Equal(t, 1, results.TotalExecutions)
	assert.Equal(t, float64(100), results.SuccessRate * 100)
	assert.Equal(t, 100, results.TotalTokens)
	assert.Greater(t, results.AverageDuration, time.Duration(0))

	// Verify auto-save
	_, err = os.Stat(tmpFile)
	assert.NoError(t, err)

	// Test ImportJSON
	b2 := NewBenchmark(context.Background(), 10)
	err = b2.ImportJSON(tmpFile)
	assert.NoError(t, err)
	assert.Equal(t, 1, b2.GetCount())
	
	// Test GenerateReport
	report := b.GenerateReport()
	assert.Contains(t, report, "MalikClaw Benchmark Report")
	assert.Contains(t, report, "Total Tasks:        1")
}
