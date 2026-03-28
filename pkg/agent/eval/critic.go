package eval

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
)

type Critic struct {
	provider providers.LLMProvider
	model    string
}

func NewCritic(p providers.LLMProvider, model string) *Critic {
	return &Critic{provider: p, model: model}
}

func (c *Critic) Evaluate(ctx context.Context, goal string, history []providers.Message) (*EvaluationResult, error) {
	prompt := fmt.Sprintf(`You are an expert autonomous agent evaluator system.
Your task is to review the execution history of an agent trying to achieve a goal and score its performance.

Goal: %s

Execution History:
`, goal)
	for _, m := range history {
		prompt += fmt.Sprintf("[%s]: %s\n", m.Role, m.Content)
	}

	prompt += `
Analyze the execution and provide your evaluation in strict JSON format matching exactly this schema:
{
	"success": boolean,
	"success_score": float (0.0 to 1.0),
	"efficiency": float (0.0 to 1.0),
	"correctness": float (0.0 to 1.0),
	"what_went_wrong": "string, describe errors if any",
	"how_to_improve": "string, describe actionable improvements",
	"feedback": "string, general feedback for the agent"
}
Return ONLY valid JSON without any markdown formatting block, prefix, or suffix.`

	messages := []providers.Message{
		{Role: "user", Content: prompt},
	}

	opts := map[string]any{
		"temperature": 0.0,
	}

	resp, err := c.provider.Chat(ctx, messages, nil, c.model, opts)
	if err != nil {
		return nil, fmt.Errorf("critic evaluation failed: %w", err)
	}

	content := strings.TrimSpace(resp.Content)
	// Remove possible markdown JSON block wrap
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
		content = strings.TrimSuffix(content, "```")
	} else if strings.HasPrefix(content, "```") {
		content = strings.TrimPrefix(content, "```")
		content = strings.TrimSuffix(content, "```")
	}
	content = strings.TrimSpace(content)

	var result EvaluationResult
	if err := json.Unmarshal([]byte(content), &result); err != nil {
		return nil, fmt.Errorf("failed to parse evaluation JSON: %w (content: %s)", err, content)
	}

	return &result, nil
}
