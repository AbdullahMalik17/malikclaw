package utils

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

// GetDefaultConfigPath returns the default path to the malikclaw config file.
func GetDefaultConfigPath() string {
	if configPath := os.Getenv("MALIKCLAW_CONFIG"); configPath != "" {
		return configPath
	}
	if malikclawHome := os.Getenv("MALIKCLAW_HOME"); malikclawHome != "" {
		return filepath.Join(malikclawHome, "config.json")
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "config.json"
	}
	return filepath.Join(home, ".malikclaw", "config.json")
}

// FindMalikclawBinary locates the malikclaw executable.
// Search order:
//  1. MALIKCLAW_BINARY environment variable (explicit override)
//  2. Same directory as the current executable
//  3. The project's build/ directory relative to the current working directory
//  4. Falls back to "malikclaw" and relies on $PATH
func FindMalikclawBinary() string {
	binaryName := "malikclaw"
	if runtime.GOOS == "windows" {
		binaryName = "malikclaw.exe"
	}

	if p := os.Getenv("MALIKCLAW_BINARY"); p != "" {
		if info, _ := os.Stat(p); info != nil && !info.IsDir() {
			return p
		}
	}

	// 2. Same directory as current executable
	if exe, err := os.Executable(); err == nil {
		candidate := filepath.Join(filepath.Dir(exe), binaryName)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate
		}
	}

	// 3. build/ directory relative to CWD (useful for go run ./web/backend)
	cwd, err := os.Getwd()
	if err == nil {
		candidate := filepath.Join(cwd, "build", binaryName)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate
		}

		// Also check CWD itself
		candidate = filepath.Join(cwd, binaryName)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate
		}
	}

	return "malikclaw"
}

// GetLocalIP returns the local IP address of the machine.
func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, a := range addrs {
		if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() && ipnet.IP.To4() != nil {
			return ipnet.IP.String()
		}
	}
	return ""
}

// OpenBrowser automatically opens the given URL in the default browser.
func OpenBrowser(url string) error {
	switch runtime.GOOS {
	case "linux":
		return exec.Command("xdg-open", url).Start()
	case "windows":
		return exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		return exec.Command("open", url).Start()
	default:
		return fmt.Errorf("unsupported platform")
	}
}
