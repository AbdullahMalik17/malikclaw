package skills

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSimpleRegistry_SSRFBlockedByDefault(t *testing.T) {
	_, err := fetchSimpleRegistryWithOptions(context.Background(), "http://127.0.0.1:8080/reg.json", false)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "SSRF")

	err = downloadSimpleSkillToDir(context.Background(), SimpleSkill{
		Name:       "evil-skill",
		Version:    "1.0.0",
		InstallURL: "http://169.254.169.254/latest/meta-data",
	}, t.TempDir(), false)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "SSRF")
}

func TestSimpleRegistry_FetchAndDownloadSkillMD(t *testing.T) {
	var srvURL string
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/registry.json":
			_ = json.NewEncoder(w).Encode(SimpleRegistry{
				Skills: []SimpleSkill{
					{
						Name:        "morning-briefing",
						Description: "Morning briefing",
						Version:     "2.0.0",
						InstallURL:  srvURL + "/skills/morning-briefing/SKILL.md",
					},
				},
			})
		case "/skills/morning-briefing/SKILL.md":
			_, _ = w.Write([]byte("---\nname: morning-briefing\ndescription: Daily summary\n---\n# Morning Briefing\n"))
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	}))
	defer srv.Close()
	srvURL = srv.URL

	reg, err := fetchSimpleRegistryWithOptions(context.Background(), srv.URL+"/registry.json", true)
	require.NoError(t, err)
	require.Len(t, reg.Skills, 1)

	targetBase := t.TempDir()
	err = downloadSimpleSkillToDir(context.Background(), reg.Skills[0], targetBase, true)
	require.NoError(t, err)

	data, err := os.ReadFile(filepath.Join(targetBase, "morning-briefing", "SKILL.md"))
	require.NoError(t, err)
	assert.Contains(t, string(data), "Daily summary")
}

func TestSimpleRegistry_DownloadZipSkill(t *testing.T) {
	var buf bytes.Buffer
	zw := zip.NewWriter(&buf)
	w, err := zw.Create("SKILL.md")
	require.NoError(t, err)
	_, err = w.Write([]byte("---\nname: zip-skill\ndescription: Zip skill\n---\n# Zip Skill\n"))
	require.NoError(t, err)
	require.NoError(t, zw.Close())

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/zip")
		_, _ = w.Write(buf.Bytes())
	}))
	defer srv.Close()

	targetBase := t.TempDir()
	err = downloadSimpleSkillToDir(context.Background(), SimpleSkill{
		Name:       "zip-skill",
		Version:    "1.0.0",
		InstallURL: srv.URL + "/zip-skill.zip",
	}, targetBase, true)
	require.NoError(t, err)

	data, err := os.ReadFile(filepath.Join(targetBase, "zip-skill", "SKILL.md"))
	require.NoError(t, err)
	assert.Contains(t, string(data), "Zip skill")
}
