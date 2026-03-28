package run

import (
	"context"
	"fmt"
	"time"

	"github.com/spf13/cobra"

	"github.com/AbdullahMalik17/malikclaw/cmd/malikclaw/internal"
	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/ui"
	"unicode/utf8"
)

func NewRunCommand() *cobra.Command {
	var (
		debug        bool
		verbose      bool
		model        string
		sessionKey   string
		timeout      time.Duration
		showMetrics  bool
	)

	cmd := &cobra.Command{
		Use:   "run [task]",
		Short: "Run a task with the agent (with evaluation and memory)",
		Long: `Execute a task with integrated agent loop, evaluation, and learning.

Examples:
  malikclaw run "What is the weather today?"
  malikclaw run "Search for AI news" --model gpt-4
  malikclaw run "Calculate 2+2" --debug --metrics
`,
		Args: cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			return runCmd(
				args[0],
				model,
				sessionKey,
				timeout,
				debug,
				verbose,
				showMetrics,
			)
		},
	}

	cmd.Flags().BoolVarP(&debug, "debug", "d", false, "Enable debug logging")
	cmd.Flags().BoolVarP(&verbose, "verbose", "v", false, "Enable verbose logging (info level)")
	cmd.Flags().StringVarP(&model, "model", "m", "", "Model to use for this task")
	cmd.Flags().StringVarP(&sessionKey, "session", "s", "cli:run", "Session key for context preservation")
	cmd.Flags().DurationVarP(&timeout, "timeout", "t", 30*time.Second, "Execution timeout")
	cmd.Flags().BoolVar(&showMetrics, "metrics", false, "Show execution metrics")

	return cmd
}

func runCmd(
	task, model, sessionKey string,
	timeout time.Duration,
	debug, verbose, showMetrics bool,
) error {
	// Set log level
	logger.SetLevel(logger.ERROR)
	if verbose {
		logger.SetLevel(logger.INFO)
	}
	if debug {
		logger.SetLevel(logger.DEBUG)
	}

	// Load configuration
	cfg, err := internal.LoadConfig()
	if err != nil {
		return fmt.Errorf("error loading config: %w", err)
	}

	if model != "" {
		cfg.Agents.Defaults.ModelName = model
	}

	// Create provider
	provider, modelID, err := providers.CreateProvider(cfg)
	if err != nil {
		return fmt.Errorf("error creating provider: %w", err)
	}

	if modelID != "" {
		cfg.Agents.Defaults.ModelName = modelID
	}

	// Initialize agent loop
	msgBus := bus.NewMessageBus()
	defer msgBus.Close()

	agentLoop := agent.NewAgentLoop(cfg, msgBus, provider)
	defer agentLoop.Close()

	// Print initialization info
	startupInfo := agentLoop.GetStartupInfo()
	toolCount := 0
	if tools, ok := startupInfo["tools"].(map[string]any); ok {
		if count, ok := tools["count"].(int); ok {
			toolCount = count
		}
	}

	fmt.Printf("\n%s %s\n",
		ui.StyleSuccess.Render("✓"),
		ui.StyleMuted.Render(fmt.Sprintf("Agent initialized with %d tools", toolCount)))

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	// Show spinner while processing
	stop := ui.ShowSpinner("Processing task...")
	startTime := time.Now()

	// Process the task
	response, err := agentLoop.ProcessDirect(ctx, task, sessionKey)
	elapsed := time.Since(startTime)
	stop()

	if err != nil {
		return fmt.Errorf("error processing task: %w", err)
	}

	// Render and display response
	fmt.Printf("\n%s\n", ui.StyleHeader.Render("Task Result"))
	rendered, _ := ui.RenderMarkdown(response)
	fmt.Printf("%s\n", rendered)

	// Display metrics if requested
	if showMetrics {
		registry := agentLoop.GetRegistry()
		defaultAgent := registry.GetDefaultAgent()
		if defaultAgent != nil {
			displayMetrics(elapsed, defaultAgent, sessionKey)
		}

		// Display benchmark results if available
		benchmark := agentLoop.GetBenchmark()
		if benchmark != nil {
			displayBenchmarkMetrics(elapsed)
		}
	}

	// Get and display learning information if available
	registry := agentLoop.GetRegistry()
	defaultAgent := registry.GetDefaultAgent()
	if defaultAgent != nil && defaultAgent.LearningStore != nil {
		recentLearnings, err := defaultAgent.LearningStore.GetRecentLearnings(ctx, 1)
		if err == nil && len(recentLearnings) > 0 {
			latest := recentLearnings[0]
			displayEvaluation(latest)
		}
	}

	return nil
}

func displayMetrics(elapsed time.Duration, agent *agent.AgentInstance, sessionKey string) {
	fmt.Printf("\n%s\n", ui.StyleHeader.Render("Execution Metrics"))

	history := agent.Sessions.GetHistory(sessionKey)
	messageCount := len(history)
	
	// Estimate tokens from message history
	totalChars := 0
	for _, msg := range history {
		totalChars += utf8.RuneCountInString(msg.Content)
	}
	tokenEstimate := totalChars * 2 / 5

	fmt.Printf("  Duration: %s\n", ui.StyleMuted.Render(elapsed.String()))
	fmt.Printf("  Messages: %d\n", messageCount)
	fmt.Printf("  Estimated Tokens: ~%d\n", tokenEstimate)
}

func displayBenchmarkMetrics(elapsed time.Duration) {
	fmt.Printf("\n%s\n", ui.StyleHeader.Render("Benchmark Info"))
	fmt.Printf("  Run Duration: %s\n", ui.StyleMuted.Render(elapsed.String()))
}

func displayEvaluation(result interface{}) {
	fmt.Printf("\n%s\n", ui.StyleHeader.Render("Evaluation Results"))

	if evalResult, ok := result.(map[string]interface{}); ok {
		if success, ok := evalResult["success"].(bool); ok {
			status := ui.StyleError.Render("✗ Failed")
			if success {
				status = ui.StyleSuccess.Render("✓ Success")
			}
			fmt.Printf("  Status: %s\n", status)
		}

		if score, ok := evalResult["success_score"].(float64); ok {
			fmt.Printf("  Score: %.2f/1.0\n", score)
		}

		if feedback, ok := evalResult["feedback"].(string); ok && feedback != "" {
			fmt.Printf("  Feedback: %s\n", feedback)
		}
	}
}

func estimateTokens(messages []interface{}) int {
	// Simple token estimation: ~2.5 chars per token
	totalChars := 0
	for _, msg := range messages {
		if m, ok := msg.(map[string]interface{}); ok {
			if content, ok := m["Content"].(string); ok {
				totalChars += len(content)
			}
		}
	}
	return totalChars * 2 / 5
}

