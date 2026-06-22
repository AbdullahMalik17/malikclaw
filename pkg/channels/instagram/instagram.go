package instagram

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/channels"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

type Channel struct {
	channels.BaseChannel
	config *config.InstagramConfig
}

type WebhookPayload struct {
	Object string         `json:"object"`
	Entry  []WebhookEntry `json:"entry"`
}

type WebhookEntry struct {
	ID        string             `json:"id"`
	Time      int64              `json:"time"`
	Messaging []WebhookMessaging `json:"messaging"`
}

type WebhookMessaging struct {
	Sender    struct{ ID string `json:"id"` } `json:"sender"`
	Recipient struct{ ID string `json:"id"` } `json:"recipient"`
	Message   struct {
		Mid  string `json:"mid"`
		Text string `json:"text"`
	} `json:"message"`
}

type SendRequest struct {
	Recipient struct {
		ID string `json:"id"`
	} `json:"recipient"`
	Message struct {
		Text string `json:"text"`
	} `json:"message"`
}

func NewChannel(cfg *config.Config, messageBus *bus.MessageBus) (*Channel, error) {
	if cfg.Channels.Instagram.Token == "" {
		return nil, fmt.Errorf("instagram token is required")
	}

	ch := &Channel{
		BaseChannel: channels.NewBaseChannel("instagram", cfg.Channels.Instagram.ReasoningChannelID, cfg.Channels.Instagram.AllowFrom, messageBus),
		config:      &cfg.Channels.Instagram,
	}
	return ch, nil
}

func (c *Channel) Start(ctx context.Context) error {
	logger.InfoC("instagram", "Instagram channel started via Webhook")
	return nil
}

func (c *Channel) Stop(ctx context.Context) error {
	logger.InfoC("instagram", "Instagram channel stopped")
	return nil
}

func (c *Channel) Send(ctx context.Context, msg bus.OutboundMessage) error {
	logger.InfoCF("instagram", "Sending message", map[string]any{"chat_id": msg.ChatID})

	reqBody := SendRequest{}
	reqBody.Recipient.ID = msg.ChatID
	reqBody.Message.Text = msg.Content

	data, err := json.Marshal(reqBody)
	if err != nil {
		return channels.ClassifySendError(err)
	}

	url := fmt.Sprintf("https://graph.instagram.com/v21.0/me/messages?access_token=%s", c.config.Token)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(data))
	if err != nil {
		return channels.ClassifySendError(err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return channels.ClassifySendError(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return channels.ClassifySendError(fmt.Errorf("instagram API error: %s - %s", resp.Status, string(body)))
	}

	return nil
}

// WebhookPath implements channels.WebhookHandler interface
func (c *Channel) WebhookPath() string {
	if c.config.WebhookPath != "" {
		return c.config.WebhookPath
	}
	return "/webhook/instagram"
}

// ServeHTTP implements channels.WebhookHandler interface
func (c *Channel) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		mode := r.URL.Query().Get("hub.mode")
		token := r.URL.Query().Get("hub.verify_token")
		challenge := r.URL.Query().Get("hub.challenge")

		if mode == "subscribe" && token == c.config.VerifyToken {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(challenge))
			return
		}
		w.WriteHeader(http.StatusForbidden)
		return
	}

	if r.Method == "POST" {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var payload WebhookPayload
		if err := json.Unmarshal(body, &payload); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if payload.Object != "instagram" {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		for _, entry := range payload.Entry {
			for _, messaging := range entry.Messaging {
				if messaging.Message.Text != "" {
					inboundMsg := bus.InboundMessage{
						Channel: "instagram",
						SenderID: messaging.Sender.ID,
						Sender: bus.SenderInfo{
							Platform: "instagram",
							PlatformID: messaging.Sender.ID,
						},
						ChatID: messaging.Sender.ID,
						Content: messaging.Message.Text,
						Peer: bus.Peer{
							Kind: "direct",
							ID: messaging.Sender.ID,
						},
						MessageID: messaging.Message.Mid,
					}
					c.HandleMessage(inboundMsg)
				}
			}
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("EVENT_RECEIVED"))
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
