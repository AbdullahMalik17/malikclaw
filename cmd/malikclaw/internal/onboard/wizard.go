package onboard

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

type wizardLang int

const (
	langEnglish wizardLang = iota
	langUrdu
	langRomanUrdu
)

// OnboardWizardOptions allows injecting I/O, HTTP client, Ollama URL, ADB lookup,
// and config path for deterministic unit testing.
type OnboardWizardOptions struct {
	In         io.Reader
	Out        io.Writer
	HTTPClient *http.Client
	OllamaURL  string
	LookPath   func(string) (string, error)
	ConfigPath string
}

type OnboardWizard struct {
	lang       wizardLang
	isUrdu     bool
	reader     *bufio.Reader
	out        io.Writer
	httpClient *http.Client
	ollamaURL  string
	lookPath   func(string) (string, error)
	configPath string
}

func NewOnboardWizard() *OnboardWizard {
	return NewOnboardWizardWithOptions(OnboardWizardOptions{})
}

func NewOnboardWizardWithOptions(opts OnboardWizardOptions) *OnboardWizard {
	in := opts.In
	if in == nil {
		in = os.Stdin
	}
	out := opts.Out
	if out == nil {
		out = os.Stdout
	}
	client := opts.HTTPClient
	if client == nil {
		client = &http.Client{Timeout: 1200 * time.Millisecond}
	}
	ollamaURL := strings.TrimSpace(opts.OllamaURL)
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	lookPath := opts.LookPath
	if lookPath == nil {
		lookPath = exec.LookPath
	}

	return &OnboardWizard{
		reader:     bufio.NewReader(in),
		out:        out,
		httpClient: client,
		ollamaURL:  strings.TrimRight(ollamaURL, "/"),
		lookPath:   lookPath,
		configPath: opts.ConfigPath,
	}
}

func (w *OnboardWizard) Run() {
	if err := w.RunWithError(); err != nil {
		w.printError("Error saving config", "تشکیل محفوظ کرنے میں غلطی", "Config save karne mein ghalti", err)
		os.Exit(1)
	}
}

func (w *OnboardWizard) RunWithError() error {
	w.selectLanguage()
	w.printWelcome()

	configPath := w.configPath
	if configPath == "" {
		configPath = internal.GetConfigPath()
	}
	if !w.checkExistingConfig(configPath) {
		return nil
	}

	cfg := config.DefaultConfig()

	w.setupWorkspace(cfg)
	detectedOllama := w.detectOllamaModels()
	w.setupProvider(cfg, detectedOllama)
	w.setupSmartRouting(cfg, detectedOllama)
	w.setupSearch(cfg)
	w.setupChannelsAndPhone(cfg)

	if err := config.SaveConfig(configPath, cfg); err != nil {
		return err
	}

	w.printSuccess(configPath, detectedOllama)
	return nil
}

func (w *OnboardWizard) readLine() string {
	line, _ := w.reader.ReadString('\n')
	return strings.TrimSpace(line)
}

func (w *OnboardWizard) selectLanguage() {
	fmt.Fprintln(w.out, "Choose Language / اپنی زبان منتخب کریں / Zaban muntakhib karein:")
	fmt.Fprintln(w.out, "1. English")
	fmt.Fprintln(w.out, "2. Urdu (اردو)")
	fmt.Fprintln(w.out, "3. Roman Urdu (Aasan Urdu)")
	fmt.Fprint(w.out, "Choice / انتخاب [1]: ")

	choice := w.readLine()
	switch choice {
	case "2":
		w.lang = langUrdu
		w.isUrdu = true
	case "3":
		w.lang = langRomanUrdu
		w.isUrdu = false
	default:
		w.lang = langEnglish
		w.isUrdu = false
	}
}

func (w *OnboardWizard) printWelcome() {
	switch w.lang {
	case langUrdu:
		fmt.Fprintf(w.out, "\n%s ملک کلاؤ (MalikClaw v2.0.0) میں خوش آمدید!\n", internal.Logo)
		fmt.Fprintln(w.out, "آئیے آپ کا پرسنل اے آئی اسسٹنٹ سیٹ اپ کرتے ہیں۔")
	case langRomanUrdu:
		fmt.Fprintf(w.out, "\n%s MalikClaw v2.0.0 mein khush aamdeed!\n", internal.Logo)
		fmt.Fprintln(w.out, "Chalein 60 seconds mein aapka personal AI assistant setup karte hain.")
	default:
		fmt.Fprintf(w.out, "\n%s Welcome to MalikClaw v2.0.0!\n", internal.Logo)
		fmt.Fprintln(w.out, "Let's set up your personal AI assistant in under 60 seconds.")
	}
}

