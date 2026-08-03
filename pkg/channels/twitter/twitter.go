package twitter

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
	config *config.TwitterConfig
	cancel context.CancelFunc
}

type TweetResponse struct {
	Data []struct {
		ID       string `json:"id"`
		Text     string `json:"text"`
		AuthorID string `json:"author_id"`
	} `json:"data"`
	Meta struct {
		NewestID string `json:"newest_id"`
	} `json:"meta"`
}

type SendTweetRequest struct {
	Text  string `json:"text"`
	Reply *struct {
		InReplyToTweetID string `json:"in_reply_to_tweet_id"`
	} `json:"reply,omitempty"`
}

func NewChannel(cfg *config.Config, messageBus *bus.MessageBus) (*Channel, error) {
	if cfg.Channels.Twitter.BearerToken == "" {
		return nil, fmt.Errorf("twitter bearer_token is required")
	}

	ch := &Channel{
		BaseChannel: channels.NewBaseChannel(
			"twitter",
			&cfg.Channels.Twitter,
			messageBus,
			cfg.Channels.Twitter.AllowFrom,
			channels.WithReasoningChannelID(cfg.Channels.Twitter.ReasoningChannelID),
		),
		config: &cfg.Channels.Twitter,
	}
	return ch, nil
}

func (c *Channel) Start(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	c.cancel = cancel

	logger.InfoC("twitter", "Twitter channel started")
	
	// Start polling loop
	go c.poll(ctx)
	return nil
}

func (c *Channel) poll(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	var sinceID string

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			url := "https://api.twitter.com/2/users/me/mentions"
			if sinceID != "" {
				url += fmt.Sprintf("?since_id=%s", sinceID)
			}
			
			req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
			if err != nil {
				continue
			}
			req.Header.Set("Authorization", "Bearer "+c.config.BearerToken)
			
			resp, err := http.DefaultClient.Do(req)
			if err != nil {
				continue
			}

			if resp.StatusCode == 200 {
				var result TweetResponse
				if err := json.NewDecoder(resp.Body).Decode(&result); err == nil && len(result.Data) > 0 {
					for _, tweet := range result.Data {
						sender := bus.SenderInfo{
							Platform:   "twitter",
							PlatformID: tweet.AuthorID,
						}
						peer := bus.Peer{
							Kind: "direct",
							ID:   tweet.AuthorID,
						}
						c.HandleMessage(
							ctx,
							peer,
							tweet.ID,       // messageID
							tweet.AuthorID, // senderID
							tweet.ID,       // chatID
							tweet.Text,     // content
							nil,            // media
							nil,            // metadata
							sender,
						)
					}
					if result.Meta.NewestID != "" {
						sinceID = result.Meta.NewestID
					}
				}
			}
			resp.Body.Close()
		}
	}
}

func (c *Channel) Stop(ctx context.Context) error {
	if c.cancel != nil {
		c.cancel()
	}
	logger.InfoC("twitter", "Twitter channel stopped")
	return nil
}

func (c *Channel) Send(ctx context.Context, msg bus.OutboundMessage) error {
	logger.InfoCF("twitter", "Sending message", map[string]any{"chat_id": msg.ChatID})

	reqBody := SendTweetRequest{
		Text: msg.Content,
	}
	
	if msg.ChatID != "" && msg.ChatID != "direct" {
		reqBody.Reply = &struct {
			InReplyToTweetID string `json:"in_reply_to_tweet_id"`
		}{InReplyToTweetID: msg.ChatID}
	}

	data, err := json.Marshal(reqBody)
	if err != nil {
		return channels.ClassifySendError(http.StatusBadRequest, err)
	}

	url := "https://api.twitter.com/2/tweets"
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(data))
	if err != nil {
		return channels.ClassifySendError(http.StatusBadRequest, err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.config.BearerToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return channels.ClassifyNetError(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return channels.ClassifySendError(resp.StatusCode, fmt.Errorf("twitter API error: %s - %s", resp.Status, string(body)))
	}

	return nil
}
