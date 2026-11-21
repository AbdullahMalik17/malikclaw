package onboard

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/skills"
)

func TestOnboardWizard_EnglishWithMockOllamaTelegramWhatsAppADB(t *testing.T) {
	ollamaSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/api/tags", r.URL.Path)
		_ = json.NewEncoder(w).Encode(map[string]any{
			"models": []map[string]string{
				{"name": "qwen2.5:7b"},
			},
		})
	}))
	defer ollamaSrv.Close()

	tmpDir := t.TempDir()
	wsDir := filepath.Join(tmpDir, "workspace")
	cfgPath := filepath.Join(tmpDir, "config.json")

	// Scripted answers:
	// 1. Language: 1 (English)
	// 2. Workspace path: <wsDir>
	// 3. Name/city: Malik in Lahore
	// 4. Provider choice: 1 (Detected Ollama qwen2.5:7b)
	// 5. Smart Cost Router: y
	// 6. DuckDuckGo: y
	// 7. Telegram: y -> token -> allowUser
	// 8. WhatsApp: y -> bridgeURL (default) -> phone
	input := strings.Join([]string{
		"1",
		wsDir,
		"Malik in Lahore",
		"1",
		"y",
		"y",
		"y",
		"123456:TG_MOCK_TOKEN",
		"@malik_test",
		"y",
		"",
		"+923001234567",
	}, "\n") + "\n"

	var out bytes.Buffer
	wizard := NewOnboardWizardWithOptions(OnboardWizardOptions{
		In:         strings.NewReader(input),
		Out:        &out,
		HTTPClient: ollamaSrv.Client(),
		OllamaURL:  ollamaSrv.URL,
		LookPath: func(name string) (string, error) {
			if name == "adb" {
				return "/usr/bin/adb", nil
			}
			return "", errors.New("not found")
		},
		ConfigPath: cfgPath,
	})

	require.NoError(t, wizard.RunWithError())

	output := out.String()
	assert.Contains(t, output, "Detected local Ollama running")
	assert.Contains(t, output, "qwen2.5:7b")
	assert.Contains(t, output, "Android ADB detected at /usr/bin/adb")

	cfg, err := config.LoadConfig(cfgPath)
	require.NoError(t, err)

	assert.Equal(t, wsDir, cfg.Agents.Defaults.Workspace)
	assert.Equal(t, "ollama-qwen2.5:7b", cfg.Agents.Defaults.ModelName)
	require.NotNil(t, cfg.Agents.Defaults.Routing)
	assert.True(t, cfg.Agents.Defaults.Routing.Enabled)
	assert.Equal(t, "smart", cfg.Agents.Defaults.Routing.Mode)
	assert.Equal(t, "ollama/qwen2.5:7b", cfg.Agents.Defaults.Routing.FastModel)
	assert.True(t, cfg.Tools.Web.DuckDuckGo.Enabled)

	assert.True(t, cfg.Channels.Telegram.Enabled)
	assert.Equal(t, "123456:TG_MOCK_TOKEN", cfg.Channels.Telegram.Token)
	assert.Equal(t, config.FlexibleStringSlice{"@malik_test"}, cfg.Channels.Telegram.AllowFrom)

	assert.True(t, cfg.Channels.WhatsApp.Enabled)
	assert.Equal(t, "ws://localhost:3001", cfg.Channels.WhatsApp.BridgeURL)
	assert.Equal(t, config.FlexibleStringSlice{"+923001234567"}, cfg.Channels.WhatsApp.AllowFrom)

	// Verify embedded daily-life skills are valid SKILL.md manifests
	loader := skills.NewSkillsLoader(wsDir, "", "")
	listed := loader.ListSkills()
	skillMap := make(map[string]skills.SkillInfo, len(listed))
	for _, s := range listed {
		skillMap[s.Name] = s
	}
	for _, requiredSkill := range []string{"morning-briefing", "urdu-reminders", "chat-assistant", "android-remote"} {
		assert.Contains(t, skillMap, requiredSkill)
	}

	androidBody, ok := loader.LoadSkill("android-remote")
	require.True(t, ok)
	assert.Contains(t, androidBody, `"operation": "screenshot"`)
	assert.NotContains(t, androidBody, "--action open-url")

	userMD, err := os.ReadFile(filepath.Join(wsDir, "USER.md"))
	require.NoError(t, err)
	assert.Contains(t, string(userMD), "Malik in Lahore")
}

func TestOnboardWizard_UrduAndRomanUrduFlows(t *testing.T) {
	tests := []struct {
		name         string
		langChoice   string
		wantContains string
	}{
		{
			name:         "urdu flow",
			langChoice:   "2",
			wantContains: "ملک کلاؤ",
		},
		{
			name:         "roman urdu flow",
			langChoice:   "3",
			wantContains: "khush aamdeed",
		},
	}

	func TestDetectOllamaModelsRejectsBlockedURLs(t *testing.T) {
		tests := []struct {
			name string
			url  string
		}{
			{name: "cloud metadata", url: "http://169.254.169.254/latest/api/tags"},
			{name: "private address", url: "http://192.168.1.20:11434"},
			{name: "file scheme", url: "file:///tmp/models"},
			{name: "empty host", url: "http:///api/tags"},
		}

		for _, tc := range tests {
			t.Run(tc.name, func(t *testing.T) {
				wizard := NewOnboardWizardWithOptions(OnboardWizardOptions{
					In:        strings.NewReader(""),
					Out:        &bytes.Buffer{},
					OllamaURL: tc.url,
					LookPath: func(string) (string, error) {
						return "", errors.New("not found")
					},
				})
				if got := wizard.detectOllamaModels(); len(got) != 0 {
					t.Fatalf("detectOllamaModels(%q) = %v, want no models", tc.url, got)
				}
			})
		}
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			tmpDir := t.TempDir()
			wsDir := filepath.Join(tmpDir, "workspace")
			cfgPath := filepath.Join(tmpDir, "config.json")

			input := strings.Join([]string{
				tc.langChoice,
				wsDir,
				"",
				"1", // Gemini (since Ollama unreachable)
				"mock-gemini-key",
				"y", // SmartCostRouter
				"y", // DuckDuckGo
				"n", // Telegram
				"n", // WhatsApp
			}, "\n") + "\n"

			var out bytes.Buffer
			wizard := NewOnboardWizardWithOptions(OnboardWizardOptions{
				In:        strings.NewReader(input),
				Out:       &out,
				OllamaURL: "http://127.0.0.1:1", // unreachable fast fail
				LookPath: func(string) (string, error) {
					return "", errors.New("no adb")
				},
				ConfigPath: cfgPath,
			})

			require.NoError(t, wizard.RunWithError())
			assert.Contains(t, out.String(), tc.wantContains)

			cfg, err := config.LoadConfig(cfgPath)
			require.NoError(t, err)
			require.NotNil(t, cfg.Agents.Defaults.Routing)
			assert.Equal(t, "gemini-2.5-flash", cfg.Agents.Defaults.Routing.FastModel)
		})
	}
}
