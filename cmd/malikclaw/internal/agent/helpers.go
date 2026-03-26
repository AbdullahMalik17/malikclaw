package agent

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/ergochat/readline"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/ui"
)

func agentCmd(message, sessionKey, model string, debug, verbose bool) error {
	if sessionKey == "" {
		sessionKey = "cli:default"
	}

	// Set default log level to ERROR to hide internal agent logs
	logger.SetLevel(logger.ERROR)

	if verbose {
		logger.SetLevel(logger.INFO)
		fmt.Println(ui.StyleInfo.Render("ℹ️ Verbose mode enabled (Info logs shown)"))
	}

	if debug {
		logger.SetLevel(logger.DEBUG)
		fmt.Println(ui.StyleInfo.Render("🔍 Debug mode enabled (All logs shown)"))
	}

	cfg, err := internal.LoadConfig()
	if err != nil {
		return fmt.Errorf("error loading config: %w", err)
	}

	if model != "" {
		cfg.Agents.Defaults.ModelName = model
	}

	provider, modelID, err := providers.CreateProvider(cfg)
	if err != nil {
		return fmt.Errorf("error creating provider: %w", err)
	}

	// Use the resolved model ID from provider creation
	if modelID != "" {
		cfg.Agents.Defaults.ModelName = modelID
	}

	msgBus := bus.NewMessageBus()
	defer msgBus.Close()
	agentLoop := agent.NewAgentLoop(cfg, msgBus, provider)
	defer agentLoop.Close()

	// Print agent startup info (only for interactive mode)
	startupInfo := agentLoop.GetStartupInfo()
	fmt.Printf("%s %s\n", 
		ui.StyleSuccess.Render("✓"), 
		ui.StyleMuted.Render(fmt.Sprintf("Agent initialized with %v tools and %v skills", 
			startupInfo["tools"].(map[string]any)["count"],
			startupInfo["skills"].(map[string]any)["total"])))

	if message != "" {
		ctx := context.Background()
		stop := ui.ShowSpinner("Agent is thinking...")
		response, err := agentLoop.ProcessDirect(ctx, message, sessionKey)
		stop()
		if err != nil {
			return fmt.Errorf("error processing message: %w", err)
		}
		
		rendered, _ := ui.RenderMarkdown(response)
		fmt.Printf("\n%s\n%s\n", ui.StyleAgentName.Render(" MalikClaw "), rendered)
		return nil
	}

	fmt.Printf("\n%s %s\n\n", internal.Logo, ui.StyleHeader.Render("Interactive Mode (Ctrl+C to exit)"))
	interactiveMode(agentLoop, sessionKey)

	return nil
}

func interactiveMode(agentLoop *agent.AgentLoop, sessionKey string) {
	prompt := ui.StyleUserName.Render("You: ")

	rl, err := readline.NewEx(&readline.Config{
		Prompt:          prompt,
		HistoryFile:     filepath.Join(os.TempDir(), ".malikclaw_history"),
		HistoryLimit:    100,
		InterruptPrompt: "^C",
		EOFPrompt:       "exit",
	})
	if err != nil {
		fmt.Printf("Error initializing readline: %v\n", err)
		fmt.Println("Falling back to simple input mode...")
		simpleInteractiveMode(agentLoop, sessionKey)
		return
	}
	defer rl.Close()

	for {
		line, err := rl.Readline()
		if err != nil {
			if err == readline.ErrInterrupt || err == io.EOF {
				fmt.Println("\n" + ui.StyleInfo.Render("Goodbye!"))
				return
			}
			fmt.Printf("Error reading input: %v\n", err)
			continue
		}

		input := strings.TrimSpace(line)
		if input == "" {
			continue
		}

		if input == "exit" || input == "quit" {
			fmt.Println(ui.StyleInfo.Render("Goodbye!"))
			return
		}

		ctx := context.Background()
		stop := ui.ShowSpinner("Thinking...")
		response, err := agentLoop.ProcessDirect(ctx, input, sessionKey)
		stop()
		if err != nil {
			fmt.Printf("%s %v\n", ui.StyleError.Render("Error:"), err)
			continue
		}

		rendered, _ := ui.RenderMarkdown(response)
		fmt.Printf("\n%s\n%s\n", ui.StyleAgentName.Render(" MalikClaw "), rendered)
	}
}

func simpleInteractiveMode(agentLoop *agent.AgentLoop, sessionKey string) {
	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print(ui.StyleUserName.Render("You: "))
		line, err := reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {
				fmt.Println("\n" + ui.StyleInfo.Render("Goodbye!"))
				return
			}
			fmt.Printf("Error reading input: %v\n", err)
			continue
		}

		input := strings.TrimSpace(line)
		if input == "" {
			continue
		}

		if input == "exit" || input == "quit" {
			fmt.Println(ui.StyleInfo.Render("Goodbye!"))
			return
		}

		ctx := context.Background()
		stop := ui.ShowSpinner("Thinking...")
		response, err := agentLoop.ProcessDirect(ctx, input, sessionKey)
		stop()
		if err != nil {
			fmt.Printf("%s %v\n", ui.StyleError.Render("Error:"), err)
			continue
		}

		rendered, _ := ui.RenderMarkdown(response)
		fmt.Printf("\n%s\n%s\n", ui.StyleAgentName.Render(" MalikClaw "), rendered)
	}
}
