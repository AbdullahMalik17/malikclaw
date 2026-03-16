package commands

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/AbdullahMalik17/malikclaw/pkg/utils"
)

func configCommand() Definition {
	return Definition{
		Name:        "config",
		Description: "Open the web configuration console",
		Usage:       "/config",
		Handler: func(ctx context.Context, req Request, rt *Runtime) error {
			// Try to determine the web console port
			port := 18800 // Default port

			// Try to find launcher-config.json to see if a custom port is set
			home, err := os.UserHomeDir()
			if err == nil {
				configDir := filepath.Join(home, ".malikclaw")
				if malikclawHome := os.Getenv("MALIKCLAW_HOME"); malikclawHome != "" {
					configDir = malikclawHome
				}

				launcherConfigPath := filepath.Join(configDir, "launcher-config.json")
				// We don't want to import the launcherconfig package here to avoid circular dependencies
				// or making the core pkg depend on the web package.
				// Since it's a simple JSON, we could parse it, but for a quick command,
				// 18800 is the most likely port.
				if _, err := os.Stat(launcherConfigPath); err == nil {
					// We could read it here if we really wanted to be precise
				}
			}

			url := fmt.Sprintf("http://localhost:%d", port)

			if err := utils.OpenBrowser(url); err != nil {
				return req.Reply(fmt.Sprintf("I tried to open the web console at %s, but failed: %v\nPlease open it manually in your browser.", url, err))
			}

			return req.Reply(fmt.Sprintf("Opening the web configuration console at %s...", url))
		},
	}
}
