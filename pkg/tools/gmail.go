// MalikClaw - Ultra-lightweight personal AI agent
// License: MIT

package tools

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/sipeed/malikclaw/pkg/auth"
)

type GmailTool struct {
}

func NewGmailTool() *GmailTool {
	return &GmailTool{}
}

func (t *GmailTool) Name() string {
	return "gmail"
}

func (t *GmailTool) Description() string {
	return "Access Gmail to list, read, and send emails. Operations: list_unread, read_email, send_email."
}

func (t *GmailTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"operation": map[string]any{
				"type":        "string",
				"description": "The operation to perform: list_unread, read_email, send_email",
				"enum":        []string{"list_unread", "read_email", "send_email"},
			},
			"message_id": map[string]any{
				"type":        "string",
				"description": "The ID of the message to read (required for read_email)",
			},
			"to": map[string]any{
				"type":        "string",
				"description": "Recipient email address (required for send_email)",
			},
			"subject": map[string]any{
				"type":        "string",
				"description": "Email subject (required for send_email)",
			},
			"body": map[string]any{
				"type":        "string",
				"description": "Email body content (required for send_email)",
			},
			"max_results": map[string]any{
				"type":        "integer",
				"description": "Maximum number of emails to list (default 10)",
			},
		},
		"required": []string{"operation"},
	}
}

func (t *GmailTool) Execute(ctx context.Context, args map[string]any) *ToolResult {
	operation, _ := args["operation"].(string)

	cred, err := auth.GetCredential("google-gmail")
	if err != nil || cred == nil {
		return ErrorResult(fmt.Sprintf("Gmail not authenticated. Use 'malikclaw auth login --provider google-gmail' first. Error: %v", err))
	}

	// Check if token is expired and needs refresh
	if !cred.ExpiresAt.IsZero() && time.Now().After(cred.ExpiresAt) {
		// Implement refresh logic here if needed, or assume GetCredential handles it
	}

	client := &http.Client{}

	switch operation {
	case "list_unread":
		maxResults := 10
		if m, ok := args["max_results"].(float64); ok {
			maxResults = int(m)
		}
		return t.listUnread(ctx, client, cred.AccessToken, maxResults)
	case "read_email":
		messageID, ok := args["message_id"].(string)
		if !ok {
			return ErrorResult("message_id is required for read_email")
		}
		return t.readEmail(ctx, client, cred.AccessToken, messageID)
	case "send_email":
		to, _ := args["to"].(string)
		subject, _ := args["subject"].(string)
		body, _ := args["body"].(string)
		if to == "" || subject == "" || body == "" {
			return ErrorResult("to, subject, and body are required for send_email")
		}
		return t.sendEmail(ctx, client, cred.AccessToken, to, subject, body)
	default:
		return ErrorResult(fmt.Sprintf("unknown operation: %s", operation))
	}
}

func (t *GmailTool) listUnread(ctx context.Context, client *http.Client, token string, maxResults int) *ToolResult {
	url := fmt.Sprintf("https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=%d", maxResults)
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to fetch messages: %v", err))
	}
	defer resp.Body.Close()

	var result struct {
		Messages []struct {
			ID       string `json:"id"`
			ThreadID string `json:"threadId"`
		} `json:"messages"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return ErrorResult(fmt.Sprintf("failed to parse response: %v", err))
	}

	if len(result.Messages) == 0 {
		return &ToolResult{ForLLM: "No unread messages found.", ForUser: "No unread messages found."}
	}

	// Fetch snippets for each message
	var output strings.Builder
	output.WriteString("Unread Messages:\n")
	for i, msg := range result.Messages {
		snippet := t.getMessageSnippet(ctx, client, token, msg.ID)
		output.WriteString(fmt.Sprintf("%d. ID: %s | Snippet: %s\n", i+1, msg.ID, snippet))
	}

	return &ToolResult{
		ForLLM:  output.String(),
		ForUser: output.String(),
	}
}

func (t *GmailTool) getMessageSnippet(ctx context.Context, client *http.Client, token, id string) string {
	url := fmt.Sprintf("https://gmail.googleapis.com/gmail/v1/users/me/messages/%s?format=minimal", id)
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		return "[error fetching snippet]"
	}
	defer resp.Body.Close()

	var msg struct {
		Snippet string `json:"snippet"`
	}
	json.NewDecoder(resp.Body).Decode(&msg)
	return msg.Snippet
}

func (t *GmailTool) readEmail(ctx context.Context, client *http.Client, token, id string) *ToolResult {
	url := fmt.Sprintf("https://gmail.googleapis.com/gmail/v1/users/me/messages/%s", id)
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to read message: %v", err))
	}
	defer resp.Body.Close()

	var msg map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&msg); err != nil {
		return ErrorResult(fmt.Sprintf("failed to parse message: %v", err))
	}

	data, _ := json.MarshalIndent(msg, "", "  ")
	return &ToolResult{
		ForLLM:  string(data),
		ForUser: "Email content retrieved successfully.",
	}
}

func (t *GmailTool) sendEmail(ctx context.Context, client *http.Client, token, to, subject, body string) *ToolResult {
	rawMessage := fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s", to, subject, body)
	encodedMessage := base64.URLEncoding.EncodeToString([]byte(rawMessage))

	payload := map[string]string{
		"raw": encodedMessage,
	}
	payloadBytes, _ := json.Marshal(payload)

	url := "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
	req, _ := http.NewRequestWithContext(ctx, "POST", url, strings.NewReader(string(payloadBytes)))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to send email: %v", err))
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return ErrorResult(fmt.Sprintf("Gmail API error (status %d): %s", resp.StatusCode, string(body)))
	}

	return &ToolResult{
		ForLLM:  "Email sent successfully.",
		ForUser: "Email sent successfully.",
	}
}
