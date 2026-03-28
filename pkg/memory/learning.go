package memory

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/eval"
)

// LearningStore provides persistence for agent evaluations to enable learning over time.
type LearningStore interface {
	RecordEvaluation(ctx context.Context, result *eval.EvaluationResult) error
	GetRecentLearnings(ctx context.Context, limit int) ([]eval.EvaluationResult, error)
	GetCumulativeSuccessRate(ctx context.Context) (float64, error)
	Close() error
}

type JSONLLearningStore struct {
	mu   sync.Mutex
	path string
}

func NewJSONLLearningStore(workspacePath string) (*JSONLLearningStore, error) {
	err := os.MkdirAll(workspacePath, 0755)
	if err != nil {
		return nil, fmt.Errorf("learning store: create directory: %w", err)
	}
	funcPath := filepath.Join(workspacePath, "learning.jsonl")
	return &JSONLLearningStore{path: funcPath}, nil
}

func (s *JSONLLearningStore) RecordEvaluation(ctx context.Context, result *eval.EvaluationResult) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.OpenFile(s.path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return fmt.Errorf("learning store: open file: %w", err)
	}
	defer f.Close()

	line, err := json.Marshal(result)
	if err != nil {
		return fmt.Errorf("learning store: marshal: %w", err)
	}
	line = append(line, '\n')

	if _, err := f.Write(line); err != nil {
		return fmt.Errorf("learning store: write: %w", err)
	}
	if err := f.Sync(); err != nil {
		return fmt.Errorf("learning store: sync: %w", err)
	}

	return nil
}

func (s *JSONLLearningStore) GetRecentLearnings(ctx context.Context, limit int) ([]eval.EvaluationResult, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.Open(s.path)
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("learning store: open file: %w", err)
	}
	defer f.Close()

	var all []eval.EvaluationResult
	scanner := bufio.NewScanner(f)
	// We read all then take last N because it's append-only and potentially small.
	for scanner.Scan() {
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}
		var res eval.EvaluationResult
		if err := json.Unmarshal(line, &res); err == nil {
			all = append(all, res)
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("learning store: scan: %w", err)
	}

	if limit > 0 && len(all) > limit {
		return all[len(all)-limit:], nil
	}
	return all, nil
}

func (s *JSONLLearningStore) GetCumulativeSuccessRate(ctx context.Context) (float64, error) {
	// calculate simple average reward
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.Open(s.path)
	if os.IsNotExist(err) {
		return 0.0, nil
	}
	if err != nil {
		return 0.0, fmt.Errorf("learning store: open file: %w", err)
	}
	defer f.Close()

	var totalScore float64
	var count int
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}
		var res eval.EvaluationResult
		if err := json.Unmarshal(line, &res); err == nil {
			totalScore += res.SuccessScore
			count++
		}
	}

	if count == 0 {
		return 0.0, nil
	}
	return totalScore / float64(count), nil
}

func (s *JSONLLearningStore) Close() error {
	return nil
}
