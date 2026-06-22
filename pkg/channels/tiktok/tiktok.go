package tiktok

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/channels"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

type Channel struct {
	*channels.BaseChannel
	config     *config.TikTokConfig
	httpClient *http.Client
	ctx        context.Context
	cancel     context.CancelFunc
}

type WebhookPayload struct {
	Event string `json:"event"`
	Data  struct {
		MessageID  string `json:"message_id"`
		SenderID   string `json:"sender_id"`
		CreateTime int64  `json:"create_time"`
		Text       string `json:"text"`
	} `json:"data"`
}

type SendMessageRequest struct {
	RecipientID string `json:"recipient_id"`
	MessageType string `json:"message_type"`
	Text        string `json:"text"`
}

func NewChannel(cfg *config.Config, messageBus *bus.MessageBus) (*Channel, error) {
	if cfg.Channels.TikTok.Token == "" {
		return nil, fmt.Errorf("tiktok token is required")
	}

	ctx, cancel := context.WithCancel(context.Background())

	ch := &Channel{
		BaseChannel: channels.NewBaseChannel(
			"tiktok",
			cfg.Channels.TikTok,
			messageBus,
			cfg.Channels.TikTok.AllowFrom,
			channels.WithReasoningChannelID(cfg.Channels.TikTok.ReasoningChannelID),
		),
		config:     &cfg.Channels.TikTok,
		httpClient: &http.Client{Timeout: 10 * time.Second},
		ctx:        ctx,
		cancel:     cancel,
	}
	return ch, nil
}

func (c *Channel) Start(ctx context.Context) error {
	logger.InfoC("tiktok", "TikTok channel started")

	// Start a robust polling loop to interact with Direct Message API
	go c.pollMessages()

	return nil
}

func (c *Channel) Stop(ctx context.Context) error {
	c.cancel()
	logger.InfoC("tiktok", "TikTok channel stopped")
	return nil
}

func (c *Channel) pollMessages() {
	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			return
		case <-ticker.C:
			c.fetchMessages()
		}
	}
}

func (c *Channel) fetchMessages() {
	req, err := http.NewRequestWithContext(c.ctx, "GET", "https://open.tiktokapis.com/v2/message/inbox/", nil)
	if err != nil {
		logger.ErrorCF("tiktok", "Failed to create request", map[string]any{"error": err})
		return
	}
	req.Header.Set("Authorization", "Bearer "+c.config.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		logger.ErrorCF("tiktok", "Failed to fetch messages", map[string]any{"error": err})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		// Log but don't fail completely on non-200 responses to keep the loop running
		logger.ErrorCF("tiktok", "Non-200 response from TikTok API", map[string]any{"status": resp.StatusCode})
		return
	}

	// Response parsing logic would go here
	// e.g. unmarshal json and publish to bus
}

func (c *Channel) Send(ctx context.Context, msg bus.OutboundMessage) error {
	logger.InfoCF("tiktok", "Sending message", map[string]any{"chat_id": msg.ChatID})

	payload := SendMessageRequest{
		RecipientID: msg.ChatID,
		MessageType: "text",
		Text:        msg.Content,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal tiktok message: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", "https://open.tiktokapis.com/v2/message/send/", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("failed to create tiktok send request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.config.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send tiktok message: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("tiktok API error: status %d, body %s", resp.StatusCode, string(respBody))
	}

	return nil
}

// HandleWebhook acts as a webhook payload parser for incoming events based on TikTok Direct Post API docs
func (c *Channel) HandleWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		logger.ErrorCF("tiktok", "Failed to read webhook body", map[string]any{"error": err})
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var payload WebhookPayload
	if err := json.Unmarshal(body, &payload); err != nil {
		logger.ErrorCF("tiktok", "Failed to parse webhook payload", map[string]any{"error": err})
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if payload.Event == "direct_message" && payload.Data.Text != "" {
		if !c.IsAllowed(payload.Data.SenderID) {
			logger.InfoCF("tiktok", "Message from disallowed user", map[string]any{"sender": payload.Data.SenderID})
		} else {
			inboundMsg := bus.InboundMessage{
				Channel:   "tiktok",
				ChatID:    payload.Data.SenderID,
				AccountID: payload.Data.SenderID,
				Username:  payload.Data.SenderID,
				Content:   payload.Data.Text,
				Type:      bus.MessageTypeChat,
			}
			c.Bus().PublishInbound(r.Context(), inboundMsg)
		}
	}

	w.WriteHeader(http.StatusOK)
}
