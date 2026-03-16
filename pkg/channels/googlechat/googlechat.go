package googlechat

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/channels"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/identity"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
)

const (
	googleChatScope         = "https://www.googleapis.com/auth/chat.bot"
	googleChatAPIBase       = "https://chat.googleapis.com/v1"
	googleChatMaxBodyBytes  = 1 << 20 // 1 MiB
	defaultGoogleChatPath   = "/webhook/googlechat"
	googleChatPlatformLabel = "googlechat"
)

type GoogleChatChannel struct {
	*channels.BaseChannel
	config      config.GoogleChatConfig
	httpClient  *http.Client
	tokenSource oauth2.TokenSource
	botUser     string
	ctx         context.Context
	cancel      context.CancelFunc
}

func NewGoogleChatChannel(cfg config.GoogleChatConfig, messageBus *bus.MessageBus) (*GoogleChatChannel, error) {
	if cfg.ServiceAccountFile == "" {
		return nil, fmt.Errorf("googlechat service_account_file is required")
	}

	jwtCfg, err := loadServiceAccount(cfg.ServiceAccountFile)
	if err != nil {
		return nil, err
	}

	tokenSource := oauth2.ReuseTokenSource(nil, jwtCfg.TokenSource(context.Background()))
	base := channels.NewBaseChannel(
		googleChatPlatformLabel,
		cfg,
		messageBus,
		cfg.AllowFrom,
		channels.WithGroupTrigger(cfg.GroupTrigger),
		channels.WithReasoningChannelID(cfg.ReasoningChannelID),
	)

	return &GoogleChatChannel{
		BaseChannel: base,
		config:      cfg,
		httpClient:  &http.Client{Timeout: 20 * time.Second},
		tokenSource: tokenSource,
		botUser:     strings.TrimSpace(cfg.BotUser),
	}, nil
}

func loadServiceAccount(path string) (*jwt.Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read google chat service account file: %w", err)
	}
	cfg, err := google.JWTConfigFromJSON(data, googleChatScope)
	if err != nil {
		return nil, fmt.Errorf("failed to parse google chat service account file: %w", err)
	}
	return cfg, nil
}

func (c *GoogleChatChannel) Start(ctx context.Context) error {
	logger.InfoC("googlechat", "Starting Google Chat channel")
	c.ctx, c.cancel = context.WithCancel(ctx)
	c.SetRunning(true)
	logger.InfoC("googlechat", "Google Chat channel started")
	return nil
}

func (c *GoogleChatChannel) Stop(ctx context.Context) error {
	logger.InfoC("googlechat", "Stopping Google Chat channel")
	if c.cancel != nil {
		c.cancel()
	}
	c.SetRunning(false)
	logger.InfoC("googlechat", "Google Chat channel stopped")
	return nil
}

func (c *GoogleChatChannel) WebhookPath() string {
	if c.config.WebhookPath != "" {
		return c.config.WebhookPath
	}
	return defaultGoogleChatPath
}

// ServeHTTP implements http.Handler for the shared HTTP server.
func (c *GoogleChatChannel) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c.webhookHandler(w, r)
}

