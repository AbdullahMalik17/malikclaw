package reddit

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/channels"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

type Channel struct {
	channels.BaseChannel
	config *config.RedditConfig
	cancel context.CancelFunc
	token  string
}

type RedditAuthResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
}

type RedditInboxResponse struct {
	Data struct {
		Children []struct {
			Data struct {
				Name   string `json:"name"` // e.g. t4_12345
				Body   string `json:"body"`
				Author string `json:"author"`
			} `json:"data"`
		} `json:"children"`
	} `json:"data"`
}

func NewChannel(cfg *config.Config, messageBus *bus.MessageBus) (*Channel, error) {
	if cfg.Channels.Reddit.ClientID == "" || cfg.Channels.Reddit.ClientSecret == "" {
		return nil, fmt.Errorf("reddit client_id and client_secret are required")
	}

	ch := &Channel{
		BaseChannel: channels.NewBaseChannel("reddit", cfg.Channels.Reddit.ReasoningChannelID, cfg.Channels.Reddit.AllowFrom, messageBus),
		config:      &cfg.Channels.Reddit,
	}
	return ch, nil
}

func (c *Channel) Start(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	c.cancel = cancel

	logger.InfoC("reddit", "Reddit channel started")

	// Attempt initial auth
	if err := c.authenticate(ctx); err != nil {
		logger.ErrorCF("reddit", "Initial authentication failed", map[string]any{"error": err.Error()})
	}

	go c.poll(ctx)
	return nil
}

func (c *Channel) authenticate(ctx context.Context) error {
	data := url.Values{}
	data.Set("grant_type", "password")
	data.Set("username", c.config.Username)
	data.Set("password", c.config.Password)

	req, err := http.NewRequestWithContext(ctx, "POST", "https://www.reddit.com/api/v1/access_token", strings.NewReader(data.Encode()))
	if err != nil {
		return err
	}
	req.SetBasicAuth(c.config.ClientID, c.config.ClientSecret)
	req.Header.Add("User-Agent", "malikclaw/1.0.0")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("failed to auth, status: %s", resp.Status)
	}

	var authRes RedditAuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authRes); err != nil {
		return err
	}
	c.token = authRes.AccessToken
	return nil
}

func (c *Channel) poll(ctx context.Context) {
	ticker := time.NewTicker(60 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			if c.token == "" {
				if err := c.authenticate(ctx); err != nil {
					continue
				}
			}

			req, _ := http.NewRequestWithContext(ctx, "GET", "https://oauth.reddit.com/message/inbox/unread", nil)
			req.Header.Set("Authorization", "Bearer "+c.token)
			req.Header.Set("User-Agent", "malikclaw/1.0.0")

			resp, err := http.DefaultClient.Do(req)
			if err != nil {
				continue
			}

			if resp.StatusCode == 401 {
				c.token = "" // Force re-auth
				resp.Body.Close()
				continue
			}

			if resp.StatusCode == 200 {
				var inbox RedditInboxResponse
				if err := json.NewDecoder(resp.Body).Decode(&inbox); err == nil {
					for _, msg := range inbox.Data.Children {
						inboundMsg := bus.InboundMessage{
							Channel: "reddit",
							SenderID: msg.Data.Author,
							Sender: bus.SenderInfo{
								Platform: "reddit",
								PlatformID: msg.Data.Author,
							},
							ChatID: msg.Data.Name, // We reply to this thing_id
							Content: msg.Data.Body,
							Peer: bus.Peer{
								Kind: "direct",
								ID: msg.Data.Author,
							},
							MessageID: msg.Data.Name,
						}
						c.HandleMessage(inboundMsg)

						// Mark as read immediately to avoid processing again
						c.markRead(ctx, msg.Data.Name)
					}
				}
			}
			resp.Body.Close()
		}
	}
}

func (c *Channel) markRead(ctx context.Context, id string) {
	data := url.Values{}
	data.Set("id", id)
	req, _ := http.NewRequestWithContext(ctx, "POST", "https://oauth.reddit.com/api/read_message", strings.NewReader(data.Encode()))
	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("User-Agent", "malikclaw/1.0.0")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := http.DefaultClient.Do(req)
	if err == nil {
		resp.Body.Close()
	}
}

func (c *Channel) Stop(ctx context.Context) error {
	if c.cancel != nil {
		c.cancel()
	}
	logger.InfoC("reddit", "Reddit channel stopped")
	return nil
}

func (c *Channel) Send(ctx context.Context, msg bus.OutboundMessage) error {
	logger.InfoCF("reddit", "Sending reply", map[string]any{"chat_id": msg.ChatID})

	if c.token == "" {
		if err := c.authenticate(ctx); err != nil {
			return channels.ClassifySendError(err)
		}
	}

	data := url.Values{}
	data.Set("thing_id", msg.ChatID) // The ChatID is the parent message's 'name' (e.g. t4_xxxx)
	data.Set("text", msg.Content)

	req, err := http.NewRequestWithContext(ctx, "POST", "https://oauth.reddit.com/api/comment", strings.NewReader(data.Encode()))
	if err != nil {
		return channels.ClassifySendError(err)
	}
	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("User-Agent", "malikclaw/1.0.0")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return channels.ClassifySendError(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 429 {
		return channels.ErrRateLimit
	} else if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return channels.ClassifySendError(fmt.Errorf("reddit API error: %s - %s", resp.Status, string(body)))
	}

	return nil
}
