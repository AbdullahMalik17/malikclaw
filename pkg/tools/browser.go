package tools

import (
	"context"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/playwright-community/playwright-go"
)

// BrowserToolOptions configures the headless browser tool.
type BrowserToolOptions struct {
	Headless bool
	Timeout  time.Duration
}

// BrowserTool provides full headless browser automation using Playwright.
type BrowserTool struct {
	pw      *playwright.Playwright
	browser playwright.Browser
	context playwright.BrowserContext
	page    playwright.Page
	timeout time.Duration
}

func NewBrowserTool(opts BrowserToolOptions) (*BrowserTool, error) {
	err := playwright.Install()
	if err != nil {
		return nil, fmt.Errorf("could not install playwright dependencies: %w", err)
	}

	pw, err := playwright.Run()
	if err != nil {
		return nil, fmt.Errorf("could not start playwright: %w", err)
	}

	headless := true
	if !opts.Headless {
		headless = false
	}

	browser, err := pw.Chromium.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: playwright.Bool(headless),
	})
	if err != nil {
		return nil, fmt.Errorf("could not launch browser: %w", err)
	}

	bCtx, err := browser.NewContext()
	if err != nil {
		return nil, fmt.Errorf("could not create context: %w", err)
	}

	page, err := bCtx.NewPage()
	if err != nil {
		return nil, fmt.Errorf("could not create page: %w", err)
	}

	timeout := 30 * time.Second
	if opts.Timeout > 0 {
		timeout = opts.Timeout
	}

	return &BrowserTool{
		pw:      pw,
		browser: browser,
		context: bCtx,
		page:    page,
		timeout: timeout,
	}, nil
}

func (t *BrowserTool) Name() string {
	return "browser_automation"
}

func (t *BrowserTool) Description() string {
	return "Control a full headless browser. Supports actions like: navigate, click, type, content, screenshot, wait."
}

func (t *BrowserTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"action": map[string]any{
				"type":        "string",
				"description": "Action to perform (navigate, click, type, content, screenshot, wait)",
				"enum":        []string{"navigate", "click", "type", "content", "screenshot", "wait"},
			},
			"url": map[string]any{
				"type":        "string",
				"description": "URL for 'navigate' action",
			},
			"selector": map[string]any{
				"type":        "string",
				"description": "CSS selector for 'click', 'type', or 'wait' actions",
			},
			"value": map[string]any{
				"type":        "string",
				"description": "Text value for 'type' action",
			},
		},
		"required": []string{"action"},
	}
}

func (t *BrowserTool) Execute(ctx context.Context, args map[string]any) *ToolResult {
	action, ok := args["action"].(string)
	if !ok {
		return ErrorResult("action is required")
	}

	switch action {
	case "navigate":
		urlStr, ok := args["url"].(string)
		if !ok || urlStr == "" {
			return ErrorResult("url is required for navigate")
		}
		if _, err := t.page.Goto(urlStr, playwright.PageGotoOptions{
			Timeout: playwright.Float(float64(t.timeout.Milliseconds())),
		}); err != nil {
			return ErrorResult(fmt.Sprintf("failed to navigate: %v", err))
		}
		return SilentResult(fmt.Sprintf("Successfully navigated to %s", urlStr))

	case "click":
		selector, ok := args["selector"].(string)
		if !ok || selector == "" {
			return ErrorResult("selector is required for click")
		}
		if err := t.page.Locator(selector).Click(playwright.LocatorClickOptions{
			Timeout: playwright.Float(float64(t.timeout.Milliseconds())),
		}); err != nil {
			return ErrorResult(fmt.Sprintf("failed to click selector %q: %v", selector, err))
		}
		return SilentResult(fmt.Sprintf("Clicked element %q", selector))

	case "type":
		selector, ok := args["selector"].(string)
		if !ok || selector == "" {
			return ErrorResult("selector is required for type")
		}
		value, ok := args["value"].(string)
		if !ok {
			return ErrorResult("value is required for type")
		}
		if err := t.page.Locator(selector).Fill(value, playwright.LocatorFillOptions{
			Timeout: playwright.Float(float64(t.timeout.Milliseconds())),
		}); err != nil {
			return ErrorResult(fmt.Sprintf("failed to type into selector %q: %v", selector, err))
		}
		return SilentResult(fmt.Sprintf("Typed %q into element %q", value, selector))

	case "content":
		content, err := t.page.Content()
		if err != nil {
			return ErrorResult(fmt.Sprintf("failed to get page content: %v", err))
		}
		return &ToolResult{
			ForLLM:  content,
			ForUser: fmt.Sprintf("Retrieved %d bytes of page content", len(content)),
		}

	case "screenshot":
		screenshotBytes, err := t.page.Screenshot(playwright.PageScreenshotOptions{
			Timeout: playwright.Float(float64(t.timeout.Milliseconds())),
		})
		if err != nil {
			return ErrorResult(fmt.Sprintf("failed to take screenshot: %v", err))
		}
		// Return base64 for LLM usage
		encoded := base64.StdEncoding.EncodeToString(screenshotBytes)
		return &ToolResult{
			ForLLM:  fmt.Sprintf("Screenshot base64: %s", encoded),
			ForUser: "Screenshot taken successfully",
		}

	case "wait":
		selector, ok := args["selector"].(string)
		if !ok || selector == "" {
			return ErrorResult("selector is required for wait")
		}
		_, err := t.page.WaitForSelector(selector, playwright.PageWaitForSelectorOptions{
			Timeout: playwright.Float(float64(t.timeout.Milliseconds())),
		})
		if err != nil {
			return ErrorResult(fmt.Sprintf("failed while waiting for selector %q: %v", selector, err))
		}
		return SilentResult(fmt.Sprintf("Selector %q is now visible", selector))

	default:
		return ErrorResult(fmt.Sprintf("unknown action: %s", action))
	}
}

func (t *BrowserTool) Close() error {
	if t.page != nil {
		t.page.Close()
	}
	if t.context != nil {
		t.context.Close()
	}
	if t.browser != nil {
		t.browser.Close()
	}
	if t.pw != nil {
		return t.pw.Stop()
	}
	return nil
}
