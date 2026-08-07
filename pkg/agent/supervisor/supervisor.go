package supervisor

import (
	"context"
	"fmt"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
)

type MultiAgentSupervisor struct {
	factory agent.AgentFactory
	team    *TeamConfig
}

func NewMultiAgentSupervisor(factory agent.AgentFactory) *MultiAgentSupervisor {
	return &MultiAgentSupervisor{
		factory: factory,
		team:    NewSoftwareDevTeam(),
	}
}

func NewMultiAgentSupervisorWithTeam(factory agent.AgentFactory, team *TeamConfig) *MultiAgentSupervisor {
	return &MultiAgentSupervisor{
		factory: factory,
		team:    team,
	}
}

func (s *MultiAgentSupervisor) Dispatch(ctx context.Context, goal string) (*agent.SupervisorEpisode, error) {
	episodeID := fmt.Sprintf("ep-%d", len(goal)*1337%1000000)

	// Create dynamic DAG subtasks based on team roles
	subtasks := []agent.SubTask{
		{
			TaskID:      "t1-research",
			Role:        "researcher",
			Description: "Gather requirements, existing codebase context, and technical docs for: " + goal,
		},
		{
			TaskID:      "t2-architecture",
			Role:        "architect",
			Description: "Design technical approach and code structure based on research findings",
			DependsOn:   []string{"t1-research"},
		},
		{
			TaskID:      "t3-engineering",
			Role:        "engineer",
			Description: "Implement code changes and unit tests according to the architectural design",
			DependsOn:   []string{"t2-architecture"},
		},
		{
			TaskID:      "t4-qa-audit",
			Role:        "qa",
			Description: "Audit code implementation for correctness, edge cases, and security vulnerabilities",
			DependsOn:   []string{"t3-engineering"},
		},
		{
			TaskID:      "t5-communicate",
			Role:        "communicator",
			Description: "Summarize final outcomes, features added, and verification results",
			DependsOn:   []string{"t4-qa-audit"},
		},
	}

	return &agent.SupervisorEpisode{
		EpisodeID:   episodeID,
		Goal:        goal,
		CEOProvider: "supervisor-lead",
		SubTasks:    subtasks,
		Consensus: agent.ConsensusRules{
			RequireUnanimous: false,
			MaxDebateRounds:  3,
		},
	}, nil
}

// ExecuteEpisode runs the episode's subtasks in DAG order using workerFn.
func (s *MultiAgentSupervisor) ExecuteEpisode(
	ctx context.Context,
	ep *agent.SupervisorEpisode,
	workerFn func(ctx context.Context, task agent.SubTask, depResults map[string]string) (string, error),
) (map[string]string, error) {
	scheduler, err := NewDAGScheduler(ep.SubTasks)
	if err != nil {
		return nil, fmt.Errorf("failed to construct DAG scheduler: %w", err)
	}

	return scheduler.Execute(ctx, workerFn)
}

func (s *MultiAgentSupervisor) Aggregate(ctx context.Context, ep *agent.SupervisorEpisode, results map[string]string) (string, error) {
	var final string
	final = fmt.Sprintf("### Multi-Agent Team Execution Summary\n**Goal**: %s\n\n", ep.Goal)

	for _, task := range ep.SubTasks {
		res, ok := results[task.TaskID]
		if !ok {
			res = "*(Not executed)*"
		}
		roleTitle := task.Role
		if roleDef, err := s.team.GetRole(task.Role); err == nil {
			roleTitle = roleDef.Name
		}

		final += fmt.Sprintf("#### Task `%s` [%s]\n**Description**: %s\n\n%s\n\n---\n\n", task.TaskID, roleTitle, task.Description, res)
	}

	return final, nil
}
