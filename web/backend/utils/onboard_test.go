package utils

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestOnboardHelperProcess(t *testing.T) {
	if os.Getenv("GO_WANT_ONBOARD_HELPER") != "1" {
		return
	}
	switch os.Getenv("ONBOARD_HELPER_MODE") {
	case "create-config":
		configPath := os.Getenv("MALIKCLAW_CONFIG")
		expectedPath := os.Getenv("EXPECTED_CONFIG_PATH")
		if configPath != expectedPath {
			fmt.Fprintf(os.Stderr, "MALIKCLAW_CONFIG = %q, want %q\n", configPath, expectedPath)
			os.Exit(1)
		}
		if err := os.MkdirAll(filepath.Dir(configPath), 0o755); err != nil {
			fmt.Fprintf(os.Stderr, "mkdir failed: %v\n", err)
			os.Exit(1)
		}
		if err := os.WriteFile(configPath, []byte("{}"), 0o644); err != nil {
			fmt.Fprintf(os.Stderr, "write failed: %v\n", err)
			os.Exit(1)
		}
		os.Exit(0)
	case "noop":
		os.Exit(0)
	case "fail":
		fmt.Fprintln(os.Stderr, "onboarding failed")
		os.Exit(2)
	default:
		os.Exit(1)
	}
}

func TestEnsureOnboardedSkipsWhenConfigExists(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	if err := os.WriteFile(configPath, []byte(`{}`), 0o644); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	origExecCommand := execCommand
	defer func() { execCommand = origExecCommand }()

	t.Setenv("GO_WANT_ONBOARD_HELPER", "1")
	t.Setenv("ONBOARD_HELPER_MODE", "fail")

	called := false
	execCommand = func(name string, args ...string) *exec.Cmd {
		called = true
		return exec.Command(os.Args[0], "-test.run=^TestOnboardHelperProcess$")
	}

	if err := EnsureOnboarded(configPath); err != nil {
		t.Fatalf("EnsureOnboarded() error = %v", err)
	}
	if called {
		t.Fatal("expected onboard command not to run when config already exists")
	}
}

func TestEnsureOnboardedRunsOnboardWhenConfigMissing(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	t.Setenv("EXPECTED_CONFIG_PATH", configPath)
	t.Setenv("GO_WANT_ONBOARD_HELPER", "1")
	t.Setenv("ONBOARD_HELPER_MODE", "create-config")

	origExecCommand := execCommand
	defer func() { execCommand = origExecCommand }()

	var gotName string
	var gotArgs []string
	execCommand = func(name string, args ...string) *exec.Cmd {
		gotName = name
		gotArgs = append([]string(nil), args...)
		return exec.Command(os.Args[0], "-test.run=^TestOnboardHelperProcess$")
	}

	if err := EnsureOnboarded(configPath); err != nil {
		t.Fatalf("EnsureOnboarded() error = %v", err)
	}
	if gotName == "" {
		t.Fatal("expected onboard command to run")
	}
	if len(gotArgs) != 1 || gotArgs[0] != "onboard" {
		t.Fatalf("command args = %#v, want []string{\"onboard\"}", gotArgs)
	}
	if _, err := os.Stat(configPath); err != nil {
		t.Fatalf("expected config to be created: %v", err)
	}
}

func TestEnsureOnboardedFailsWhenOnboardDoesNotCreateConfig(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	t.Setenv("GO_WANT_ONBOARD_HELPER", "1")
	t.Setenv("ONBOARD_HELPER_MODE", "noop")

	origExecCommand := execCommand
	defer func() { execCommand = origExecCommand }()

	execCommand = func(name string, args ...string) *exec.Cmd {
		return exec.Command(os.Args[0], "-test.run=^TestOnboardHelperProcess$")
	}

	if err := EnsureOnboarded(configPath); err == nil {
		t.Fatal("EnsureOnboarded() error = nil, want failure when onboard does not create config")
	}
}

func TestEnsureOnboardedIncludesOnboardOutputOnFailure(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	t.Setenv("GO_WANT_ONBOARD_HELPER", "1")
	t.Setenv("ONBOARD_HELPER_MODE", "fail")

	origExecCommand := execCommand
	defer func() { execCommand = origExecCommand }()

	execCommand = func(name string, args ...string) *exec.Cmd {
		return exec.Command(os.Args[0], "-test.run=^TestOnboardHelperProcess$")
	}

	err := EnsureOnboarded(configPath)
	if err == nil {
		t.Fatal("EnsureOnboarded() error = nil, want failure")
	}
	if !strings.Contains(err.Error(), "onboarding failed") {
		t.Fatalf("error = %q, want onboard output included", err)
	}
}
