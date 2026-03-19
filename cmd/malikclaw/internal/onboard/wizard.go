package onboard

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

type OnboardWizard struct {
	isUrdu bool
	reader *bufio.Reader
}

func NewOnboardWizard() *OnboardWizard {
	return &OnboardWizard{
		reader: bufio.NewReader(os.Stdin),
	}
}

func (w *OnboardWizard) Run() {
	w.selectLanguage()
	w.printWelcome()

	configPath := internal.GetConfigPath()
	if !w.checkExistingConfig(configPath) {
		return
	}

	cfg := config.DefaultConfig()

	w.setupWorkspace(cfg)
	w.setupProvider(cfg)
	w.setupSearch(cfg)

	if err := config.SaveConfig(configPath, cfg); err != nil {
		w.printError("Error saving config", "تشکیل محفوظ کرنے میں غلطی", err)
		os.Exit(1)
	}

	w.printSuccess(configPath)
}

func (w *OnboardWizard) selectLanguage() {
	fmt.Println("Choose Language / اپنی زبان منتخب کریں:")
	fmt.Println("1. English")
	fmt.Println("2. Urdu (اردو)")
	fmt.Print("Choice / آپ کا انتخاب [1]: ")
	
	choice, _ := w.reader.ReadString('\n')
	choice = strings.TrimSpace(choice)
	w.isUrdu = (choice == "2")
}

func (w *OnboardWizard) printWelcome() {
	if w.isUrdu {
		fmt.Printf("\n%s ملک کلاؤ (MalikClaw) میں خوش آمدید!\n", internal.Logo)
		fmt.Println("آئیے آپ کا پرسنل اے آئی اسسٹنٹ سیٹ اپ کرتے ہیں۔")
	} else {
		fmt.Printf("\n%s Welcome to MalikClaw!\n", internal.Logo)
		fmt.Println("Let's set up your personal AI assistant.")
	}
}

func (w *OnboardWizard) checkExistingConfig(path string) bool {
	if _, err := os.Stat(path); err == nil {
		w.printMsg(
			fmt.Sprintf("Config already exists at %s", path),
			fmt.Sprintf("تشکیلی فائل پہلے سے %s پر موجود ہے۔", path),
		)
		w.printPrompt("Overwrite? (y/n) [n]: ", "کیا آپ اسے دوبارہ لکھنا چاہتے ہیں؟ (y/n) [n]: ")
		
		resp, _ := w.reader.ReadString('\n')
		resp = strings.TrimSpace(strings.ToLower(resp))
		if resp != "y" {
			w.printMsg("Aborted.", "عمل منسوخ کر دیا گیا۔")
			return false
		}
	}
	return true
}

func (w *OnboardWizard) setupWorkspace(cfg *config.Config) {
	w.printMsg("\n--- 1. Workspace Setup ---", "\n--- 1. ورک اسپیس سیٹ اپ ---")
	w.printMsg(
		fmt.Sprintf("Default workspace: %s", cfg.Agents.Defaults.Workspace),
		fmt.Sprintf("ڈیفالٹ ورک اسپیس: %s", cfg.Agents.Defaults.Workspace),
	)
	
	w.printPrompt("Enter new path or press Enter to keep default: ", "نیا راستہ درج کریں یا ڈیفالٹ رکھنے کے لیے Enter دبائیں: ")
	path, _ := w.reader.ReadString('\n')
	path = strings.TrimSpace(path)
	if path != "" {
		cfg.Agents.Defaults.Workspace = path
	}

	createWorkspaceTemplates(cfg.WorkspacePath())
	w.printMsg("Workspace templates created.", "ورک اسپیس ٹیمپلیٹس تیار کر لیے گئے ہیں۔")
}

