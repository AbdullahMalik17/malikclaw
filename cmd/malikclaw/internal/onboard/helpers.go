package onboard

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

func onboard() {
	configPath := internal.GetConfigPath()

	fmt.Println("Choose Language / اپنی زبان منتخب کریں:")
	fmt.Println("1. English")
	fmt.Println("2. Urdu (اردو)")
	fmt.Print("Choice / آپ کا انتخاب [1]: ")
	var langChoice string
	fmt.Scanln(&langChoice)

	isUrdu := langChoice == "2"

	if _, err := os.Stat(configPath); err == nil {
		if isUrdu {
			fmt.Printf("تشکیلی فائل پہلے سے %s پر موجود ہے۔\n", configPath)
			fmt.Print("کیا آپ اسے دوبارہ لکھنا چاہتے ہیں؟ (y/n): ")
		} else {
			fmt.Printf("Config already exists at %s\n", configPath)
			fmt.Print("Overwrite? (y/n): ")
		}
		var response string
		fmt.Scanln(&response)
		if response != "y" {
			if isUrdu {
				fmt.Println("عمل منسوخ کر دیا گیا۔")
			} else {
				fmt.Println("Aborted.")
			}
			return
		}
	}

	cfg := config.DefaultConfig()
	if err := config.SaveConfig(configPath, cfg); err != nil {
		if isUrdu {
			fmt.Printf("تشکیل محفوظ کرنے میں غلطی: %v\n", err)
		} else {
			fmt.Printf("Error saving config: %v\n", err)
		}
		os.Exit(1)
	}

	workspace := cfg.WorkspacePath()
	createWorkspaceTemplates(workspace)

	if isUrdu {
		fmt.Printf("%s ملک کلاؤ (malikclaw) تیار ہے!\n", internal.Logo)
		fmt.Println("\nاگلے اقدامات:")
		fmt.Println("  1. اپنی API key اس فائل میں شامل کریں:", configPath)
		fmt.Println("")
		fmt.Println("     تجویز کردہ:")
		fmt.Println("     - OpenRouter: https://openrouter.ai/keys (100+ ماڈلز تک رسائی)")
		fmt.Println("     - Ollama:     https://ollama.com (مقامی اور مفت)")
		fmt.Println("")
		fmt.Println("     سپورٹ شدہ فراہم کنندگان کے لیے README.md دیکھیں۔")
		fmt.Println("")
		fmt.Println("  2. بات چیت شروع کریں: malikclaw agent -m \"السلام علیکم!\"")
	} else {
		fmt.Printf("%s malikclaw is ready!\n", internal.Logo)
		fmt.Println("\nNext steps:")
		fmt.Println("  1. Add your API key to", configPath)
		fmt.Println("")
		fmt.Println("     Recommended:")
		fmt.Println("     - OpenRouter: https://openrouter.ai/keys (access 100+ models)")
		fmt.Println("     - Ollama:     https://ollama.com (local, free)")
		fmt.Println("")
		fmt.Println("     See README.md for 17+ supported providers.")
		fmt.Println("")
		fmt.Println("  2. Chat: malikclaw agent -m \"Hello!\"")
	}
}

func createWorkspaceTemplates(workspace string) {
	err := copyEmbeddedToTarget(workspace)
	if err != nil {
		fmt.Printf("Error copying workspace templates: %v\n", err)
	}
}

func copyEmbeddedToTarget(targetDir string) error {
	// Ensure target directory exists
	if err := os.MkdirAll(targetDir, 0o755); err != nil {
		return fmt.Errorf("Failed to create target directory: %w", err)
	}

	// Walk through all files in embed.FS
	err := fs.WalkDir(embeddedFiles, "workspace", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		// Skip directories
		if d.IsDir() {
			return nil
		}

		// Read embedded file
		data, err := embeddedFiles.ReadFile(path)
		if err != nil {
			return fmt.Errorf("Failed to read embedded file %s: %w", path, err)
		}

		new_path, err := filepath.Rel("workspace", path)
		if err != nil {
			return fmt.Errorf("Failed to get relative path for %s: %v\n", path, err)
		}

		// Build target file path
		targetPath := filepath.Join(targetDir, new_path)

		// Ensure target file's directory exists
		if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
			return fmt.Errorf("Failed to create directory %s: %w", filepath.Dir(targetPath), err)
		}

		// Write file
		if err := os.WriteFile(targetPath, data, 0o644); err != nil {
			return fmt.Errorf("Failed to write file %s: %w", targetPath, err)
		}

		return nil
	})

	return err
}
