package skills

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/spf13/cobra"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/pkg/skills"
)

func newInstallCommand(installerFn func() (*skills.SkillInstaller, error)) *cobra.Command {
	var registry string
	var global bool

	cmd := &cobra.Command{
		Use:   "install",
		Short: "Install skill from GitHub",
		Example: `
malikclaw skills install AbdullahMalik17/malikclaw-skills/weather
malikclaw skills install --global AbdullahMalik17/malikclaw-skills/weather
malikclaw skills install --registry clawhub github
`,
		Args: func(cmd *cobra.Command, args []string) error {
			if registry != "" {
				if len(args) != 1 {
					return fmt.Errorf("when --registry is set, exactly 1 argument is required: <slug>")
				}
				return nil
			}

			if len(args) != 1 {
				return fmt.Errorf("exactly 1 argument is required: <github>")
			}

			return nil
		},
		RunE: func(cmd *cobra.Command, args []string) error {
			if registry != "" {
				cfg, err := internal.LoadConfig()
				if err != nil {
					return err
				}

				return skillsInstallFromRegistryWithTarget(cfg, registry, args[0], global)
			}

			installer, err := installerFn()
			if err != nil {
				return err
			}

			cmdCtx := cmd.Context()
			if cmdCtx == nil {
				cmdCtx = context.Background()
			}
			ctx, cancel := context.WithTimeout(cmdCtx, 60*time.Second)
			defer cancel()

			if global {
				home, homeErr := os.UserHomeDir()
				if homeErr != nil || home == "" {
					home = os.Getenv("HOME")
				}
				if home == "" {
					return fmt.Errorf("cannot determine home directory for --global install")
				}
				globalAgentsSkills := filepath.Join(home, ".agents", "skills")
				if err := installer.InstallFromGitHubToDir(ctx, args[0], globalAgentsSkills); err != nil {
					return err
				}
				fmt.Fprintf(cmd.OutOrStdout(), "✓ Skill '%s' installed globally to %s\n", args[0], globalAgentsSkills)
				return nil
			}

			if err := installer.InstallFromGitHub(ctx, args[0]); err != nil {
				return err
			}
			fmt.Fprintf(cmd.OutOrStdout(), "✓ Skill '%s' installed successfully!\n", args[0])
			return nil
		},
	}

	cmd.Flags().StringVar(&registry, "registry", "", "Install from registry: --registry <name> <slug>")
	cmd.Flags().BoolVarP(&global, "global", "g", false, "Install skill globally into ~/.agents/skills")

	return cmd
}
