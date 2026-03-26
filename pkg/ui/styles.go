package ui

import (
	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
)

var (
	// Colors
	ColorPrimary   = lipgloss.Color("#3E5DB9") // MalikClaw Blue
	ColorSecondary = lipgloss.Color("#D54646") // MalikClaw Red
	ColorAccent    = lipgloss.Color("#00ADD8") // Go Blue
	ColorSuccess   = lipgloss.Color("#4CAF50")
	ColorWarning   = lipgloss.Color("#FF9800")
	ColorError     = lipgloss.Color("#F44336")
	ColorGray      = lipgloss.Color("#757575")

	// Styles
	StyleBanner = lipgloss.NewStyle().
			Foreground(ColorPrimary).
			Bold(true)

	StyleHeader = lipgloss.NewStyle().
			Foreground(ColorPrimary).
			Bold(true).
			Underline(true).
			MarginTop(1).
			MarginBottom(1)

	StyleSuccess = lipgloss.NewStyle().
			Foreground(ColorSuccess).
			Bold(true)

	StyleError = lipgloss.NewStyle().
			Foreground(ColorError).
			Bold(true)

	StyleInfo = lipgloss.NewStyle().
			Foreground(ColorAccent)

	StyleMuted = lipgloss.NewStyle().
			Foreground(ColorGray)

	StyleBox = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(ColorPrimary).
			Padding(1, 2).
			Margin(1, 0)

	StyleAgentName = lipgloss.NewStyle().
			Foreground(ColorPrimary).
			Bold(true).
			PaddingLeft(1).
			PaddingRight(1).
			Background(lipgloss.Color("#F0F0F0"))

	StyleUserName = lipgloss.NewStyle().
			Foreground(ColorSecondary).
			Bold(true)
)

func RenderMarkdown(content string) (string, error) {
	r, err := glamour.NewTermRenderer(
		glamour.WithAutoStyle(),
		glamour.WithWordWrap(100),
	)
	if err != nil {
		return content, err
	}

	return r.Render(content)
}
