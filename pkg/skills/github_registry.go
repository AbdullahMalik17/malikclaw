package skills

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/utils"
)

// GitHubRegistry implements SkillRegistry using a centralized JSON index.
// This ensures a lightweight backend without a database.
type GitHubRegistry struct {
	indexURL   string
	client     *http.Client
	maxZipSize int

	mu    sync.RWMutex
	cache *githubIndexCache
}

type githubIndexCache struct {
	skills    map[string]githubSkillMeta
	expiresAt time.Time
}

type githubIndexResponse struct {
	Skills []githubSkillMeta `json:"skills"`
}

type githubSkillMeta struct {
	Slug          string `json:"slug"`
	DisplayName   string `json:"display_name"`
	Summary       string `json:"summary"`
	LatestVersion string `json:"latest_version"`
	DownloadURL   string `json:"download_url"` // URL to the ZIP payload
}

func NewGitHubRegistry(indexURL string) *GitHubRegistry {
	if indexURL == "" {
		// Default to a fictional centralized repo index for MalikClaw
		indexURL = "https://raw.githubusercontent.com/AbdullahMalik17/malikclaw-skills/main/index.json"
	}
	return &GitHubRegistry{
		indexURL:   indexURL,
		maxZipSize: 50 * 1024 * 1024, // 50MB
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (g *GitHubRegistry) Name() string {
	return "github"
}

// fetchIndex fetches and parses the centralized JSON index.
func (g *GitHubRegistry) fetchIndex(ctx context.Context) (map[string]githubSkillMeta, error) {
	g.mu.RLock()
	if g.cache != nil && time.Now().Before(g.cache.expiresAt) {
		skills := g.cache.skills
		g.mu.RUnlock()
		return skills, nil
	}
	g.mu.RUnlock()

	req, err := http.NewRequestWithContext(ctx, "GET", g.indexURL, nil)
	if err != nil {
		return nil, err
	}

	resp, err := g.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch github index: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("github index returned status %d", resp.StatusCode)
	}

	var index githubIndexResponse
	if err := json.NewDecoder(resp.Body).Decode(&index); err != nil {
		return nil, fmt.Errorf("failed to parse github index: %w", err)
	}

	skillsMap := make(map[string]githubSkillMeta)
	for _, skill := range index.Skills {
		skillsMap[skill.Slug] = skill
	}

	g.mu.Lock()
	g.cache = &githubIndexCache{
		skills:    skillsMap,
		expiresAt: time.Now().Add(5 * time.Minute), // Cache for 5 minutes
	}
	g.mu.Unlock()

	return skillsMap, nil
}

func (g *GitHubRegistry) Search(ctx context.Context, query string, limit int) ([]SearchResult, error) {
	skills, err := g.fetchIndex(ctx)
	if err != nil {
		return nil, err
	}

	query = strings.ToLower(query)
	var results []SearchResult

	for _, skill := range skills {
		// Simple scoring based on substring match
		score := 0.0
		if strings.Contains(strings.ToLower(skill.Slug), query) {
			score += 1.0
		}
		if strings.Contains(strings.ToLower(skill.DisplayName), query) {
			score += 0.8
		}
		if strings.Contains(strings.ToLower(skill.Summary), query) {
			score += 0.5
		}

		if score > 0 {
			results = append(results, SearchResult{
				Score:        score,
				Slug:         skill.Slug,
				DisplayName:  skill.DisplayName,
				Summary:      skill.Summary,
				Version:      skill.LatestVersion,
				RegistryName: g.Name(),
			})
		}
	}

	sortByScoreDesc(results)
	if limit > 0 && len(results) > limit {
		results = results[:limit]
	}

	return results, nil
}

func (g *GitHubRegistry) GetSkillMeta(ctx context.Context, slug string) (*SkillMeta, error) {
	skills, err := g.fetchIndex(ctx)
	if err != nil {
		return nil, err
	}

	skill, exists := skills[slug]
	if !exists {
		return nil, fmt.Errorf("skill %q not found in github registry", slug)
	}

	return &SkillMeta{
		Slug:             skill.Slug,
		DisplayName:      skill.DisplayName,
		Summary:          skill.Summary,
		LatestVersion:    skill.LatestVersion,
		IsMalwareBlocked: false,
		IsSuspicious:     false,
		RegistryName:     g.Name(),
	}, nil
}

func (g *GitHubRegistry) DownloadAndInstall(ctx context.Context, slug, version, targetDir string) (*InstallResult, error) {
	skills, err := g.fetchIndex(ctx)
	if err != nil {
		return nil, err
	}

	skill, exists := skills[slug]
	if !exists {
		return nil, fmt.Errorf("skill %q not found in github registry", slug)
	}

	// For simple implementation, we download the LatestVersion URL directly.
	// We could template the URL if specific versions are requested.
	downloadURL := skill.DownloadURL
	if downloadURL == "" {
		return nil, fmt.Errorf("no download URL provided for skill %q", slug)
	}

	req, err := http.NewRequestWithContext(ctx, "GET", downloadURL, nil)
	if err != nil {
		return nil, err
	}

	resp, err := utils.DoRequestWithRetry(g.client, req)
	if err != nil {
		return nil, fmt.Errorf("download failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("HTTP %d when downloading skill payload", resp.StatusCode)
	}

	tmpFile, err := os.CreateTemp("", "malikclaw-github-dl-*")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %w", err)
	}
	tmpPath := tmpFile.Name()

	cleanup := func() {
		_ = tmpFile.Close()
		_ = os.Remove(tmpPath)
	}
	defer cleanup()

	src := io.LimitReader(resp.Body, int64(g.maxZipSize)+1)
	written, err := io.Copy(tmpFile, src)
	if err != nil {
		return nil, fmt.Errorf("download write failed: %w", err)
	}

	if written > int64(g.maxZipSize) {
		return nil, fmt.Errorf("download too large: %d bytes", written)
	}

	if err := tmpFile.Close(); err != nil {
		return nil, fmt.Errorf("failed to close temp file: %w", err)
	}

	if err := utils.ExtractZipFile(tmpPath, targetDir); err != nil {
		return nil, fmt.Errorf("failed to extract zip file: %w", err)
	}

	return &InstallResult{
		Version:          skill.LatestVersion,
		IsMalwareBlocked: false,
		IsSuspicious:     false,
		Summary:          skill.Summary,
	}, nil
}
