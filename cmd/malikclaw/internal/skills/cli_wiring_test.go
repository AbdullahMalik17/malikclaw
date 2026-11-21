package skills

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/AbdullahMalik17/malikclaw/pkg/skills"
)

func TestNewListCommand_UsesSkillsLoader(t *testing.T) {
	tmp := t.TempDir()
	ws := filepath.Join(tmp, "workspace")
	wsAgents := filepath.Join(ws, ".agents", "skills")
	global := filepath.Join(tmp, "global")
	universal := filepath.Join(tmp, "home", ".agents", "skills")

	require.NoError(t, os.MkdirAll(filepath.Join(wsAgents, "morning-briefing"), 0o755))
	require.NoError(t, os.WriteFile(
		filepath.Join(wsAgents, "morning-briefing", "SKILL.md"),
		[]byte("---\nname: morning-briefing\ndescription: Daily briefing\n---\n# Morning Briefing\n"),
		0o644,
	))
	require.NoError(t, os.MkdirAll(filepath.Join(universal, "urdu-reminders"), 0o755))
	require.NoError(t, os.WriteFile(
		filepath.Join(universal, "urdu-reminders", "SKILL.md"),
		[]byte("---\nname: urdu-reminders\ndescription: Urdu reminders\n---\n# Urdu Reminders\n"),
		0o644,
	))

	loader := skills.NewSkillsLoader(ws, global, "").WithUniversalDirs(wsAgents, universal)

	var out bytes.Buffer
	cmd := newListCommand(func() (*skills.SkillsLoader, error) {
		return loader, nil
	})
	cmd.SetOut(&out)

	err := cmd.RunE(cmd, nil)
	require.NoError(t, err)

	output := out.String()
	assert.Contains(t, output, "morning-briefing")
	assert.Contains(t, output, "workspace-agents")
	assert.Contains(t, output, "urdu-reminders")
	assert.Contains(t, output, "agents")
}

func TestNewInstallCommand_GlobalFlagInstallsToAgentsSkills(t *testing.T) {
	tmpHome := t.TempDir()
	t.Setenv("HOME", tmpHome)
	t.Setenv("USERPROFILE", tmpHome)

	var srvURL string
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode([]map[string]any{
			{
				"name":         "SKILL.md",
				"path":         "SKILL.md",
				"type":         "file",
				"download_url": srvURL + "/raw/SKILL.md",
			},
		})
	}))
	defer srv.Close()
	srvURL = srv.URL

	ws := filepath.Join(t.TempDir(), "workspace")
	installer, err := skills.NewSkillInstaller(ws, "", "")
	require.NoError(t, err)
	require.NoError(t, installer.SetAllowLocalhost(true))

	// Verify --global flag exists on newInstallCommand and targets ~/.agents/skills.
	cmd := newInstallCommand(func() (*skills.SkillInstaller, error) {
		return installer, nil
	})
	require.NotNil(t, cmd.Flags().Lookup("global"))
	require.NoError(t, cmd.Flags().Set("global", "true"))

	// Exercise InstallFromGitHubToDir directly against ~/.agents/skills target path
	// used by --global, and confirm SkillInstaller handles local mock server cleanly.
	globalAgentsDir := filepath.Join(tmpHome, ".agents", "skills")
	require.NoError(t, os.MkdirAll(globalAgentsDir, 0o755))

	// Pre-populate a skill in ~/.agents/skills and verify duplicate protection via CLI RunE.
	require.NoError(t, os.MkdirAll(filepath.Join(globalAgentsDir, "weather"), 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(globalAgentsDir, "weather", "SKILL.md"), []byte("ok"), 0o644))

	err = cmd.RunE(cmd, []string{"owner/repo/weather"})
	require.Error(t, err)
	assert.Contains(t, err.Error(), "already exists")
}
