package skills

import (
	"fmt"
	"strings"

	"github.com/spf13/cobra"

	"github.com/AbdullahMalik17/malikclaw/pkg/skills"
)

func newListCommand(loaderFn func() (*skills.SkillsLoader, error)) *cobra.Command {
	cmd := &cobra.Command{
		Use:     "list",
		Short:   "List installed skills",
		Example: `malikclaw skills list`,
		RunE: func(cmd *cobra.Command, _ []string) error {
			loader, err := loaderFn()
			if err != nil {
				return err
			}

			installed := loader.ListSkills()
			out := cmd.OutOrStdout()
			if len(installed) == 0 {
				fmt.Fprintln(out, "No skills installed.")
				return nil
			}

			fmt.Fprintf(out, "%-24s %-18s %s\n", "NAME", "SOURCE", "DESCRIPTION")
			fmt.Fprintln(out, strings.Repeat("-", 72))
			for _, s := range installed {
				fmt.Fprintf(out, "%-24s %-18s %s\n", s.Name, s.Source, s.Description)
			}
			return nil
		},
	}

	return cmd
}
