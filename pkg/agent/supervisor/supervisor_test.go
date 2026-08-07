package supervisor

import (
	"context"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
)

func TestDAGScheduler_ValidDAG(t *testing.T) {
	subtasks := []agent.SubTask{
		{TaskID: "t1", Role: "researcher", Description: "Research"},
		{TaskID: "t2", Role: "architect", Description: "Design", DependsOn: []string{"t1"}},
		{TaskID: "t3", Role: "engineer", Description: "Code", DependsOn: []string{"t2"}},
	}

	scheduler, err := NewDAGScheduler(subtasks)
	if err != nil {
		t.Fatalf("unexpected error creating scheduler: %v", err)
	}

	var executionOrder []string
	results, err := scheduler.Execute(context.Background(), func(ctx context.Context, st agent.SubTask, depResults map[string]string) (string, error) {
		executionOrder = append(executionOrder, st.TaskID)
		return "done:" + st.TaskID, nil
	})

	if err != nil {
		t.Fatalf("unexpected error during execution: %v", err)
	}

	if len(results) != 3 {
		t.Errorf("expected 3 results, got %d", len(results))
	}

	if results["t1"] != "done:t1" || results["t2"] != "done:t2" || results["t3"] != "done:t3" {
		t.Errorf("incorrect task results: %v", results)
	}
}

func TestDAGScheduler_ParallelBranching(t *testing.T) {
	// t1 -> (t2a, t2b) -> t3
	subtasks := []agent.SubTask{
		{TaskID: "t1", Description: "Start"},
		{TaskID: "t2a", Description: "Branch A", DependsOn: []string{"t1"}},
		{TaskID: "t2b", Description: "Branch B", DependsOn: []string{"t1"}},
		{TaskID: "t3", Description: "Merge", DependsOn: []string{"t2a", "t2b"}},
	}

	scheduler, err := NewDAGScheduler(subtasks)
	if err != nil {
		t.Fatalf("failed to create scheduler: %v", err)
	}

	var activeWorkers int32
	var maxParallel int32

	results, err := scheduler.Execute(context.Background(), func(ctx context.Context, st agent.SubTask, depResults map[string]string) (string, error) {
		cur := atomic.AddInt32(&activeWorkers, 1)
		for {
			oldMax := atomic.LoadInt32(&maxParallel)
			if cur <= oldMax || atomic.CompareAndSwapInt32(&maxParallel, oldMax, cur) {
				break
			}
		}

		time.Sleep(10 * time.Millisecond)
		atomic.AddInt32(&activeWorkers, -1)
		return "ok", nil
	})

	if err != nil {
		t.Fatalf("execution error: %v", err)
	}

	if len(results) != 4 {
		t.Errorf("expected 4 results, got %d", len(results))
	}

	if maxParallel < 2 {
		t.Errorf("expected parallel execution of branches, maxParallel was %d", maxParallel)
	}
}

func TestDAGScheduler_CyclicDependency(t *testing.T) {
	subtasks := []agent.SubTask{
		{TaskID: "t1", DependsOn: []string{"t2"}},
		{TaskID: "t2", DependsOn: []string{"t1"}},
	}

	_, err := NewDAGScheduler(subtasks)
	if err == nil {
		t.Fatal("expected error for cyclic dependency, got nil")
	}
	if !strings.Contains(err.Error(), "cyclic dependency") {
		t.Errorf("expected cyclic dependency error, got %v", err)
	}
}

func TestMultiAgentSupervisor_DispatchAndAggregate(t *testing.T) {
	sup := NewMultiAgentSupervisor(nil)
	ep, err := sup.Dispatch(context.Background(), "Add OAuth support")
	if err != nil {
		t.Fatalf("Dispatch failed: %v", err)
	}

	if len(ep.SubTasks) != 5 {
		t.Fatalf("expected 5 subtasks, got %d", len(ep.SubTasks))
	}

	results, err := sup.ExecuteEpisode(context.Background(), ep, func(ctx context.Context, st agent.SubTask, depResults map[string]string) (string, error) {
		return "Completed: " + st.Description, nil
	})
	if err != nil {
		t.Fatalf("ExecuteEpisode failed: %v", err)
	}

	summary, err := sup.Aggregate(context.Background(), ep, results)
	if err != nil {
		t.Fatalf("Aggregate failed: %v", err)
	}

	if !strings.Contains(summary, "Add OAuth support") || !strings.Contains(summary, "Chief Software Architect") {
		t.Errorf("summary missing expected contents: %s", summary)
	}
}

func TestSkillsInnovationTeam(t *testing.T) {
	team := NewSkillsInnovationTeam()
	if len(team.Roles) != 5 {
		t.Errorf("expected 5 roles in skills innovation team, got %d", len(team.Roles))
	}
	role, err := team.GetRole("skill-architect")
	if err != nil {
		t.Fatalf("expected to find role skill-architect, got err: %v", err)
	}
	if role.Name != "Skills Systems Architect" {
		t.Errorf("unexpected role name: %s", role.Name)
	}
}

func TestLargeCodebaseTeam(t *testing.T) {
	team := NewLargeCodebaseTeam()
	if len(team.Roles) != 5 {
		t.Errorf("expected 5 roles in large codebase team, got %d", len(team.Roles))
	}
	role, err := team.GetRole("dir-navigator")
	if err != nil {
		t.Fatalf("expected to find role dir-navigator, got err: %v", err)
	}
	if role.Name != "Codebase Directory Navigator & Mapper" {
		t.Errorf("unexpected role name: %s", role.Name)
	}
}
