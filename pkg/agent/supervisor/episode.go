package supervisor

import "github.com/AbdullahMalik17/malikclaw/pkg/agent"

// SupervisorState tracks the lifecycle of an episode.
type SupervisorState string

const (
	StatePending   SupervisorState = "pending"
	StateExecuting SupervisorState = "executing"
	StateReviewing SupervisorState = "reviewing"
	StateComplete  SupervisorState = "complete"
	StateFailed    SupervisorState = "failed"
)

type EpisodeTracker struct {
	Episode *agent.SupervisorEpisode
	State   SupervisorState
	Results map[string]string
}
