package skills

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/security"
	"github.com/AbdullahMalik17/malikclaw/pkg/utils"
)

const SimpleRegistryURL = "https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/skills-registry.json"

type SimpleSkill struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Version     string   `json:"version"`
	Author      string   `json:"author"`
	InstallURL  string   `json:"install_url"`
	Tags        []string `json:"tags"`
}

type SimpleRegistry struct {
	Skills []SimpleSkill `json:"skills"`
}

func FetchSimpleRegistry() (*SimpleRegistry, error) {
	return fetchSimpleRegistryWithOptions(context.Background(), SimpleRegistryURL, false)
}

func fetchSimpleRegistryWithOptions(ctx context.Context, registryURL string, allowLocalhost bool) (*SimpleRegistry, error) {
	if err := security.ValidateURL(registryURL, allowLocalhost); err != nil {
		return nil, fmt.Errorf("registry URL blocked by SSRF policy: %w", err)
	}

	client, err := security.NewSafeHTTPClient(15*time.Second, "", allowLocalhost)
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP client: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, registryURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create registry request: %w", err)
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch registry: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("registry returned HTTP %d", resp.StatusCode)
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, 4*1024*1024))
	if err != nil {
		return nil, fmt.Errorf("failed to read registry response: %w", err)
	}

	var reg SimpleRegistry
	if err := json.Unmarshal(body, &reg); err != nil {
		return nil, fmt.Errorf("failed to parse registry: %w", err)
	}
	return &reg, nil
}

func ListSimpleSkills() error {
	reg, err := FetchSimpleRegistry()
	if err != nil {
		return err
	}
	fmt.Printf("%-20s %-10s %s\n", "NAME", "VERSION", "DESCRIPTION")
	fmt.Println(strings.Repeat("-", 60))
	for _, s := range reg.Skills {
		fmt.Printf("%-20s %-10s %s\n", s.Name, s.Version, s.Description)
	}
	return nil
}

func InstallSimpleSkill(name string) error {
	reg, err := FetchSimpleRegistry()
	if err != nil {
		return err
	}
	for _, s := range reg.Skills {
		if s.Name == name {
			return downloadSimpleSkill(s)
		}
	}
	return fmt.Errorf("skill '%s' not found in registry", name)
}

func downloadSimpleSkill(s SimpleSkill) error {
	home, _ := os.UserHomeDir()
	if home == "" {
		home = os.Getenv("HOME")
	}
	skillsBaseDir := filepath.Join(home, ".malikclaw", "skills")
	return downloadSimpleSkillToDir(context.Background(), s, skillsBaseDir, false)
}

func downloadSimpleSkillToDir(ctx context.Context, s SimpleSkill, skillsBaseDir string, allowLocalhost bool) error {
	if err := utils.ValidateSkillIdentifier(s.Name); err != nil {
		return fmt.Errorf("invalid skill name %q: %w", s.Name, err)
	}
	if strings.TrimSpace(s.InstallURL) == "" {
		return fmt.Errorf("skill %q has no install_url", s.Name)
	}
	if err := security.ValidateURL(s.InstallURL, allowLocalhost); err != nil {
		return fmt.Errorf("skill install_url %q blocked by SSRF policy: %w", s.InstallURL, err)
	}

	skillDir := filepath.Join(skillsBaseDir, s.Name)
	if err := os.MkdirAll(skillDir, 0o755); err != nil {
		return fmt.Errorf("failed to create skill directory: %w", err)
	}

	client, err := security.NewSafeHTTPClient(30*time.Second, "", allowLocalhost)
	if err != nil {
		return fmt.Errorf("failed to create safe HTTP client: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.InstallURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create download request: %w", err)
	}

	tmpPath, err := utils.DownloadToFileWithOptions(ctx, client, req, 50*1024*1024, allowLocalhost)
	if err != nil {
		return fmt.Errorf("failed to download skill %q: %w", s.Name, err)
	}
	defer os.Remove(tmpPath)

	parsedURL, _ := url.Parse(s.InstallURL)
	isZip := parsedURL != nil && strings.HasSuffix(strings.ToLower(parsedURL.Path), ".zip")

	if isZip {
		if err := utils.ExtractZipFile(tmpPath, skillDir); err != nil {
			return fmt.Errorf("failed to extract skill archive: %w", err)
		}
	} else {
		skillMDPath := filepath.Join(skillDir, "SKILL.md")
		data, readErr := os.ReadFile(tmpPath)
		if readErr != nil {
			return fmt.Errorf("failed to read downloaded skill file: %w", readErr)
		}
		if writeErr := os.WriteFile(skillMDPath, data, 0o600); writeErr != nil {
			return fmt.Errorf("failed to write SKILL.md: %w", writeErr)
		}
	}

	if _, err := os.Stat(filepath.Join(skillDir, "SKILL.md")); err != nil {
		return fmt.Errorf("downloaded skill %q is missing SKILL.md", s.Name)
	}

	fmt.Printf("Installed %s@%s successfully to %s\n", s.Name, s.Version, skillDir)
	return nil
}
