package ui

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"time"

	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"

	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

// ChatMessage represents a single chat message
type ChatMessage struct {
	Role      string
	Content   string
	Timestamp time.Time
}

// ChatView holds the chat UI state
type ChatView struct {
	app          *tview.Application
	pages        *tview.Pages
	messages     []ChatMessage
	input        *tview.TextArea
	chatView     *tview.TextView
	statusView   *tview.TextView
	sessionKey   string
	model        string
	isStreaming  bool
	currentMsg   strings.Builder
	config       *config.Config
	appState     *appState
}

// NewChatView creates a new chat view
func (s *appState) chatViewUI() tview.Primitive {
	chat := &ChatView{
		app:        s.app,
		pages:      s.pages,
		messages:   make([]ChatMessage, 0),
		sessionKey: "cli:default",
		model:      s.config.Agents.Defaults.Model,
		config:     s.config,
		appState:   s,
	}

	// Chat display area
	chat.chatView = tview.NewTextView()
	chat.chatView.SetDynamicColors(true)
	chat.chatView.SetWordWrap(true)
	chat.chatView.SetScrollable(true)
	chat.chatView.SetBorder(true)
	chat.chatView.SetTitle(" Chat - " + chat.model)
	chat.chatView.SetTitleAlign(tview.AlignLeft)
	chat.chatView.SetBackgroundColor(tview.Styles.PrimitiveBackgroundColor)
	chat.chatView.SetTextColor(tview.Styles.PrimaryTextColor)

	// Input area
	chat.input = tview.NewTextArea()
	chat.input.SetWrap(true)
	chat.input.SetPlaceholder("Type your message... (Ctrl+Enter to send, Ctrl+Q to quit)")
	chat.input.SetBorder(true)
	chat.input.SetTitle(" Input ")
	chat.input.SetBackgroundColor(tview.Styles.PrimitiveBackgroundColor)

	// Status sidebar
	chat.statusView = tview.NewTextView()
	chat.statusView.SetDynamicColors(true)
	chat.statusView.SetWordWrap(true)
	chat.statusView.SetBorder(true)
	chat.statusView.SetTitle(" Status ")
	chat.statusView.SetBackgroundColor(tview.Styles.PrimitiveBackgroundColor)
	chat.statusView.SetTextColor(tview.Styles.SecondaryTextColor)
	chat.updateStatus()

	// Layout
	inputFlex := tview.NewFlex().SetDirection(tview.FlexRow).
		AddItem(chat.input, 4, 0, true)

	mainFlex := tview.NewFlex().SetDirection(tview.FlexColumn).
		AddItem(chat.chatView, 0, 3, false).
		AddItem(chat.statusView, 30, 0, false)

	rootFlex := tview.NewFlex().SetDirection(tview.FlexRow).
		AddItem(mainFlex, 0, 1, false).
		AddItem(inputFlex, 4, 0, true)

	// Input capture for the root flex to handle Esc
	rootFlex.SetInputCapture(func(event *tcell.EventKey) *tcell.EventKey {
		if event.Key() == tcell.KeyEsc {
			// Stop the chat view and go back
			chat.appState.pop()
			return nil
		}
		return event
	})

	// Input capture
	chat.input.SetInputCapture(func(event *tcell.EventKey) *tcell.EventKey {
		// Ctrl+Enter to send
		if event.Key() == tcell.KeyEnter && event.Modifiers()&tcell.ModCtrl != 0 {
			chat.sendMessage()
			return nil
		}
		// Ctrl+Q to quit
		if event.Key() == tcell.KeyCtrlQ {
			s.pop()
			return nil
		}
		// Ctrl+C to clear
		if event.Key() == tcell.KeyCtrlC {
			chat.clearChat()
			return nil
		}
		// Ctrl+E to export
		if event.Key() == tcell.KeyCtrlE {
			chat.exportChat()
			return nil
		}
		// Ctrl+H for help
		if event.Key() == tcell.KeyCtrlH {
			chat.showHelp()
			return nil
		}
		return event
	})

	// Start status update ticker
	go chat.startStatusUpdates()

	return rootFlex
}

func (s *appState) newChatView() tview.Primitive {
	return s.chatViewUI()
}

func (c *ChatView) updateStatus() {
	var status strings.Builder

	// Model info
	status.WriteString("[yellow]Model:[reset] " + c.model + "\n\n")

	// Session info
	status.WriteString("[yellow]Session:[reset] " + c.sessionKey + "\n\n")

	// Memory info
	var mem runtime.MemStats
	runtime.ReadMemStats(&mem)
	status.WriteString(fmt.Sprintf("[yellow]Alloc:[reset] %.2f MB\n", float64(mem.Alloc)/1024/1024))
	status.WriteString(fmt.Sprintf("[yellow]Sys:[reset] %.2f MB\n", float64(mem.Sys)/1024/1024))
	status.WriteString(fmt.Sprintf("[yellow]NumGC:[reset] %d\n\n", mem.NumGC))

	// Message count
	status.WriteString(fmt.Sprintf("[yellow]Messages:[reset] %d\n\n", len(c.messages)))

	// Connection status
	status.WriteString("[green]●[reset] Ready\n")

	if c.isStreaming {
		status.WriteString("\n[yellow]⟳[reset] Streaming...")
	}

	c.statusView.SetText(status.String())
}

