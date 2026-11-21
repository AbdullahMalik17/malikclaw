package skills

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/ast"
	"github.com/gomarkdown/markdown/parser"
	"gopkg.in/yaml.v3"

	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

var namePattern = regexp.MustCompile(`^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$`)

const (
	MaxNameLength        = 64
	MaxDescriptionLength = 1024
)

type SkillMetadata struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type SkillInfo struct {
	Name        string `json:"name"`
	Path        string `json:"path"`
	Source      string `json:"source"`
	Description string `json:"description"`
}

func (info SkillInfo) validate() error {
	var errs error
	if info.Name == "" {
		errs = errors.Join(errs, errors.New("name is required"))
	} else {
		if len(info.Name) > MaxNameLength {
			errs = errors.Join(errs, fmt.Errorf("name exceeds %d characters", MaxNameLength))
		}
		if !namePattern.MatchString(info.Name) {
			errs = errors.Join(errs, errors.New("name must be alphanumeric with hyphens"))
		}
	}

	if info.Description == "" {
		errs = errors.Join(errs, errors.New("description is required"))
	} else if len(info.Description) > MaxDescriptionLength {
		errs = errors.Join(errs, fmt.Errorf("description exceeds %d character", MaxDescriptionLength))
	}
	return errs
}

type SkillsLoader struct {
	workspace             string
	workspaceSkills       string // workspace skills (<workspace>/skills)
	workspaceAgentsSkills string // universal workspace skills (<workspace>/.agents/skills)
	globalSkills          string // global skills (~/.malikclaw/skills)
	universalSkills       string // universal global skills (~/.agents/skills)
	builtinSkills         string // builtin skills
}

// WithUniversalDirs configures universal <workspace>/.agents/skills and ~/.agents/skills
// discovery paths while preserving the NewSkillsLoader constructor signature.
func (sl *SkillsLoader) WithUniversalDirs(workspaceAgentsSkills, universalSkills string) *SkillsLoader {
	sl.workspaceAgentsSkills = workspaceAgentsSkills
	sl.universalSkills = universalSkills
	return sl
}

// SkillRoots returns all unique skill root directories used by this loader.
// The order follows resolution priority:
// <workspace>/skills > <workspace>/.agents/skills > ~/.malikclaw/skills > ~/.agents/skills > builtin.
func (sl *SkillsLoader) SkillRoots() []string {
	roots := []string{
		sl.workspaceSkills,
		sl.workspaceAgentsSkills,
		sl.globalSkills,
		sl.universalSkills,
		sl.builtinSkills,
	}
	seen := make(map[string]struct{}, len(roots))
	out := make([]string, 0, len(roots))

	for _, root := range roots {
		trimmed := strings.TrimSpace(root)
		if trimmed == "" {
			continue
		}
		clean := filepath.Clean(trimmed)
		if _, ok := seen[clean]; ok {
			continue
		}
		seen[clean] = struct{}{}
		out = append(out, clean)
	}

	return out
}

func NewSkillsLoader(workspace string, globalSkills string, builtinSkills string) *SkillsLoader {
	return &SkillsLoader{
		workspace:       workspace,
		workspaceSkills: filepath.Join(workspace, "skills"),
		globalSkills:    globalSkills, // ~/.malikclaw/skills
		builtinSkills:   builtinSkills,
	}
}

func (sl *SkillsLoader) ListSkills() []SkillInfo {
	skills := make([]SkillInfo, 0)
	seen := make(map[string]bool)

	addSkills := func(dir, source string) {
		if dir == "" {
			return
		}
		dirs, err := os.ReadDir(dir)
		if err != nil {
			return
		}
		for _, d := range dirs {
			if !d.IsDir() {
				continue
			}
			skillFile := filepath.Join(dir, d.Name(), "SKILL.md")
			metadata := sl.getSkillMetadata(skillFile)
			if metadata == nil {
				continue
			}
			info := SkillInfo{
				Name:        metadata.Name,
				Path:        skillFile,
				Source:      source,
				Description: metadata.Description,
			}
			if err := info.validate(); err != nil {
				slog.Warn("invalid skill from "+source, "name", info.Name, "error", err)
				continue
			}
			if seen[info.Name] {
				continue
			}
			seen[info.Name] = true
			skills = append(skills, info)
		}
	}

	// Priority: <workspace>/skills > <workspace>/.agents/skills > ~/.malikclaw/skills > ~/.agents/skills > builtin
	addSkills(sl.workspaceSkills, "workspace")
	addSkills(sl.workspaceAgentsSkills, "workspace-agents")
	addSkills(sl.globalSkills, "global")
	addSkills(sl.universalSkills, "agents")
	addSkills(sl.builtinSkills, "builtin")

	return skills
}

func (sl *SkillsLoader) LoadSkill(name string) (string, bool) {
	roots := []string{
		sl.workspaceSkills,
		sl.workspaceAgentsSkills,
		sl.globalSkills,
		sl.universalSkills,
		sl.builtinSkills,
	}
	for _, root := range roots {
		if root == "" {
			continue
		}
		skillFile := filepath.Join(root, name, "SKILL.md")
		if content, err := os.ReadFile(skillFile); err == nil {
			return sl.stripFrontmatter(string(content)), true
		}
	}

	return "", false
}

func (sl *SkillsLoader) LoadSkillsForContext(skillNames []string) string {
	if len(skillNames) == 0 {
		return ""
	}

	var parts []string
	for _, name := range skillNames {
		content, ok := sl.LoadSkill(name)
		if ok {
			parts = append(parts, fmt.Sprintf("### Skill: %s\n\n%s", name, content))
		}
	}

	return strings.Join(parts, "\n\n---\n\n")
}

