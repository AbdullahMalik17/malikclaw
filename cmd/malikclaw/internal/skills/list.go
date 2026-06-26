package skills

import (
	"github.com/spf13/cobra"

	"github.com/AbdullahMalik17/malikclaw/pkg/skills"
)

func newListCommand(loaderFn func() (*skills.SkillsLoader, error)) *cobra.Command {
	cmd := &cobra.Command{
		Use:     "list",
		Short:   "List installed skills",
		Example: `malikclaw skills list`,
		RunE: func(_ *cobra.Command, _ []string) error {
			// Call the new simple registry function
			return skills.ListSimpleSkills()
		},
	}

	return cmd
}
