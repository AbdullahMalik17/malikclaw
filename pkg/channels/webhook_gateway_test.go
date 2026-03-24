package channels

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type orchestratorSpy struct {
	calls []StandardMessage
}

func (s *orchestratorSpy) HandleStandardMessage(_ context.Context, msg StandardMessage) error {
	s.calls = append(s.calls, msg)
	return nil
}

func TestWebhookGateway_SlackEvent_NormalizesAndForwardsToOrchestrator(t *testing.T) {
	const signingSecret = "slack-signing-secret"
	payload := `{
		"type":"event_callback",
		"event":{
			"type":"message",
			"user":"U12345",
			"text":"hello from slack",
			"channel":"C777",
			"ts":"1710000000.000100"
		}
	}`

	orchestrator := &orchestratorSpy{}
	gateway := NewWebhookGateway(WebhookGatewayConfig{
		SlackSigningSecret:   signingSecret,
		WhatsAppAppSecret:    "unused",
		OrchestratorReceiver: orchestrator,
	})

	timestamp := "1710000002"
	req := httptest.NewRequest(http.MethodPost, "/webhooks/slack", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Slack-Request-Timestamp", timestamp)
	req.Header.Set("X-Slack-Signature", slackSignature(signingSecret, timestamp, payload))

	rec := httptest.NewRecorder()
	gateway.ServeHTTP(rec, req)

	if rec.Code != http.StatusAccepted {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusAccepted)
	}

	if len(orchestrator.calls) != 1 {
		t.Fatalf("orchestrator call count = %d, want 1", len(orchestrator.calls))
	}

	got := orchestrator.calls[0]
	if got.Channel != "slack" {
		t.Fatalf("Channel = %q, want %q", got.Channel, "slack")
	}
	if got.SenderID != "U12345" {
		t.Fatalf("SenderID = %q, want %q", got.SenderID, "U12345")
	}
	if got.ChatID != "C777" {
		t.Fatalf("ChatID = %q, want %q", got.ChatID, "C777")
	}
	if got.Content != "hello from slack" {
		t.Fatalf("Content = %q, want %q", got.Content, "hello from slack")
	}
	if got.MessageID != "1710000000.000100" {
		t.Fatalf("MessageID = %q, want %q", got.MessageID, "1710000000.000100")
	}
}

func TestWebhookGateway_WhatsAppEvent_NormalizesAndForwardsToOrchestrator(t *testing.T) {
	const appSecret = "wa-app-secret"
	payload := `{
		"entry":[
			{
				"changes":[
					{
						"field":"messages",
						"value":{
							"contacts":[
								{"wa_id":"15551234567","profile":{"name":"Alice"}}
							],
							"messages":[
								{
									"id":"wamid.HBgNMTU1NTEyMzQ1Njc",
									"from":"15551234567",
									"timestamp":"1710000001",
									"type":"text",
									"text":{"body":"hello from whatsapp"}
								}
							]
						}
					}
				]
			}
		]
	}`

	orchestrator := &orchestratorSpy{}
	gateway := NewWebhookGateway(WebhookGatewayConfig{
		SlackSigningSecret:   "unused",
		WhatsAppAppSecret:    appSecret,
		OrchestratorReceiver: orchestrator,
	})

	req := httptest.NewRequest(http.MethodPost, "/webhooks/whatsapp", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Hub-Signature-256", whatsAppSignature(appSecret, payload))

	rec := httptest.NewRecorder()
	gateway.ServeHTTP(rec, req)

	if rec.Code != http.StatusAccepted {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusAccepted)
	}

	if len(orchestrator.calls) != 1 {
		t.Fatalf("orchestrator call count = %d, want 1", len(orchestrator.calls))
	}

	got := orchestrator.calls[0]
	if got.Channel != "whatsapp" {
		t.Fatalf("Channel = %q, want %q", got.Channel, "whatsapp")
	}
	if got.SenderID != "15551234567" {
		t.Fatalf("SenderID = %q, want %q", got.SenderID, "15551234567")
	}
	if got.ChatID != "15551234567" {
		t.Fatalf("ChatID = %q, want %q", got.ChatID, "15551234567")
	}
	if got.Content != "hello from whatsapp" {
		t.Fatalf("Content = %q, want %q", got.Content, "hello from whatsapp")
	}
	if got.MessageID != "wamid.HBgNMTU1NTEyMzQ1Njc" {
		t.Fatalf("MessageID = %q, want %q", got.MessageID, "wamid.HBgNMTU1NTEyMzQ1Njc")
	}
}

func TestWebhookGateway_RejectsInvalidSlackSignature(t *testing.T) {
	payload := `{"type":"event_callback","event":{"type":"message"}}`
	gateway := NewWebhookGateway(WebhookGatewayConfig{
		SlackSigningSecret:   "real-secret",
		WhatsAppAppSecret:    "unused",
		OrchestratorReceiver: &orchestratorSpy{},
	})

	req := httptest.NewRequest(http.MethodPost, "/webhooks/slack", strings.NewReader(payload))
	req.Header.Set("X-Slack-Request-Timestamp", "1710000002")
	req.Header.Set("X-Slack-Signature", "v0=invalid")

	rec := httptest.NewRecorder()
	gateway.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusUnauthorized)
	}
}

func TestWebhookGateway_RejectsInvalidWhatsAppSignature(t *testing.T) {
	payload := `{"entry":[]}`
	gateway := NewWebhookGateway(WebhookGatewayConfig{
		SlackSigningSecret:   "unused",
		WhatsAppAppSecret:    "real-secret",
		OrchestratorReceiver: &orchestratorSpy{},
	})

	req := httptest.NewRequest(http.MethodPost, "/webhooks/whatsapp", strings.NewReader(payload))
	req.Header.Set("X-Hub-Signature-256", "sha256=invalid")

	rec := httptest.NewRecorder()
	gateway.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusUnauthorized)
	}
}

func slackSignature(secret, timestamp, body string) string {
	base := "v0:" + timestamp + ":" + body
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write([]byte(base))
	return "v0=" + hex.EncodeToString(mac.Sum(nil))
}

func whatsAppSignature(secret, body string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write([]byte(body))
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}
