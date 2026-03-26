package ui

import (
	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"
)

const (
	colorBlue = "[#3e5db9]"
	colorRed  = "[#d54646]"
	banner    = "\r\n[::b]" +
		colorBlue + "███╗   ███╗ █████╗ ██╗     ██╗██╗  ██╗" + colorRed + " ██████╗██╗      █████╗ ██╗    ██╗\n" +
		colorBlue + "████╗ ████║██╔══██╗██║     ██║██║ ██╔╝" + colorRed + "██╔════╝██║     ██╔══██╗██║    ██║\n" +
		colorBlue + "██╔████╔██║███████║██║     ██║█████╔╝ " + colorRed + "██║     ██║     ███████║██║ █╗ ██║\n" +
		colorBlue + "██║╚██╔╝██║██╔══██║██║     ██║██╔═██╗ " + colorRed + "██║     ██║     ██╔══██║██║███╗██║\n" +
		colorBlue + "██║ ╚═╝ ██║██║  ██║███████╗██║██║  ██╗" + colorRed + "╚██████╗███████╗██║  ██║╚███╔███╔╝\n" +
		colorBlue + "╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝" + colorRed + " ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝\n " +
		"[:]"
)

func applyStyles() {
	tview.Styles.PrimitiveBackgroundColor = tcell.NewRGBColor(12, 13, 22)
	tview.Styles.ContrastBackgroundColor = tcell.NewRGBColor(34, 19, 53)
	tview.Styles.MoreContrastBackgroundColor = tcell.NewRGBColor(18, 18, 32)
	tview.Styles.BorderColor = tcell.NewRGBColor(112, 102, 255)
	tview.Styles.TitleColor = tcell.NewRGBColor(255, 121, 198)
	tview.Styles.GraphicsColor = tcell.NewRGBColor(139, 233, 253)
	tview.Styles.PrimaryTextColor = tcell.NewRGBColor(241, 250, 255)
	tview.Styles.SecondaryTextColor = tcell.NewRGBColor(80, 250, 123)
	tview.Styles.TertiaryTextColor = tcell.NewRGBColor(139, 233, 253)
	tview.Styles.InverseTextColor = tcell.NewRGBColor(12, 13, 22)
	tview.Styles.ContrastSecondaryTextColor = tcell.NewRGBColor(189, 147, 249)
}

func bannerView() *tview.TextView {
	text := tview.NewTextView()
	text.SetDynamicColors(true)
	text.SetTextAlign(tview.AlignCenter)
	text.SetBackgroundColor(tview.Styles.PrimitiveBackgroundColor)
	text.SetText(banner)
	text.SetBorder(false)
	return text
}

const footerText = "Esc: Back/Exit | Enter: Enter | ←↓↑→ : Move | Space: Select | Tab/Shift+Tab: Switch"
const chatFooterText = "Ctrl+Enter: Send | Ctrl+Q: Quit | Ctrl+C: Clear | Ctrl+E: Export | Ctrl+H: Help | Esc: Back"

func footerView() *tview.TextView {
	text := tview.NewTextView()
	text.SetTextAlign(tview.AlignCenter)
	text.SetText(footerText)
	text.SetBackgroundColor(tview.Styles.MoreContrastBackgroundColor)
	text.SetTextColor(tview.Styles.PrimaryTextColor)
	text.SetBorder(false)
	return text
}

func chatFooterView() *tview.TextView {
	text := tview.NewTextView()
	text.SetTextAlign(tview.AlignCenter)
	text.SetText(chatFooterText)
	text.SetBackgroundColor(tview.Styles.MoreContrastBackgroundColor)
	text.SetTextColor(tview.Styles.SecondaryTextColor)
	text.SetBorder(false)
	return text
}
