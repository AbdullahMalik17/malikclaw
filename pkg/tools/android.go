// MalikClaw - Ultra-lightweight personal AI agent
// License: MIT

package tools

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

type AndroidControlTool struct {
	tempDir string
}

func NewAndroidControlTool() *AndroidControlTool {
	tempDir := filepath.Join(os.TempDir(), "malikclaw-android")
	_ = os.MkdirAll(tempDir, 0755)
	return &AndroidControlTool{
		tempDir: tempDir,
	}
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
			"serial": map[string]any{
				"type":        "string",
				"description": "Android device serial number (optional if only one device connected)",
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
	serial, _ := args["serial"].(string)

	// Check if ADB is installed
	if _, err := exec.LookPath("adb"); err != nil {
		return ErrorResult("ADB (Android Debug Bridge) not found. Please install it to use this tool.")
	}

	switch operation {
	case "screenshot":
		return t.takeScreenshot(serial)
	case "tap":
		x, _ := args["x"].(float64)
		y, _ := args["y"].(float64)
		return t.tap(serial, int(x), int(y))
	case "type":
		text, _ := args["text"].(string)
		return t.typeText(serial, text)
	case "swipe":
		x1, _ := args["x"].(float64)
		y1, _ := args["y"].(float64)
		x2, _ := args["x2"].(float64)
		y2, _ := args["y2"].(float64)
		return t.swipe(serial, int(x1), int(y1), int(x2), int(y2))
	case "keyevent":
		key, _ := args["key"].(string)
		return t.keyevent(serial, key)
	default:
		return ErrorResult(fmt.Sprintf("unknown operation: %s", operation))
	}
}

func (t *AndroidControlTool) runAdb(serial string, args ...string) (string, error) {
	fullArgs := []string{}
	if serial != "" {
		fullArgs = append(fullArgs, "-s", serial)
	}
	fullArgs = append(fullArgs, args...)

	cmd := exec.Command("adb", fullArgs...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return string(output), fmt.Errorf("adb command failed: %w (output: %s)", err, string(output))
	}
	return string(output), nil
}

func (t *AndroidControlTool) takeScreenshot(serial string) *ToolResult {
	remotePath := "/sdcard/malikclaw_screenshot.png"
	localPath := filepath.Join(t.tempDir, "screenshot.png")

	_, err := t.runAdb(serial, "shell", "screencap", "-p", remotePath)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to capture screenshot on device: %v", err))
	}

	_, err = t.runAdb(serial, "pull", remotePath, localPath)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to pull screenshot from device: %v", err))
	}

	return &ToolResult{
		ForLLM:  fmt.Sprintf("Screenshot captured and saved locally at %s", localPath),
		ForUser: "Screenshot captured successfully.",
	}
}

func (t *AndroidControlTool) tap(serial string, x, y int) *ToolResult {
	_, err := t.runAdb(serial, "shell", "input", "tap", fmt.Sprintf("%d", x), fmt.Sprintf("%d", y))
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to tap: %v", err))
	}
	logger.InfoCF("android", "Tap executed", map[string]any{"x": x, "y": y, "serial": serial})
	return &ToolResult{ForLLM: fmt.Sprintf("Tapped at %d, %d", x, y), ForUser: "Tap executed."}
}

func (t *AndroidControlTool) typeText(serial string, text string) *ToolResult {
	// Escape spaces for ADB input
	escaped := strings.ReplaceAll(text, " ", "%s")
	_, err := t.runAdb(serial, "shell", "input", "text", escaped)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to type: %v", err))
	}
	logger.InfoCF("android", "Text entered", map[string]any{"text": text, "serial": serial})
	return &ToolResult{ForLLM: fmt.Sprintf("Typed text: %s", text), ForUser: "Text entered."}
}

func (t *AndroidControlTool) swipe(serial string, x1, y1, x2, y2 int) *ToolResult {
	_, err := t.runAdb(serial, "shell", "input", "swipe", fmt.Sprintf("%d", x1), fmt.Sprintf("%d", y1), fmt.Sprintf("%d", x2), fmt.Sprintf("%d", y2))
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to swipe: %v", err))
	}
	logger.InfoCF("android", "Swipe executed", map[string]any{"from": fmt.Sprintf("%d,%d", x1, y1), "to": fmt.Sprintf("%d,%d", x2, y2), "serial": serial})
	return &ToolResult{ForLLM: "Swipe executed.", ForUser: "Swipe executed."}
}

func (t *AndroidControlTool) keyevent(serial string, key string) *ToolResult {
	_, err := t.runAdb(serial, "shell", "input", "keyevent", key)
	if err != nil {
		return ErrorResult(fmt.Sprintf("failed to send keyevent: %v", err))
	}
	logger.InfoCF("android", "Key event sent", map[string]any{"key": key, "serial": serial})
	return &ToolResult{ForLLM: fmt.Sprintf("Sent keyevent: %s", key), ForUser: "Key event sent."}
}