func (w *OnboardWizard) setupProvider(cfg *config.Config) {
	w.printMsg("\n--- 2. AI Provider Setup ---", "\n--- 2. اے آئی فراہم کنندہ کا سیٹ اپ ---")
	w.printMsg("Select your primary AI provider:", "اپنا بنیادی اے آئی فراہم کنندہ منتخب کریں:")
	
	providers := []struct {
		name  string
		model string
	}{
		{"Zhipu AI (GLM)", "glm-4.7"},
		{"OpenRouter (Recommended)", "openrouter-auto"},
		{"OpenAI", "gpt-5.4"},
		{"Anthropic (Claude)", "claude-sonnet-4.6"},
		{"DeepSeek", "deepseek-chat"},
		{"Google Gemini", "gemini-2.0-flash"},
		{"Ollama (Local)", "llama3"},
	}

	for i, p := range providers {
		fmt.Printf("%d. %s\n", i+1, p.name)
	}
	
	w.printPrompt("Choice [1]: ", "انتخاب [1]: ")
	choiceStr, _ := w.reader.ReadString('\n')
	choiceStr = strings.TrimSpace(choiceStr)
	
	idx := 0
	if choiceStr != "" {
		fmt.Sscanf(choiceStr, "%d", &idx)
		idx--
	}
	if idx < 0 || idx >= len(providers) {
		idx = 0
	}

	selected := providers[idx]
	cfg.Agents.Defaults.ModelName = selected.model
	
	if selected.name != "Ollama (Local)" {
		w.printPrompt(
			fmt.Sprintf("Enter API Key for %s: ", selected.name),
			fmt.Sprintf("%s کے لیے API Key درج کریں: ", selected.name),
		)
		key, _ := w.reader.ReadString('\n')
		key = strings.TrimSpace(key)
		
		// Update the key in ModelList
		for i := range cfg.ModelList {
			if cfg.ModelList[i].ModelName == selected.model {
				cfg.ModelList[i].APIKey = key
				break
			}
		}
	}
}

func (w *OnboardWizard) setupSearch(cfg *config.Config) {
	w.printMsg("\n--- 3. Web Search Setup ---", "\n--- 3. ویب سرچ سیٹ اپ ---")
	w.printMsg("Enable DuckDuckGo (Free, no key)?", "کیا DuckDuckGo (مفت، بغیر کی) کو فعال کرنا چاہتے ہیں؟")
	w.printPrompt("(y/n) [y]: ", "(y/n) [y]: ")
	
	resp, _ := w.reader.ReadString('\n')
	resp = strings.TrimSpace(strings.ToLower(resp))
	cfg.Tools.Web.DuckDuckGo.Enabled = (resp != "n")

	w.printMsg("Configure other search providers (Brave, Tavily, Perplexity) later in config.json", "دیگر سرچ فراہم کنندگان (Brave, Tavily, Perplexity) کو بعد میں config.json میں کنفیگر کریں۔")
}

func (w *OnboardWizard) printSuccess(configPath string) {
	if w.isUrdu {
		fmt.Printf("\n%s ملک کلاؤ (malikclaw) تیار ہے!\n", internal.Logo)
		fmt.Println("\nاگلے اقدامات:")
		fmt.Println("  1. ترتیب چیک کریں:", configPath)
		fmt.Println("  2. بات چیت شروع کریں: malikclaw agent")
		fmt.Println("  3. یا مدد کے لیے دیکھیں: malikclaw --help")
	} else {
		fmt.Printf("\n%s malikclaw is ready!\n", internal.Logo)
		fmt.Println("\nNext steps:")
		fmt.Println("  1. Review config at:", configPath)
		fmt.Println("  2. Start chatting: malikclaw agent")
		fmt.Println("  3. Or run: malikclaw --help")
	}
}

func (w *OnboardWizard) printMsg(en, ur string) {
	if w.isUrdu {
		fmt.Println(ur)
	} else {
		fmt.Println(en)
	}
}

func (w *OnboardWizard) printPrompt(en, ur string) {
	if w.isUrdu {
		fmt.Print(ur)
	} else {
		fmt.Print(en)
	}
}

func (w *OnboardWizard) printError(en, ur string, err error) {
	if w.isUrdu {
		fmt.Printf("%s: %v\n", ur, err)
	} else {
		fmt.Printf("%s: %v\n", en, err)
	}
}
