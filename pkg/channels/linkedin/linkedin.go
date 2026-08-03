package linkedin

import (
	"context"
	"fmt"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/channels"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/playwright-community/playwright-go"
)

type Channel struct {
	*channels.BaseChannel
	config  *config.LinkedInConfig
	cancel  context.CancelFunc
	pw      *playwright.Playwright
	browser playwright.BrowserContext
	page    playwright.Page
}

func NewChannel(cfg *config.Config, messageBus *bus.MessageBus) (*Channel, error) {
	if cfg.Channels.LinkedIn.DataDir == "" {
		return nil, fmt.Errorf("linkedin data_dir is required")
	}

	ch := &Channel{
		BaseChannel: channels.NewBaseChannel(
			"linkedin",
			&cfg.Channels.LinkedIn,
			messageBus,
			cfg.Channels.LinkedIn.AllowFrom,
			channels.WithReasoningChannelID(cfg.Channels.LinkedIn.ReasoningChannelID),
		),
		config: &cfg.Channels.LinkedIn,
	}
	return ch, nil
}

func (c *Channel) Start(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	c.cancel = cancel

	logger.InfoC("linkedin", "LinkedIn Playwright channel started")

	// Ensure Playwright is installed
	err := playwright.Install()
	if err != nil {
		logger.ErrorC("linkedin", "Failed to install Playwright (might already be installed)", err)
	}

	pw, err := playwright.Run()
	if err != nil {
		return fmt.Errorf("could not start Playwright: %v", err)
	}
	c.pw = pw

	// Launch persistent browser context
	browserCtx, err := pw.Chromium.LaunchPersistentContext(c.config.DataDir, playwright.BrowserTypeLaunchPersistentContextOptions{
		Headless: playwright.Bool(false),
	})
	if err != nil {
		return fmt.Errorf("could not launch persistent context: %v", err)
	}
	c.browser = browserCtx

	// Get or create a page
	pages := browserCtx.Pages()
	if len(pages) > 0 {
		c.page = pages[0]
	} else {
		c.page, err = browserCtx.NewPage()
		if err != nil {
			return fmt.Errorf("could not create page: %v", err)
		}
	}

	// Navigate to LinkedIn Messaging
	if _, err := c.page.Goto("https://www.linkedin.com/messaging/"); err != nil {
		return fmt.Errorf("could not navigate to linkedin messaging: %v", err)
	}

	// Start polling for messages
	go c.pollMessages(ctx)

	return nil
}

func (c *Channel) pollMessages(ctx context.Context) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	// Keep track of seen messages to avoid duplicates
	seenMessages := make(map[string]bool)

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			// Poll logic: Look for unread message badges
			loc := c.page.Locator(".msg-conversation-card__unread-count")
			count, err := loc.Count()
			if err != nil {
				logger.ErrorC("linkedin", "Failed to count unread messages", err)
				continue
			}

			if count > 0 {
				logger.InfoCF("linkedin", "Found unread messages", map[string]any{"count": count})
				
				// Click the first unread conversation
				if err := loc.First().Click(); err != nil {
					logger.ErrorC("linkedin", "Failed to click unread conversation", err)
					continue
				}

				// Small wait for messages to render
				c.page.WaitForTimeout(2000)

				// Scrape the latest message content in the conversation
				msgLoc := c.page.Locator(".msg-s-event-listitem__body")
				msgCount, _ := msgLoc.Count()
				if msgCount > 0 {
					lastMsg, _ := msgLoc.Nth(msgCount - 1).InnerText()
					
					if !seenMessages[lastMsg] {
						seenMessages[lastMsg] = true
						
						chatID := "linkedin_chat_id"
						senderID := "linkedin_sender_id"

						sender := bus.SenderInfo{
							Platform: "linkedin",
							Username: "linkedin_user",
						}
						peer := bus.Peer{
							Kind: "direct",
							ID:   chatID,
						}
						c.HandleMessage(
							ctx,
							peer,
							"",       // messageID
							senderID, // senderID
							chatID,   // chatID
							lastMsg,  // content
							nil,      // media
							nil,      // metadata
							sender,
						)
					}
				}
			}
		}
	}
}

func (c *Channel) Stop(ctx context.Context) error {
	if c.cancel != nil {
		c.cancel()
	}
	
	if c.browser != nil {
		if err := c.browser.Close(); err != nil {
			logger.ErrorC("linkedin", "Error closing browser context", err)
		}
	}
	
	if c.pw != nil {
		if err := c.pw.Stop(); err != nil {
			logger.ErrorC("linkedin", "Error stopping playwright", err)
		}
	}
	
	logger.InfoC("linkedin", "LinkedIn Playwright channel stopped")
	return nil
}

func (c *Channel) Send(ctx context.Context, msg bus.OutboundMessage) error {
	logger.InfoCF("linkedin", "Sending message via Playwright", map[string]any{"chat_id": msg.ChatID})
	
	if c.page == nil {
		return fmt.Errorf("page is not initialized")
	}

	// Enter message in the input field
	inputLocator := c.page.Locator(".msg-form__contenteditable")
	if err := inputLocator.Fill(msg.Content); err != nil {
		return fmt.Errorf("failed to fill message input: %v", err)
	}

	// Click the send button
	sendButtonLocator := c.page.Locator(".msg-form__send-button")
	if err := sendButtonLocator.Click(); err != nil {
		return fmt.Errorf("failed to click send button: %v", err)
	}

	return nil
}