func (w *OnboardWizard) checkExistingConfig(path string) bool {
	if _, err := os.Stat(path); err == nil {
		w.printMsg(
			fmt.Sprintf("Config already exists at %s", path),
			fmt.Sprintf("تشکیلی فائل پہلے سے %s پر موجود ہے۔", path),
			fmt.Sprintf("Config pehle se %s par maujood hai.", path),
		)
		w.printPrompt(
			"Overwrite? (y/n) [n]: ",
			"کیا آپ اسے دوبارہ لکھنا چاہتے ہیں؟ (y/n) [n]: ",
			"Kya aap isay dubara likhna chahte hain? (y/n) [n]: ",
		)

		resp := strings.ToLower(w.readLine())
		if resp != "y" {
			w.printMsg("Aborted.", "عمل منسوخ کر دیا گیا۔", "Setup cancel kar diya gaya.")
			return false
		}
	}
	return true
}

func (w *OnboardWizard) setupWorkspace(cfg *config.Config) {
	w.printMsg(
		"\n--- 1. Workspace & Daily-Life Skills ---",
		"\n--- 1. ورک اسپیس اور روزمرہ کی مہارتیں ---",
		"\n--- 1. Workspace aur Daily-Life Skills ---",
	)
	w.printMsg(
		fmt.Sprintf("Default workspace: %s", cfg.Agents.Defaults.Workspace),
		fmt.Sprintf("ڈیفالٹ ورک اسپیس: %s", cfg.Agents.Defaults.Workspace),
		fmt.Sprintf("Default workspace: %s", cfg.Agents.Defaults.Workspace),
	)

	w.printPrompt(
		"Enter new path or press Enter to keep default: ",
		"نیا راستہ درج کریں یا ڈیفالٹ رکھنے کے لیے Enter دبائیں: ",
		"Naya path likhein ya default ke liye Enter dabayein: ",
	)
	if path := w.readLine(); path != "" {
		cfg.Agents.Defaults.Workspace = path
	}

	if err := copyEmbeddedToTarget(cfg.WorkspacePath()); err != nil {
		w.printError("Error copying workspace templates", "ورک اسپیس ٹیمپلیٹس کاپی کرنے میں غلطی", "Templates copy karne mein ghalti", err)
	} else {
		w.printMsg(
			"Starter daily-life skills installed (morning-briefing, urdu-reminders, chat-assistant, android-remote).",
			"روزمرہ کی مہارتیں انسٹال ہو گئیں (morning-briefing, urdu-reminders, chat-assistant, android-remote)۔",
			"Daily-life skills install ho gayin (morning-briefing, urdu-reminders, chat-assistant, android-remote).",
		)
	}

	w.printPrompt(
		"Your name or city for personalized briefings (optional, press Enter to skip): ",
		"اپنا نام یا شہر لکھیں (اختیاری، چھوڑنے کے لیے Enter دبائیں): ",
		"Apna naam ya shehar likhein (optional, skip ke liye Enter dabayein): ",
	)
	if profileNote := w.readLine(); profileNote != "" {
		userMDPath := filepath.Join(cfg.WorkspacePath(), "USER.md")
		existing, _ := os.ReadFile(userMDPath)
		langLabel := "English"
		if w.lang == langUrdu {
			langLabel = "Urdu (اردو)"
		} else if w.lang == langRomanUrdu {
			langLabel = "Roman Urdu"
		}
		extra := fmt.Sprintf("\n\n## Onboarding Profile\n- Note: %s\n- Preferred Language: %s\n", profileNote, langLabel)
		_ = os.WriteFile(userMDPath, append(existing, []byte(extra)...), 0o644)
	}
}

