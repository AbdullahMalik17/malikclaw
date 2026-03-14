// MalikClaw - Ultra-lightweight personal AI agent
// Inspired by and based on nanobot: https://github.com/HKUDS/nanobot
// License: MIT
//
// Copyright (c) 2026 MalikClaw contributors

package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/agent"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/auth"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/cron"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/gateway"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/migrate"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/model"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/onboard"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/skills"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/status"
	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal/version"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

func NewMalikclawCommand() *cobra.Command {
	short := fmt.Sprintf("%s malikclaw - Personal AI Assistant v%s\n\n", internal.Logo, config.GetVersion())

	cmd := &cobra.Command{
		Use:     "malikclaw",
		Short:   short,
		Example: "malikclaw version",
	}

	cmd.AddCommand(
		onboard.NewOnboardCommand(),
		agent.NewAgentCommand(),
		auth.NewAuthCommand(),
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

const (
	colorBlue = "\033[1;38;2;62;93;185m"
	colorRed  = "\033[1;38;2;213;70;70m"
	banner    = "\r\n" +
		colorBlue + "███╗   ███╗ █████╗ ██╗     ██╗██╗  ██╗" + colorRed + " ██████╗██╗      █████╗ ██╗    ██╗\n" +
		colorBlue + "████╗ ████║██╔══██╗██║     ██║██║ ██╔╝" + colorRed + "██╔════╝██║     ██╔══██╗██║    ██║\n" +
		colorBlue + "██╔████╔██║███████║██║     ██║█████╔╝ " + colorRed + "██║     ██║     ███████║██║ █╗ ██║\n" +
		colorBlue + "██║╚██╔╝██║██╔══██║██║     ██║██╔═██╗ " + colorRed + "██║     ██║     ██╔══██║██║███╗██║\n" +
		colorBlue + "██║ ╚═╝ ██║██║  ██║███████╗██║██║  ██╗" + colorRed + "╚██████╗███████╗██║  ██║╚███╔███╔╝\n" +
		colorBlue + "╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝" + colorRed + " ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝\n " +
		"\033[0m\r\n"
)

func main() {
	fmt.Printf("%s", banner)
	cmd := NewMalikclawCommand()
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
