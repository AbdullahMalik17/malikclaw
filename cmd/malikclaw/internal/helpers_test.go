package internal

import (
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetConfigPath(t *testing.T) {
	t.Setenv("HOME", "/tmp/home")

	got := GetConfigPath()
	want := filepath.Join("/tmp/home", ".malikclaw", "config.json")

	assert.Equal(t, want, got)
}

func TestGetConfigPath_WithMALIKCLAW_HOME(t *testing.T) {
	t.Setenv("MALIKCLAW_HOME", "/custom/malikclaw")
	t.Setenv("HOME", "/tmp/home")

	got := GetConfigPath()
	want := filepath.Join("/custom/malikclaw", "config.json")

	assert.Equal(t, want, got)
}

func TestGetConfigPath_WithMALIKCLAW_CONFIG(t *testing.T) {
	t.Setenv("MALIKCLAW_CONFIG", "/custom/config.json")
	t.Setenv("MALIKCLAW_HOME", "/custom/malikclaw")
	t.Setenv("HOME", "/tmp/home")

	got := GetConfigPath()
	want := "/custom/config.json"

	assert.Equal(t, want, got)
}

func TestGetConfigPath_Windows(t *testing.T) {
	if runtime.GOOS != "windows" {
		t.Skip("windows-specific HOME behavior varies; run on windows")
	}

	testUserProfilePath := `C:\Users\Test`
	t.Setenv("USERPROFILE", testUserProfilePath)

	got := GetConfigPath()
	want := filepath.Join(testUserProfilePath, ".malikclaw", "config.json")

	require.True(t, strings.EqualFold(got, want), "GetConfigPath() = %q, want %q", got, want)
}
