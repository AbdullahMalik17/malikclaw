# MalikClaw Launcher TUI

Interactive Terminal UI for MalikClaw AI Agent.

## Features

- **Model Management**: Configure and switch between AI models
- **Channel Configuration**: Set up messaging channels (Telegram, Discord, etc.)
- **Interactive Chat**: Real-time chat interface with the AI agent
- **Gateway Control**: Start/stop the gateway for channel integration
- **Live Status**: Monitor memory usage and agent status

## Installation

```bash
go build -o malikclaw-tui ./cmd/malikclaw-launcher-tui
```

## Usage

Run the TUI:

```bash
./malikclaw-tui
```

## Keyboard Shortcuts

### Main Menu
- `↑/↓` - Navigate menu items
- `Enter` - Select item
- `Esc` - Exit
- `Space` - Quick select (model/channel)

### Chat Interface
- `Ctrl+Enter` - Send message
- `Ctrl+Q` - Quit chat
- `Ctrl+C` - Clear chat history
- `Ctrl+E` - Export chat to Markdown
- `Esc` - Go back to main menu

### Configuration Forms
- `Tab` - Navigate between fields
- `Enter` - Confirm action
- `Esc` - Go back

## Architecture

```
cmd/malikclaw-launcher-tui/
├── main.go              # Entry point
└── internal/
    ├── config/          # Configuration management
    │   └── store.go
    └── ui/              # UI components
        ├── app.go       # Main application state
        ├── chat.go      # Interactive chat interface
        ├── channel.go   # Channel configuration forms
        ├── menu.go      # Menu component
        ├── model.go     # Model configuration forms
        ├── style.go     # Theme and styling
        └── gateway_*.go # Platform-specific gateway handling
```

## Chat Interface

The interactive chat interface provides:

1. **Conversation View**: Real-time message display with timestamps
2. **Status Sidebar**: Live memory usage, model info, session details
3. **Input Area**: Multi-line text input with keyboard shortcuts
4. **Export**: Save conversations as Markdown files

## Configuration

Configuration is stored in the same format as the main `malikclaw` CLI:

- **Linux/macOS**: `~/.config/malikclaw/config.yaml`
- **Windows**: `%APPDATA%\malikclaw\config.yaml`

## License

MIT License - See [LICENSE](../../LICENSE) for details.
