package config

import (
	"encoding/json"
	"fmt"

	"github.com/spf13/cobra"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/pkg/ui"
)

func NewConfigCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "config",
		Short: "Manage MalikClaw configuration",
	}

	cmd.AddCommand(
		newConfigShowCommand(),
		newConfigPathCommand(),
	)

	return cmd
}

func newConfigShowCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "show",
		Short: "Show current configuration",
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := internal.LoadConfig()
			if err != nil {
				return err
			}

			data, err := json.MarshalIndent(cfg, "", "  ")
			if err != nil {
				return err
			}

			fmt.Println(ui.StyleHeader.Render("Current Configuration:"))
			rendered, _ := ui.RenderMarkdown(fmt.Sprintf("```json\n%s\n```", string(data)))
			fmt.Println(rendered)
			return nil
		},
	}
}

func newConfigPathCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "path",
		Short: "Show configuration file path",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Printf("%s %s\n", ui.StyleInfo.Render("Config path:"), internal.GetConfigPath())
		},
	}
}
