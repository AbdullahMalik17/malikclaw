// MalikClaw - Ultra-lightweight personal AI agent
// License: MIT

package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/auth"
)

type CalendarTool struct {
}

func NewCalendarTool() *CalendarTool {
	return &CalendarTool{}
}

func (t *CalendarTool) Name() string {
	return "calendar"
}

func (t *CalendarTool) Description() string {
	return "Access Google Calendar to list upcoming events."
}

func (t *CalendarTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"operation": map[string]any{
				"type":        "string",
				"description": "The operation to perform: list_events",
				"enum":        []string{"list_events"},
			},
			"max_results": map[string]any{
				"type":        "integer",
				"description": "Maximum number of events to list (default 10)",
			},
		},
		"required": []string{"operation"},
	}
}

func (t *CalendarTool) Execute(ctx context.Context, args map[string]any) *ToolResult {
	operation, _ := args["operation"].(string)

	cred, err := auth.GetCredential("google-calendar")
	if err != nil || cred == nil {
		// Fallback to checking channels config if available or just return error
		return ErrorResult(fmt.Sprintf("Calendar not authenticated. Use dashboard to connect or 'malikclaw auth login' first. Error: %v", err))
	}

	accessToken := cred.AccessToken
	if !cred.ExpiresAt.IsZero() && time.Now().After(cred.ExpiresAt) {
		if cred.RefreshToken != "" {
			clientID := os.Getenv("MALIKCLAW_CALENDAR_CLIENT_ID")
			clientSecret := os.Getenv("MALIKCLAW_CALENDAR_CLIENT_SECRET")
			if clientID != "" && clientSecret != "" {
				// Basic OAuth config refresh
				cfg := auth.GoogleGmailOAuthConfig(clientID, clientSecret)
				newCred, err := auth.RefreshAccessToken(cred, cfg)
				if err == nil {
					accessToken = newCred.AccessToken
					_ = auth.SetCredential("google-calendar", newCred)
				}
			}
		}
	}

	client := &http.Client{}

	switch operation {
	case "list_events":
		maxResults := 10
		if m, ok := args["max_results"].(float64); ok {
			maxResults = int(m)
		}
		return t.listEvents(ctx, client, accessToken, maxResults)
	default:
		return ErrorResult(fmt.Sprintf("unknown operation: %s", operation))
	}
}

func (t *CalendarTool) listEvents(ctx context.Context, client *http.Client, token string, maxResults int) *ToolResult {
	timeMin := time.Now().Format(time.RFC3339)
	url := fmt.Sprintf("https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=%s&maxResults=%d&singleEvents=true&orderBy=startTime", timeMin, maxResults)
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to fetch events: %v", err))
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ErrorResult(fmt.Sprintf("Calendar API error (status %d)", resp.StatusCode))
	}

	var result map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return ErrorResult(fmt.Sprintf("failed to parse response: %v", err))
	}

	data, _ := json.MarshalIndent(result, "", "  ")
	return &ToolResult{
		ForLLM:  string(data),
		ForUser: "Calendar events retrieved successfully.",
	}
}
