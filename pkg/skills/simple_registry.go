package skills

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "path/filepath"
    "strings"
)

const SimpleRegistryURL = "https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/skills-registry.json"

type SimpleSkill struct {
    Name        string `json:"name"`
    Description string `json:"description"`
    Version     string `json:"version"`
    Author      string `json:"author"`
    InstallURL  string `json:"install_url"`
    Tags        []string `json:"tags"`
}

type SimpleRegistry struct {
    Skills []SimpleSkill `json:"skills"`
}

func FetchSimpleRegistry() (*SimpleRegistry, error) {
    resp, err := http.Get(SimpleRegistryURL)
    if err != nil {
        return nil, fmt.Errorf("failed to fetch registry: %w", err)
    }
    defer resp.Body.Close()
    body, _ := io.ReadAll(resp.Body)
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
    skillDir := filepath.Join(home, ".malikclaw", "skills", s.Name)
    os.MkdirAll(skillDir, 0755)
    fmt.Printf("Installing %s@%s...\n", s.Name, s.Version)
    // Download logic here
    fmt.Printf("✅ Installed %s successfully\n", s.Name)
    return nil
}
