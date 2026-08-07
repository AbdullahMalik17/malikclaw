package supervisor

import (
	"context"
	"fmt"
	"sync"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

// TaskStatus represents the lifecycle of a single subtask in a DAG.
type TaskStatus string

const (
	TaskStatusPending   TaskStatus = "pending"
	TaskStatusRunning   TaskStatus = "running"
	TaskStatusCompleted TaskStatus = "completed"
	TaskStatusFailed    TaskStatus = "failed"
)

// DAGNode wraps an agent.SubTask for execution tracking.
type DAGNode struct {
	Task      agent.SubTask
	Status    TaskStatus
	Result    string
	Err       error
	DependsOn map[string]bool
}

// DAGScheduler manages concurrent task execution with dependency enforcement.
type DAGScheduler struct {
	nodes map[string]*DAGNode
	mu    sync.Mutex
}

// NewDAGScheduler constructs a scheduler for a set of subtasks.
func NewDAGScheduler(subtasks []agent.SubTask) (*DAGScheduler, error) {
	nodes := make(map[string]*DAGNode, len(subtasks))
	for _, st := range subtasks {
		deps := make(map[string]bool, len(st.DependsOn))
		for _, dep := range st.DependsOn {
			deps[dep] = true
		}
		nodes[st.TaskID] = &DAGNode{
			Task:      st,
			Status:    TaskStatusPending,
			DependsOn: deps,
		}
	}

	scheduler := &DAGScheduler{nodes: nodes}
	if err := scheduler.validateDAG(); err != nil {
		return nil, err
	}
	return scheduler, nil
}

// validateDAG checks for missing dependencies and cyclic references.
func (s *DAGScheduler) validateDAG() error {
	for id, node := range s.nodes {
		for dep := range node.DependsOn {
			if _, exists := s.nodes[dep]; !exists {
				return fmt.Errorf("task %q depends on non-existent task %q", id, dep)
			}
		}
	}

	visited := make(map[string]int) // 0: unvisited, 1: visiting, 2: visited
	var visit func(id string) error
	visit = func(id string) error {
		visited[id] = 1
		for dep := range s.nodes[id].DependsOn {
			if visited[dep] == 1 {
				return fmt.Errorf("cyclic dependency detected involving task %q -> %q", id, dep)
			}
			if visited[dep] == 0 {
				if err := visit(dep); err != nil {
					return err
				}
			}
		}
		visited[id] = 2
		return nil
	}

	for id := range s.nodes {
		if visited[id] == 0 {
			if err := visit(id); err != nil {
				return err
			}
		}
	}
	return nil
}

// Execute runs all tasks in the DAG concurrently, respecting dependencies.
func (s *DAGScheduler) Execute(
	ctx context.Context,
	workerFn func(ctx context.Context, task agent.SubTask, depResults map[string]string) (string, error),
) (map[string]string, error) {
	results := make(map[string]string)
	var wg sync.WaitGroup

	errChan := make(chan error, len(s.nodes))
	doneChan := make(chan string, len(s.nodes))

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Helper to find executable tasks
	getReadyNodes := func() []*DAGNode {
		s.mu.Lock()
		defer s.mu.Unlock()

		var ready []*DAGNode
		for _, node := range s.nodes {
			if node.Status != TaskStatusPending {
				continue
			}

			// Check if all dependencies are completed
			depsMet := true
			for dep := range node.DependsOn {
				if depNode, ok := s.nodes[dep]; !ok || depNode.Status != TaskStatusCompleted {
					depsMet = false
					break
				}
			}

			if depsMet {
				node.Status = TaskStatusRunning
				ready = append(ready, node)
			}
		}
		return ready
	}

	dispatchReady := func() {
		ready := getReadyNodes()
		for _, node := range ready {
			wg.Add(1)
			go func(n *DAGNode) {
				defer wg.Done()

				// Gather results of dependencies
				s.mu.Lock()
				depResults := make(map[string]string)
				for dep := range n.DependsOn {
					depResults[dep] = s.nodes[dep].Result
				}
				s.mu.Unlock()

				logger.InfoCF("supervisor", "Executing subtask", map[string]any{"task_id": n.Task.TaskID, "role": n.Task.Role})

				res, err := workerFn(ctx, n.Task, depResults)

				s.mu.Lock()
				if err != nil {
					n.Status = TaskStatusFailed
					n.Err = err
					s.mu.Unlock()
					errChan <- fmt.Errorf("task %q failed: %w", n.Task.TaskID, err)
					return
				}

				n.Status = TaskStatusCompleted
				n.Result = res
				s.mu.Unlock()

				doneChan <- n.Task.TaskID
			}(node)
		}
	}

	// Initial dispatch
	dispatchReady()

	completedCount := 0
	totalTasks := len(s.nodes)

	for completedCount < totalTasks {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case err := <-errChan:
			cancel()
			return nil, err
		case taskID := <-doneChan:
			completedCount++
			s.mu.Lock()
			results[taskID] = s.nodes[taskID].Result
			s.mu.Unlock()

			// Check if new tasks are unblocked
			dispatchReady()
		}
	}

	wg.Wait()
	return results, nil
}
