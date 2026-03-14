// MalikClaw - Ultra-lightweight personal AI agent
// License: MIT

package tools

import (
	"context"
	"fmt"
	"os/exec"
	"strings"

	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

type AndroidControlTool struct {
}

func NewAndroidControlTool() *AndroidControlTool {
	return &AndroidControlTool{}
}

func (t *AndroidControlTool) Name() string {
	return "android_control"
}

func (t *AndroidControlTool) Description() string {
	return "Control an Android device via ADB. Operations: screenshot, tap, type, swipe, keyevent."
}

func (t *AndroidControlTool) Parameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"operation": map[string]any{
				"type":        "string",
				"description": "The operation to perform: screenshot, tap, type, swipe, keyevent",
				"enum":        []string{"screenshot", "tap", "type", "swipe", "keyevent"},
			},
			"x": map[string]any{
				"type":        "integer",
				"description": "X coordinate for tap/swipe",
			},
			"y": map[string]any{
				"type":        "integer",
				"description": "Y coordinate for tap/swipe",
			},
			"x2": map[string]any{
				"type":        "integer",
				"description": "End X coordinate for swipe",
			},
			"y2": map[string]any{
				"type":        "integer",
				"description": "End Y coordinate for swipe",
			},
			"text": map[string]any{
				"type":        "string",
				"description": "Text to type",
			},
			"key": map[string]any{
				"type":        "string",
				"description": "Key event code (e.g., 'HOME', 'BACK')",
			},
		},
		"required": []string{"operation"},
	}
}

func (t *AndroidControlTool) Execute(ctx context.Context, args map[string]any) *ToolResult {
	operation, _ := args["operation"].(string)

	// Check if ADB is installed
	if _, err := exec.LookPath("adb"); err != nil {
		return ErrorResult("ADB (Android Debug Bridge) not found. Please install it to use this tool.")
	}

	switch operation {
	case "screenshot":
		return t.takeScreenshot()
	case "tap":
		x, _ := args["x"].(float64)
		y, _ := args["y"].(float64)
		return t.tap(int(x), int(y))
	case "type":
		text, _ := args["text"].(string)
		return t.typeText(text)
	case "swipe":
		x1, _ := args["x"].(float64)
		y1, _ := args["y"].(float64)
		x2, _ := args["x2"].(float64)
		y2, _ := args["y2"].(float64)
		return t.swipe(int(x1), int(y1), int(x2), int(y2))
	case "keyevent":
		key, _ := args["key"].(string)
		return t.keyevent(key)
	default:
		return ErrorResult(fmt.Sprintf("unknown operation: %s", operation))
	}
}

func (t *AndroidControlTool) runAdb(args ...string) (string, error) {
	cmd := exec.Command("adb", args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return string(output), fmt.Errorf("adb command failed: %w (output: %s)", err, string(output))
	}
	return string(output), nil
}

func (t *AndroidControlTool) takeScreenshot() *ToolResult {
	// ADB screenshot to stdout is tricky, we save to file then pull
	_, err := t.runAdb("shell", "screencap", "-p", "/sdcard/malikclaw_screenshot.png")
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to take screenshot: %v", err))
	}

	// Pull to a temporary location would be better, but for now we just acknowledge
	// In a real scenario, we'd read this file and return it as media or base64.
	return &ToolResult{
		ForLLM:  "Screenshot taken and saved to /sdcard/malikclaw_screenshot.png on device.",
		ForUser: "Screenshot captured successfully.",
	}
}

func (t *AndroidControlTool) tap(x, y int) *ToolResult {
	_, err := t.runAdb("shell", "input", "tap", fmt.Sprintf("%d", x), fmt.Sprintf("%d", y))
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to tap: %v", err))
	}
	return &ToolResult{ForLLM: fmt.Sprintf("Tapped at %d, %d", x, y), ForUser: "Tap executed."}
}

func (t *AndroidControlTool) typeText(text string) *ToolResult {
	// Escape spaces for ADB input
	escaped := strings.ReplaceAll(text, " ", "%s")
	_, err := t.runAdb("shell", "input", "text", escaped)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to type: %v", err))
	}
	return &ToolResult{ForLLM: fmt.Sprintf("Typed text: %s", text), ForUser: "Text entered."}
}

func (t *AndroidControlTool) swipe(x1, y1, x2, y2 int) *ToolResult {
	_, err := t.runAdb("shell", "input", "swipe", fmt.Sprintf("%d", x1), fmt.Sprintf("%d", y1), fmt.Sprintf("%d", x2), fmt.Sprintf("%d", y2))
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to swipe: %v", err))
	}
	return &ToolResult{ForLLM: "Swipe executed.", ForUser: "Swipe executed."}
}

func (t *AndroidControlTool) keyevent(key string) *ToolResult {
	_, err := t.runAdb("shell", "input", "keyevent", key)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to send keyevent: %v", err))
	}
	return &ToolResult{ForLLM: fmt.Sprintf("Sent keyevent: %s", key), ForUser: "Key event sent."}
}
