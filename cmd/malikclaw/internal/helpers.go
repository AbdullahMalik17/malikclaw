package internal

import (
	"os"
	"path/filepath"

	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

const Logo = "🦞"

// GetMalikclawHome returns the malikclaw home directory.
// Priority: $MALIKCLAW_HOME > ~/.malikclaw
func GetMalikclawHome() string {
	if home := os.Getenv("MALIKCLAW_HOME"); home != "" {
		return home
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".malikclaw")
}

func GetConfigPath() string {
	if configPath := os.Getenv("MALIKCLAW_CONFIG"); configPath != "" {
		return configPath
	}
	return filepath.Join(GetMalikclawHome(), "config.json")
}

func LoadConfig() (*config.Config, error) {
	return config.LoadConfig(GetConfigPath())
}

// FormatVersion returns the version string with optional git commit
// Deprecated: Use pkg/config.FormatVersion instead
func FormatVersion() string {
	return config.FormatVersion()
}

// FormatBuildInfo returns build time and go version info
// Deprecated: Use pkg/config.FormatBuildInfo instead
func FormatBuildInfo() (string, string) {
	return config.FormatBuildInfo()
}

// GetVersion returns the version string
// Deprecated: Use pkg/config.GetVersion instead
func GetVersion() string {
	return config.GetVersion()
}
