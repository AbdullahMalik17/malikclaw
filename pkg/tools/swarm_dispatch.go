package tools

import (
	"context"
	"fmt"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/swarm"
)

// SwarmDispatchTool allows an agent to dispatch a task to another node in the swarm
type SwarmDispatchTool struct {
	swarm *swarm.Swarm
}

func NewSwarmDispatchTool(s *swarm.Swarm) *SwarmDispatchTool {
	return &SwarmDispatchTool{swarm: s}
}

func (t *SwarmDispatchTool) Name() string {
	return "swarm_dispatch"
}

func (t *SwarmDispatchTool) Description() string {
	return "Dispatch a task to a remote MalikClaw instance in the Swarm network."
}

func (t *SwarmDispatchTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"node_id": map[string]any{
				"type":        "string",
				"description": "ID of the target swarm node",
			},
			"agent_id": map[string]any{
				"type":        "string",
				"description": "ID of the specific agent on the target node to handle the task",
			},
			"payload": map[string]any{
				"type":        "string",
				"description": "The task payload/instruction",
			},
		},
		"required": []string{"node_id", "agent_id", "payload"},
	}
}

func (t *SwarmDispatchTool) Execute(ctx context.Context, args map[string]any) *ToolResult {
	nodeID, ok := args["node_id"].(string)
	if !ok || nodeID == "" {
		return ErrorResult("node_id is required")
	}

	agentID, ok := args["agent_id"].(string)
	if !ok || agentID == "" {
		return ErrorResult("agent_id is required")
	}

	payload, ok := args["payload"].(string)
	if !ok || payload == "" {
		return ErrorResult("payload is required")
	}

	task := swarm.Task{
		ID:         fmt.Sprintf("task-%d", time.Now().UnixNano()),
		AgentID:    agentID,
		Payload:    payload,
		SessionKey: "swarm-session",
	}

	result, err := t.swarm.DispatchTask(ctx, nodeID, task)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to dispatch task to node %q: %v", nodeID, err))
	}

	if result.Error != "" {
		return ErrorResult(fmt.Sprintf("node %q returned error: %s", nodeID, result.Error))
	}

	return SilentResult(fmt.Sprintf("Task successfully dispatched. Result: %s", result.Result))
}
