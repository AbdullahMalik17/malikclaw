package ui

import (
	"fmt"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type SpinnerModel struct {
	spinner  spinner.Model
	message  string
	quitting bool
}

func NewSpinnerModel(message string) SpinnerModel {
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(ColorPrimary)
	return SpinnerModel{
		spinner: s,
		message: message,
	}
}

func (m SpinnerModel) Init() tea.Cmd {
	return m.spinner.Tick
}

func (m SpinnerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "esc", "ctrl+c":
			m.quitting = true
			return m, tea.Quit
		default:
			return m, nil
		}
	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	default:
		return m, nil
	}
}

func (m SpinnerModel) View() string {
	if m.quitting {
		return ""
	}
	str := fmt.Sprintf("\n %s %s", m.spinner.View(), m.message)
	return str
}

// ShowSpinner runs a spinner in a separate goroutine and returns a stop function
func ShowSpinner(message string) func() {
	p := tea.NewProgram(NewSpinnerModel(message))
	go func() {
		if _, err := p.Run(); err != nil {
			fmt.Printf("Error running spinner: %v\n", err)
		}
	}()
	return func() {
		p.Quit()
	}
}