func (sl *SkillsLoader) BuildSkillsSummary() string {
	allSkills := sl.ListSkills()
	if len(allSkills) == 0 {
		return ""
	}

	var lines []string
	lines = append(lines, "<skills>")
	for _, s := range allSkills {
		escapedName := escapeXML(s.Name)
		escapedDesc := escapeXML(s.Description)
		escapedPath := escapeXML(s.Path)

		lines = append(lines, "  <skill>")
		lines = append(lines, fmt.Sprintf("    <name>%s</name>", escapedName))
		lines = append(lines, fmt.Sprintf("    <description>%s</description>", escapedDesc))
		lines = append(lines, fmt.Sprintf("    <location>%s</location>", escapedPath))
		lines = append(lines, fmt.Sprintf("    <source>%s</source>", s.Source))
		lines = append(lines, "  </skill>")
	}
	lines = append(lines, "</skills>")

	return strings.Join(lines, "\n")
}

func (sl *SkillsLoader) getSkillMetadata(skillPath string) *SkillMetadata {
	content, err := os.ReadFile(skillPath)
	if err != nil {
		logger.WarnCF("skills", "Failed to read skill metadata",
			map[string]any{
				"skill_path": skillPath,
				"error":      err.Error(),
			})
		return nil
	}

	frontmatter, bodyContent := splitFrontmatter(string(content))
	dirName := filepath.Base(filepath.Dir(skillPath))

	metadata := &SkillMetadata{
		Name: dirName,
	}
	hasFrontmatterName := false

	if frontmatter != "" {
		// Try JSON first (for backward compatibility)
		var jsonMeta struct {
			Name        string `json:"name"`
			Description string `json:"description"`
		}
		if err := json.Unmarshal([]byte(frontmatter), &jsonMeta); err == nil {
			if jsonMeta.Name != "" {
				metadata.Name = jsonMeta.Name
				hasFrontmatterName = true
			}
			if jsonMeta.Description != "" {
				metadata.Description = jsonMeta.Description
			}
		} else {
			// Fall back to simple YAML parsing
			yamlMeta := sl.parseSimpleYAML(frontmatter)
			if name := yamlMeta["name"]; name != "" {
				metadata.Name = name
				hasFrontmatterName = true
			}
			if description := yamlMeta["description"]; description != "" {
				metadata.Description = description
			}
		}
	}

	if !hasFrontmatterName || metadata.Description == "" {
		title, bodyDescription := extractMarkdownMetadata(bodyContent)
		if !hasFrontmatterName && title != "" && namePattern.MatchString(title) && len(title) <= MaxNameLength {
			metadata.Name = title
		}
		if metadata.Description == "" {
			metadata.Description = bodyDescription
		}
	}

	return metadata
}

func extractMarkdownMetadata(content string) (title, description string) {
	p := parser.NewWithExtensions(parser.CommonExtensions)
	doc := markdown.Parse([]byte(content), p)
	if doc == nil {
		return "", ""
	}

	ast.WalkFunc(doc, func(node ast.Node, entering bool) ast.WalkStatus {
		if !entering {
			return ast.GoToNext
		}

		switch n := node.(type) {
		case *ast.Heading:
			if title == "" && n.Level == 1 {
				title = nodeText(n)
				if title != "" && description != "" {
					return ast.Terminate
				}
			}
		case *ast.Paragraph:
			if description == "" {
				description = nodeText(n)
				if title != "" && description != "" {
					return ast.Terminate
				}
			}
		}
		return ast.GoToNext
	})

	return title, description
}

func nodeText(n ast.Node) string {
	var b strings.Builder
	ast.WalkFunc(n, func(node ast.Node, entering bool) ast.WalkStatus {
		if !entering {
			return ast.GoToNext
		}

		switch t := node.(type) {
		case *ast.Text:
			b.Write(t.Literal)
		case *ast.Code:
			b.Write(t.Literal)
		case *ast.Softbreak, *ast.Hardbreak, *ast.NonBlockingSpace:
			b.WriteByte(' ')
		}
		return ast.GoToNext
	})
	return strings.Join(strings.Fields(b.String()), " ")
}

// parseSimpleYAML parses YAML frontmatter and extracts known metadata fields.
func (sl *SkillsLoader) parseSimpleYAML(content string) map[string]string {
	result := make(map[string]string)

	var meta struct {
		Name        string `yaml:"name"`
		Description string `yaml:"description"`
	}
	if err := yaml.Unmarshal([]byte(content), &meta); err != nil {
		return result
	}
	if meta.Name != "" {
		result["name"] = meta.Name
	}
	if meta.Description != "" {
		result["description"] = meta.Description
	}

	return result
}

func (sl *SkillsLoader) extractFrontmatter(content string) string {
	frontmatter, _ := splitFrontmatter(content)
	return frontmatter
}

func (sl *SkillsLoader) stripFrontmatter(content string) string {
	_, body := splitFrontmatter(content)
	return body
}

func splitFrontmatter(content string) (frontmatter, body string) {
	normalized := string(parser.NormalizeNewlines([]byte(content)))
	lines := strings.Split(normalized, "\n")
	if len(lines) == 0 || lines[0] != "---" {
		return "", content
	}

	end := -1
	for i := 1; i < len(lines); i++ {
		if lines[i] == "---" {
			end = i
			break
		}
	}
	if end == -1 {
		return "", content
	}

	frontmatter = strings.Join(lines[1:end], "\n")
	body = strings.Join(lines[end+1:], "\n")
	body = strings.TrimLeft(body, "\n")
	return frontmatter, body
}

func escapeXML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	return s
}
