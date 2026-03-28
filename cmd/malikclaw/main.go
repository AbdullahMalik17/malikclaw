// MalikClaw - Ultra-lightweight personal AI agent
// Inspired by and based on nanobot: https://github.com/HKUDS/nanobot
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/spf13/cobra"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/agent"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/auth"
	configcmd "github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/config"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/cron"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/gateway"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/migrate"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/model"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/onboard"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/run"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/skills"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/status"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/version"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

func NewMalikclawCommand() *cobra.Command {
	short := fmt.Sprintf("%s MalikClaw - Personal AI Assistant v%s\n", internal.Logo, config.GetVersion())

	var configPath string

	cmd := &cobra.Command{
		Use:   "malikclaw",
		Short: short,
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			if configPath != "" {
				os.Setenv("MALIKCLAW_CONFIG", configPath)
			}
		},
		Example: "malikclaw agent -m \"hello\"\nmalikclaw --config ./my-config.json status",
	}

	cmd.PersistentFlags().StringVarP(&configPath, "config", "c", "", "Path to config file")

	cmd.AddCommand(
		onboard.NewOnboardCommand(),
		agent.NewAgentCommand(),
		run.NewRunCommand(),
		auth.NewAuthCommand(),
		configcmd.NewConfigCommand(),
		gateway.NewGatewayCommand(),
		status.NewStatusCommand(),
		cron.NewCronCommand(),
		migrate.NewMigrateCommand(),
		skills.NewSkillsCommand(),
		model.NewModelCommand(),
		version.NewVersionCommand(),
	)

	return cmd
}

func printBanner() {
	blue := lipgloss.Color("#3E5DB9")
	red := lipgloss.Color("#D54646")

	// High-impact, compact banner
	rawBanner := `███╗   ███╗ █████╗ ██╗     ██╗██╗  ██╗ ██████╗██╗      █████╗ ██╗    ██╗
████╗ ████║██╔══██╗██║     ██║██║ ██╔╝██╔════╝██║     ██╔══██╗██║    ██║
██╔████╔██║███████║██║     ██║█████╔╝ ██║     ██║     ███████║██║ █╗ ██║
██║╚██╔╝██║██╔══██║██║     ██║██╔═██╗ ██║     ██║     ██╔══██║██║███╗██║
██║ ╚═╝ ██║██║  ██║███████╗██║██║  ██╗╚██████╗███████╗██║  ██║╚███╔███╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝`

	lines := strings.Split(rawBanner, "\n")
	var styledBanner strings.Builder

	for _, line := range lines {
		runes := []rune(line)
		mid := len(runes) / 2
		
		leftPart := string(runes[:mid])
		rightPart := string(runes[mid:])
		
		styledBanner.WriteString(lipgloss.NewStyle().Foreground(blue).Bold(true).Render(leftPart))
		styledBanner.WriteString(lipgloss.NewStyle().Foreground(red).Bold(true).Render(rightPart))
		styledBanner.WriteString("\n")
	}

	fmt.Print(styledBanner.String())
	
	// Tagline and subtitle with elegant styling
	tagline := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#00ADD8")).
		Bold(true).
		Render(" 🦅 The Gryphon's Edge")
	
	versionInfo := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#757575")).
		Render(fmt.Sprintf(" v%s", config.GetVersion()))

	subtitle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#50FA7B")).
		Italic(true).
		Render(" Ultra-lightweight Personal AI Agent Framework")

	divider := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#44475A")).
		Render(strings.Repeat("━", 75))

	fmt.Println(divider)
	fmt.Printf("%s%s\n", tagline, versionInfo)
	fmt.Println(subtitle)
	fmt.Println(divider)
	fmt.Println()
}

func main() {
	printBanner()
	cmd := NewMalikclawCommand()
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