func (c *GoogleChatChannel) webhookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(io.LimitReader(r.Body, googleChatMaxBodyBytes+1))
	if err != nil {
		logger.ErrorCF("googlechat", "Failed to read webhook body", map[string]any{"error": err.Error()})
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	if int64(len(body)) > googleChatMaxBodyBytes {
		http.Error(w, "Request entity too large", http.StatusRequestEntityTooLarge)
		return
	}

	var event googleChatEvent
	if err := json.Unmarshal(body, &event); err != nil {
		logger.ErrorCF("googlechat", "Failed to parse webhook payload", map[string]any{"error": err.Error()})
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	if c.config.VerificationToken != "" && event.Token != c.config.VerificationToken {
		logger.WarnC("googlechat", "Invalid verification token")
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	if strings.ToUpper(event.Type) != "MESSAGE" {
		w.WriteHeader(http.StatusOK)
		return
	}

	msg := event.Message
	if msg == nil {
		w.WriteHeader(http.StatusOK)
		return
	}

	sender := msg.Sender
	if sender.Type == "BOT" {
		w.WriteHeader(http.StatusOK)
		return
	}

	space := msg.Space
	if space.Name == "" {
		space = event.Space
	}
	if space.Name == "" {
		w.WriteHeader(http.StatusOK)
		return
	}

	content := strings.TrimSpace(msg.ArgumentText)
	if content == "" {
		content = strings.TrimSpace(msg.Text)
	}
	if content == "" {
		w.WriteHeader(http.StatusOK)
		return
	}

	isGroup := strings.EqualFold(space.Type, "ROOM")
	isMentioned := msg.ArgumentText != "" ||
		(c.botUser != "" && strings.Contains(msg.Text, c.botUser))

	if isGroup {
		respond, cleaned := c.ShouldRespondInGroup(isMentioned, content)
		if !respond {
			w.WriteHeader(http.StatusOK)
			return
		}
		content = cleaned
	}

	peerKind := "direct"
	if isGroup {
		peerKind = "group"
	}
	threadName := strings.TrimSpace(msg.Thread.Name)
	chatID := buildChatID(space.Name, threadName)
	peer := bus.Peer{Kind: peerKind, ID: chatID}

	metadata := map[string]string{
		"platform":    googleChatPlatformLabel,
		"space_type":  space.Type,
		"space_name":  space.Name,
		"message_uri": msg.Name,
	}
	if threadName != "" {
		metadata["thread_name"] = threadName
	}

	senderID := sender.Name
	if senderID == "" {
		senderID = event.User.Name
	}
	if senderID == "" {
		w.WriteHeader(http.StatusOK)
		return
	}

	senderInfo := bus.SenderInfo{
		Platform:    googleChatPlatformLabel,
		PlatformID:  senderID,
		CanonicalID: identity.BuildCanonicalID(googleChatPlatformLabel, senderID),
		Username:    sender.DisplayName,
		DisplayName: sender.DisplayName,
	}

	if !c.IsAllowedSender(senderInfo) {
		w.WriteHeader(http.StatusOK)
		return
	}

	logger.DebugCF("googlechat", "Received message", map[string]any{
		"sender_id": senderID,
		"space":     space.Name,
		"thread":    threadName,
		"is_group":  isGroup,
		"preview":   utils.Truncate(content, 50),
	})

	c.HandleMessage(c.ctx, peer, msg.Name, senderID, chatID, content, nil, metadata, senderInfo)
	w.WriteHeader(http.StatusOK)
}

func (c *GoogleChatChannel) Send(ctx context.Context, msg bus.OutboundMessage) error {
	if !c.IsRunning() {
		return channels.ErrNotRunning
	}

	space, thread := parseGoogleChatChatID(msg.ChatID)
	if space == "" {
		return fmt.Errorf("missing google chat space id: %w", channels.ErrSendFailed)
	}

	token, err := c.tokenSource.Token()
	if err != nil {
		return fmt.Errorf("failed to get google chat token: %w", err)
	}

	payload := googleChatMessageRequest{Text: msg.Content}
	if thread == "" && msg.ReplyToMessageID != "" {
		thread = deriveThreadNameFromMessage(msg.ReplyToMessageID)
	}
	if thread != "" {
		payload.Thread = &googleChatThread{Name: thread}
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to encode google chat message: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, googleChatMessageURL(space), bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("failed to build google chat request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("google chat send failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		respBody, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("google chat send failed: status %d: %s", resp.StatusCode, strings.TrimSpace(string(respBody)))
	}

	return nil
}

func googleChatMessageURL(space string) string {
	return googleChatAPIBase + "/" + strings.TrimPrefix(space, "/") + "/messages"
}

func parseGoogleChatChatID(chatID string) (spaceName, threadName string) {
	parts := strings.SplitN(strings.TrimSpace(chatID), "/", 2)
	if len(parts) > 0 {
		spaceName = strings.TrimSpace(parts[0])
	}
	if len(parts) > 1 {
		threadName = strings.TrimSpace(parts[1])
	}
	return spaceName, threadName
}

func buildChatID(spaceName, threadName string) string {
	spaceName = strings.TrimSpace(spaceName)
	threadName = strings.TrimSpace(threadName)
	if spaceName == "" {
		return ""
	}
	if threadName == "" {
		return spaceName
	}
	return spaceName + "/" + threadName
}

func deriveThreadNameFromMessage(messageName string) string {
	messageName = strings.TrimSpace(messageName)
	if messageName == "" {
		return ""
	}
	if strings.Contains(messageName, "/threads/") {
		return messageName
	}
	if strings.Contains(messageName, "/messages/") {
		return strings.Replace(messageName, "/messages/", "/threads/", 1)
	}
	return ""
}

type googleChatEvent struct {
	Type    string             `json:"type"`
	Token   string             `json:"token"`
	Message *googleChatMessage `json:"message"`
	Space   googleChatSpace    `json:"space"`
	User    googleChatUser     `json:"user"`
}

type googleChatMessage struct {
	Name         string           `json:"name"`
	Text         string           `json:"text"`
	ArgumentText string           `json:"argumentText"`
	Sender       googleChatUser   `json:"sender"`
	Space        googleChatSpace  `json:"space"`
	Thread       googleChatThread `json:"thread"`
}

type googleChatSpace struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	DisplayName string `json:"displayName"`
}

type googleChatUser struct {
	Name        string `json:"name"`
	DisplayName string `json:"displayName"`
	Type        string `json:"type"`
}

type googleChatThread struct {
	Name string `json:"name"`
}

type googleChatMessageRequest struct {
	Text   string            `json:"text"`
	Thread *googleChatThread `json:"thread,omitempty"`
}