func (c *ChatView) startStatusUpdates() {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()
	for range ticker.C {
		c.app.QueueUpdateDraw(func() {
			c.updateStatus()
		})
	}
}

func (c *ChatView) addMessage(role, content string) {
	c.messages = append(c.messages, ChatMessage{
		Role:      role,
		Content:   content,
		Timestamp: time.Now(),
	})

	// Format and display message
	var formatted string
	if role == "user" {
		formatted = fmt.Sprintf("[blue]╭─ You [gray]• %s[reset]\n", time.Now().Format("15:04"))
		formatted += fmt.Sprintf("[white]%s[reset]\n\n", content)
	} else {
		formatted = fmt.Sprintf("[green]╭─ Assistant [gray]• %s[reset]\n", time.Now().Format("15:04"))
		formatted += fmt.Sprintf("[gray]%s[reset]\n\n", content)
	}

	c.chatView.Write([]byte(formatted))

	// Auto-scroll to bottom
	c.chatView.ScrollToEnd()
}

func (c *ChatView) sendMessage() {
	text := c.input.GetText()
	text = strings.TrimSpace(text)
	if text == "" || c.isStreaming {
		return
	}

	// Clear input
	c.input.SetText("", false)

	// Add user message
	c.addMessage("user", text)

	// Set streaming state
	c.isStreaming = true
	c.updateStatus()

	// Call malikclaw agent with the message
	go func() {
		response, err := c.callAgent(text)
		c.app.QueueUpdateDraw(func() {
			c.isStreaming = false
			if err != nil {
				c.addMessage("system", "Error: "+err.Error())
			} else {
				c.addMessage("assistant", response)
			}
			c.updateStatus()
		})
	}()
}

func (c *ChatView) callAgent(message string) (string, error) {
	// Build command with session and model
	args := []string{"agent", "-m", message, "-s", c.sessionKey}
	if c.model != "" {
		args = append(args, "--model", c.model)
	}

	cmd := exec.Command("malikclaw", args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("agent error: %w", err)
	}

	return strings.TrimSpace(string(output)), nil
}

func (c *ChatView) clearChat() {
	c.messages = make([]ChatMessage, 0)
	c.chatView.Clear()
	c.updateStatus()
}

func (c *ChatView) exportChat() {
	if len(c.messages) == 0 {
		return
	}

	// Create export content
	var export strings.Builder
	export.WriteString("# MalikClaw Chat Export\n")
	export.WriteString(fmt.Sprintf("Date: %s\n", time.Now().Format("2006-01-02 15:04:05")))
	export.WriteString(fmt.Sprintf("Model: %s\n\n", c.model))
	export.WriteString("---\n\n")

	for _, msg := range c.messages {
		role := msg.Role
		if role == "assistant" {
			role = "Assistant"
		} else if role == "user" {
			role = "You"
		}
		export.WriteString(fmt.Sprintf("## %s - %s\n\n", role, msg.Timestamp.Format("15:04")))
		export.WriteString(msg.Content + "\n\n")
	}

	// Write to file
	filename := fmt.Sprintf("chat-export-%s.md", time.Now().Format("20060102-150405"))
	if err := os.WriteFile(filename, []byte(export.String()), 0o644); err != nil {
		return
	}

	// Show confirmation
	c.addMessage("system", fmt.Sprintf("Chat exported to: %s", filename))
}

func (c *ChatView) showHelp() {
	helpText := `[yellow]Chat Interface Help

[green]Shortcuts:
  [white]Ctrl+Enter[green] - Send message
  [white]Ctrl+Q[green]    - Quit chat
  [white]Ctrl+C[green]    - Clear chat
  [white]Ctrl+E[green]    - Export chat
  [white]Ctrl+H[green]    - Show this help
  [white]Esc[green]       - Go back

[green]Tips:
  - Multi-line input supported
  - Chat auto-saves on export
  - Status updates every 2s
`

	modal := tview.NewModal().
		SetText(helpText).
		AddButtons([]string{"OK"}).
		SetDoneFunc(func(_ int, _ string) {
			c.appState.pages.RemovePage("help")
		})
	modal.SetTitle(" Help ").SetBorder(true)
	modal.SetBackgroundColor(tview.Styles.ContrastBackgroundColor)
	c.appState.pages.AddPage("help", modal, true, true)
}