func (w *OnboardWizard) detectOllamaModels() []string {
	ctx, cancel := context.WithTimeout(context.Background(), 1200*time.Millisecond)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, w.ollamaURL+"/api/tags", nil)
	if err != nil {
		return nil
	}

	resp, err := w.httpClient.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil
	}

	var tags struct {
		Models []struct {
			Name string `json:"name"`
		} `json:"models"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tags); err != nil {
		return nil
	}

	var names []string
	for _, m := range tags.Models {
		if n := strings.TrimSpace(m.Name); n != "" {
			names = append(names, n)
		}
	}
	return names
}

func (w *OnboardWizard) setupProvider(cfg *config.Config, detectedOllama []string) {
	w.printMsg(
		"\n--- 2. AI Provider Setup ---",
		"\n--- 2. اے آئی فراہم کنندہ کا سیٹ اپ ---",
		"\n--- 2. AI Provider Setup ---",
	)

	if len(detectedOllama) > 0 {
		w.printMsg(
			fmt.Sprintf("Detected local Ollama running (%d model(s): %s) — free & private!", len(detectedOllama), strings.Join(detectedOllama, ", ")),
			fmt.Sprintf("مقامی Ollama چل رہا ہے (%d ماڈلز: %s) — مفت اور محفوظ!", len(detectedOllama), strings.Join(detectedOllama, ", ")),
			fmt.Sprintf("Local Ollama mil gaya (%d model(s): %s) — bilkul muft aur private!", len(detectedOllama), strings.Join(detectedOllama, ", ")),
		)
	}

	w.printMsg(
		"Select your primary AI provider:",
		"اپنا بنیادی اے آئی فراہم کنندہ منتخب کریں:",
		"Apna primary AI provider select karein:",
	)

	type providerOpt struct {
		name      string
		modelName string
		fullModel string
		apiBase   string
		needsKey  bool
	}

	options := []providerOpt{}
	if len(detectedOllama) > 0 {
		localModel := detectedOllama[0]
		options = append(options, providerOpt{
			name:      fmt.Sprintf("Ollama Local Detected (%s — Free, No API Key)", localModel),
			modelName: "ollama-" + localModel,
			fullModel: "ollama/" + localModel,
			apiBase:   w.ollamaURL + "/v1",
			needsKey:  false,
		})
	}
	options = append(options,
		providerOpt{name: "Google Gemini (gemini-2.5-flash)", modelName: "gemini-2.5-flash", fullModel: "gemini/gemini-2.5-flash", needsKey: true},
		providerOpt{name: "OpenRouter (Recommended)", modelName: "openrouter-auto", fullModel: "openrouter/auto", needsKey: true},
		providerOpt{name: "Zhipu AI (GLM)", modelName: "glm-4.7", fullModel: "zhipu/glm-4.7", needsKey: true},
		providerOpt{name: "OpenAI", modelName: "gpt-5.4", fullModel: "openai/gpt-5.4", needsKey: true},
		providerOpt{name: "Anthropic (Claude)", modelName: "claude-sonnet-4.6", fullModel: "anthropic/claude-sonnet-4.6", needsKey: true},
		providerOpt{name: "DeepSeek", modelName: "deepseek-chat", fullModel: "deepseek/deepseek-chat", needsKey: true},
		providerOpt{name: "Ollama (Local)", modelName: "llama3", fullModel: "ollama/llama3", apiBase: w.ollamaURL + "/v1", needsKey: false},
	)

	for i, p := range options {
		fmt.Fprintf(w.out, "%d. %s\n", i+1, p.name)
	}

	w.printPrompt("Choice [1]: ", "انتخاب [1]: ", "Intikhab [1]: ")
	choiceStr := w.readLine()

	idx := 0
	if choiceStr != "" {
		fmt.Sscanf(choiceStr, "%d", &idx)
		idx--
	}
	if idx < 0 || idx >= len(options) {
		idx = 0
	}

	selected := options[idx]
	cfg.Agents.Defaults.ModelName = selected.modelName

	// Ensure selected model exists in cfg.ModelList
	foundInList := false
	for i := range cfg.ModelList {
		if cfg.ModelList[i].ModelName == selected.modelName {
			foundInList = true
			if selected.apiBase != "" {
				cfg.ModelList[i].APIBase = selected.apiBase
			}
			break
		}
	}
	if !foundInList {
		apiKey := ""
		if !selected.needsKey {
			apiKey = "ollama"
		}
		cfg.ModelList = append(cfg.ModelList, config.ModelConfig{
			ModelName: selected.modelName,
			Model:     selected.fullModel,
			APIBase:   selected.apiBase,
			APIKey:    apiKey,
		})
	}

	if selected.needsKey {
		w.printPrompt(
			fmt.Sprintf("Enter API Key for %s: ", selected.name),
			fmt.Sprintf("%s کے لیے API Key درج کریں: ", selected.name),
			fmt.Sprintf("%s ke liye API Key likhein: ", selected.name),
		)
		key := w.readLine()
		for i := range cfg.ModelList {
			if cfg.ModelList[i].ModelName == selected.modelName {
				cfg.ModelList[i].APIKey = key
				break
			}
		}
	}
}

func (w *OnboardWizard) setupSmartRouting(cfg *config.Config, detectedOllama []string) {
	w.printMsg(
		"\n--- 3. Smart Cost Router ---",
		"\n--- 3. اسمارٹ کاسٹ راؤٹر ---",
		"\n--- 3. Smart Cost Router ---",
	)
	w.printMsg(
		"Enable Smart Cost Router (routes simple tasks to fast/local models to save API costs)?",
		"کیا اسمارٹ کاسٹ راؤٹر فعال کریں (سادہ کام تیز/مقامی ماڈلز پر چلا کر اخراجات بچائیں)؟",
		"Kya Smart Cost Router on karein (asaan kaam fast/local models par chala kar kharcha bachayein)?",
	)
	w.printPrompt("(y/n) [y]: ", "(y/n) [y]: ", "(y/n) [y]: ")

	resp := strings.ToLower(w.readLine())
	if resp == "n" {
		return
	}

	fastModel := "gemini-2.5-flash"
	fallbackOrder := []string{"gemini-2.5-flash", "ollama/qwen2.5:7b"}
	if len(detectedOllama) > 0 {
		fastModel = "ollama/" + detectedOllama[0]
		fallbackOrder = []string{"ollama/" + detectedOllama[0], "gemini-2.5-flash"}
	}

	cfg.Agents.Defaults.Routing = &config.RoutingConfig{
		Enabled:              true,
		Mode:                 "smart",
		FastModel:            fastModel,
		BalancedModel:        "claude-sonnet-4",
		ReasoningModel:       "claude-opus-4",
		DefaultFallbackOrder: fallbackOrder,
	}
}

func (w *OnboardWizard) setupSearch(cfg *config.Config) {
	w.printMsg(
		"\n--- 4. Web Search Setup ---",
		"\n--- 4. ویب سرچ سیٹ اپ ---",
		"\n--- 4. Web Search Setup ---",
	)
	w.printMsg(
		"Enable DuckDuckGo (Free, no key)?",
		"کیا DuckDuckGo (مفت، بغیر کی) کو فعال کرنا چاہتے ہیں؟",
		"Kya DuckDuckGo (muft, bina API key) on karein?",
	)
	w.printPrompt("(y/n) [y]: ", "(y/n) [y]: ", "(y/n) [y]: ")

	resp := strings.ToLower(w.readLine())
	cfg.Tools.Web.DuckDuckGo.Enabled = (resp != "n")
}

func (w *OnboardWizard) setupChannelsAndPhone(cfg *config.Config) {
	w.printMsg(
		"\n--- 5. Everyday Channels & Phone Automation ---",
		"\n--- 5. واٹس ایپ، ٹیلی گرام اور اینڈرائیڈ سیٹ اپ ---",
		"\n--- 5. WhatsApp, Telegram aur Android Setup ---",
	)

	// Telegram quick-setup
	w.printPrompt(
		"Configure Telegram bot now? (y/n) [n]: ",
		"کیا ابھی ٹیلی گرام بوٹ سیٹ اپ کرنا چاہتے ہیں؟ (y/n) [n]: ",
		"Kya abhi Telegram bot setup karna chahte hain? (y/n) [n]: ",
	)
	if strings.ToLower(w.readLine()) == "y" {
		w.printPrompt("Enter Telegram Bot Token: ", "ٹیلی گرام بوٹ ٹوکن درج کریں: ", "Telegram Bot Token likhein: ")
		token := w.readLine()
		w.printPrompt(
			"Allowed Telegram user ID or @username (optional): ",
			"اجازت یافتہ ٹیلی گرام یوزر آئی ڈی یا @username (اختیاری): ",
			"Allowed Telegram user ID ya @username (optional): ",
		)
		allowUser := w.readLine()
		cfg.Channels.Telegram.Enabled = true
		cfg.Channels.Telegram.Token = token
		if allowUser != "" {
			cfg.Channels.Telegram.AllowFrom = config.FlexibleStringSlice{allowUser}
		}
	}

	// WhatsApp quick-setup
	w.printPrompt(
		"Enable WhatsApp assistant? (y/n) [n]: ",
		"کیا واٹس ایپ اسسٹنٹ فعال کرنا چاہتے ہیں؟ (y/n) [n]: ",
		"Kya WhatsApp assistant on karna chahte hain? (y/n) [n]: ",
	)
	if strings.ToLower(w.readLine()) == "y" {
		w.printPrompt(
			"WhatsApp Bridge URL [ws://localhost:3001]: ",
			"واٹس ایپ برج یو آر ایل [ws://localhost:3001]: ",
			"WhatsApp Bridge URL [ws://localhost:3001]: ",
		)
		bridgeURL := w.readLine()
		if bridgeURL == "" {
			bridgeURL = "ws://localhost:3001"
		}
		w.printPrompt(
			"Allowed WhatsApp phone number (e.g. +923001234567, optional): ",
			"اجازت یافتہ واٹس ایپ نمبر (مثلاً +923001234567، اختیاری): ",
			"Allowed WhatsApp number (maslan +923001234567, optional): ",
		)
		phone := w.readLine()
		cfg.Channels.WhatsApp.Enabled = true
		cfg.Channels.WhatsApp.BridgeURL = bridgeURL
		if phone != "" {
			cfg.Channels.WhatsApp.AllowFrom = config.FlexibleStringSlice{phone}
		}
	}

	// Android ADB check
	if adbPath, err := w.lookPath("adb"); err == nil && adbPath != "" {
		w.printMsg(
			fmt.Sprintf("Android ADB detected at %s — phone automation ready!", adbPath),
			fmt.Sprintf("اینڈرائیڈ ADB مل گیا (%s) — فون آٹومیشن تیار ہے!", adbPath),
			fmt.Sprintf("Android ADB mil gaya (%s) — phone automation tayyar hai!", adbPath),
		)
	} else {
		w.printMsg(
			"Android ADB not found (optional). Install Android Platform Tools later to enable phone control.",
			"اینڈرائیڈ ADB نہیں ملا (اختیاری)۔ فون کنٹرول کے لیے بعد میں Android Platform Tools انسٹال کریں۔",
			"Android ADB nahi mila (optional). Phone control ke liye baad mein Android Platform Tools install karein.",
		)
	}
}

func (w *OnboardWizard) printSuccess(configPath string, detectedOllama []string) {
	switch w.lang {
	case langUrdu:
		fmt.Fprintf(w.out, "\n%s ملک کلاؤ (malikclaw v2.0.0) تیار ہے!\n", internal.Logo)
		fmt.Fprintln(w.out, "\nاگلے اقدامات:")
		fmt.Fprintln(w.out, "  1. ترتیب چیک کریں:", configPath)
		fmt.Fprintln(w.out, "  2. بات چیت شروع کریں: malikclaw agent")
		fmt.Fprintln(w.out, "  3. مثال: 'صبح 5 بجے فجر کا الارم لگا دو' یا 'Give me my morning briefing'")
	case langRomanUrdu:
		fmt.Fprintf(w.out, "\n%s MalikClaw v2.0.0 tayyar hai!\n", internal.Logo)
		fmt.Fprintln(w.out, "\nAgle qadam:")
		fmt.Fprintln(w.out, "  1. Config check karein:", configPath)
		fmt.Fprintln(w.out, "  2. Baat shuru karein: malikclaw agent")
		fmt.Fprintln(w.out, "  3. Misal: 'Kal subah 8 baje meeting ka reminder lagao'")
	default:
		fmt.Fprintf(w.out, "\n%s malikclaw v2.0.0 is ready!\n", internal.Logo)
		fmt.Fprintln(w.out, "\nNext steps:")
		fmt.Fprintln(w.out, "  1. Review config at:", configPath)
		fmt.Fprintln(w.out, "  2. Start chatting: malikclaw agent")
		fmt.Fprintln(w.out, "  3. Try: 'Give me my morning briefing' or 'Remind me in 20 minutes'")
	}
	if len(detectedOllama) > 0 {
		w.printMsg(
			fmt.Sprintf("  Local Ollama model ready: %s", detectedOllama[0]),
			fmt.Sprintf("  مقامی Ollama ماڈل تیار ہے: %s", detectedOllama[0]),
			fmt.Sprintf("  Local Ollama model tayyar hai: %s", detectedOllama[0]),
		)
	}
}

func (w *OnboardWizard) printMsg(en, ur, roman string) {
	switch w.lang {
	case langUrdu:
		fmt.Fprintln(w.out, ur)
	case langRomanUrdu:
		fmt.Fprintln(w.out, roman)
	default:
		fmt.Fprintln(w.out, en)
	}
}

func (w *OnboardWizard) printPrompt(en, ur, roman string) {
	switch w.lang {
	case langUrdu:
		fmt.Fprint(w.out, ur)
	case langRomanUrdu:
		fmt.Fprint(w.out, roman)
	default:
		fmt.Fprint(w.out, en)
	}
}

func (w *OnboardWizard) printError(en, ur, roman string, err error) {
	switch w.lang {
	case langUrdu:
		fmt.Fprintf(w.out, "%s: %v\n", ur, err)
	case langRomanUrdu:
		fmt.Fprintf(w.out, "%s: %v\n", roman, err)
	default:
		fmt.Fprintf(w.out, "%s: %v\n", en, err)
	}
}
