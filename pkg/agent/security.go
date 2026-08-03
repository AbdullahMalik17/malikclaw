package agent

import (
	"context"
	"fmt"
	"regexp"
)

var (
	// injectionHeuristics contains patterns commonly found in prompt injection/jailbreak attempts.
	injectionHeuristics = []*regexp.Regexp{
		regexp.MustCompile(`(?i)(ignore\s+all\s+previous\s+instructions)`),
		regexp.MustCompile(`(?i)(you\s+are\s+now\s+(?:a\s+)?(?:bot|assistant|AI)\s+named)`),
		regexp.MustCompile(`(?i)(jailbreak)`),
		regexp.MustCompile(`(?i)(bypass\s+(?:your\s+)?(?:filters|rules|instructions))`),
		regexp.MustCompile(`(?i)(forget\s+everything)`),
		regexp.MustCompile(`(?i)(do\s+not\s+follow\s+the\s+rules)`),
		regexp.MustCompile(`(?i)(system\s+prompt\s+override)`),
		regexp.MustCompile(`(?i)(print\s+(?:your\s+)?(?:system\s+)?prompt)`),
		regexp.MustCompile(`(?i)(developer\s+mode\s+enabled)`),
		regexp.MustCompile(`(?i)(disregard\s+(?:the\s+)?previous)`),
	}
)

// SecurityOptions configures security features.
type SecurityOptions struct {
	EnablePromptInjectionGuard bool
}

// CheckPromptInjection scans a user message for prompt injection patterns.
func CheckPromptInjection(ctx context.Context, message string) error {
	for _, heuristic := range injectionHeuristics {
		if heuristic.MatchString(message) {
			// Log but don't include the exact payload in the error message
			// to avoid re-injecting through logs.
			return fmt.Errorf("security violation: blocked by prompt injection guard")
		}
	}
	
	// Check for excessive repetitive non-alphanumeric characters which can confuse LLMs (buffer overflow style jailbreaks).
	nonAlphaNumRatio := getNonAlphaNumRatio(message)
	if len(message) > 500 && nonAlphaNumRatio > 0.6 {
		return fmt.Errorf("security violation: blocked due to anomalous payload structure")
	}

	return nil
}

func getNonAlphaNumRatio(message string) float64 {
	if len(message) == 0 {
		return 0.0
	}
	count := 0
	for _, r := range message {
		if !((r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == ' ' || r == '\n' || r == '\t') {
			count++
		}
	}
	return float64(count) / float64(len(message))
}
