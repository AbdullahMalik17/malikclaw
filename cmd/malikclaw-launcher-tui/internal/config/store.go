package configstore

import (
	"errors"
	"os"
	"path/filepath"

	malikclawconfig "github.com/AbdullahMalik17/malikclaw/pkg/config"
)

const (
	configDirName  = ".malikclaw"
	configFileName = "config.json"
)

func ConfigPath() (string, error) {
	dir, err := ConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, configFileName), nil
}

func ConfigDir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, configDirName), nil
}

func Load() (*malikclawconfig.Config, error) {
	path, err := ConfigPath()
	if err != nil {
		return nil, err
	}
	return malikclawconfig.LoadConfig(path)
}

func Save(cfg *malikclawconfig.Config) error {
	if cfg == nil {
		return errors.New("config is nil")
	}
	path, err := ConfigPath()
	if err != nil {
		return err
	}
	return malikclawconfig.SaveConfig(path, cfg)
}
