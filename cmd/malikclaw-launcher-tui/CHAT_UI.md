# Enhanced Interactive Chat TUI for MalikClaw

## Overview

This document describes the enhanced interactive chat interface added to the MalikClaw Launcher TUI.

## What Was Built

### 1. Interactive Chat Interface (`chat.go`)

A full-featured terminal-based chat UI that allows users to interact with the MalikClaw AI agent in real-time.

**Features:**
- **Real-time conversation view** with formatted messages and timestamps
- **Live status sidebar** showing:
  - Current model name
  - Session key
  - Memory usage (Alloc, Sys, NumGC)
  - Message count
  - Connection status
- **Multi-line input area** with placeholder text
- **Keyboard shortcuts** for common actions

### 2. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Send message |
| `Ctrl+Q` | Quit chat |
| `Ctrl+C` | Clear chat history |
| `Ctrl+E` | Export chat to Markdown |
| `Ctrl+H` | Show help modal |
| `Esc` | Go back to main menu |

### 3. Chat Export

Chats can be exported to Markdown files with the format:
```markdown
# MalikClaw Chat Export
Date: 2026-03-26 15:04:05
Model: openai/gpt-4

---

## You - 15:04

Hello, how can I optimize my Go code?

## Assistant - 15:04

Here are some tips for optimizing Go code...
```

### 4. Dynamic Footer

The footer automatically updates based on the current view:
- **Main menu**: Shows navigation shortcuts
- **Chat view**: Shows chat-specific shortcuts

### 5. Integration with Main Menu

The main menu now includes a new "**Chat (Interactive)**" option that:
- Validates model configuration before opening
- Handles unsaved configuration changes
- Launches the chat interface seamlessly

## File Structure

```
cmd/malikclaw-launcher-tui/internal/ui/
├── chat.go          # NEW: Interactive chat interface
├── app.go           # UPDATED: Added chat integration
├── style.go         # UPDATED: Added chat footer
├── menu.go          # Menu component
├── model.go         # Model configuration
└── channel.go       # Channel configuration
```

## Usage

### Building

```bash
# Build the TUI
go build -o malikclaw-tui ./cmd/malikclaw-launcher-tui

# Build the main CLI
go build -o malikclaw ./cmd/malikclaw
```

### Running

1. Start the TUI:
   ```bash
   ./malikclaw-tui
   ```

2. Configure a model in the Model menu if not already done

3. Select "**Chat (Interactive)**" from the main menu

4. Start chatting with your AI agent!

## Technical Details

### Architecture

The chat interface uses:
- **tview.TextView** for message display with dynamic colors
- **tview.TextArea** for multi-line input
- **tview.Modal** for help and confirmation dialogs
- **runtime.MemStats** for live memory monitoring
- **os/exec** to call the malikclaw agent command

### Message Flow

```
User Input → TextArea → sendMessage() → callAgent() → malikclaw CLI → Response → addMessage() → TextView
```

### Status Updates

A goroutine updates the status sidebar every 2 seconds using `time.Ticker` and `app.QueueUpdateDraw()` for thread-safe UI updates.

## Future Enhancements

Potential improvements for the chat interface:

1. **Streaming Responses**: Show responses as they're generated
2. **Conversation History**: Load/save chat sessions
3. **Model Switching**: Change models mid-conversation
4. **Code Syntax Highlighting**: Better formatting for code blocks
5. **Image/Attachment Support**: Send and receive media
6. **Voice Input**: Integration with speech-to-text
7. **Multi-Agent Support**: Switch between different agent configurations

## Testing

To test the chat interface:

1. Ensure you have a valid model configured with API key
2. Run `./malikclaw-tui`
3. Navigate to "Chat (Interactive)"
4. Type a message and press `Ctrl+Enter`
5. Verify the response appears in the chat view
6. Test export functionality with `Ctrl+E`

## Contributing

When contributing to the chat interface:
- Follow existing code style (consistent with the rest of the TUI)
- Add comments for complex logic
- Test on multiple terminal sizes (minimum 80x24 recommended)
- Ensure keyboard shortcuts don't conflict with existing bindings

## License

MIT License - See [LICENSE](../../LICENSE) for details.
