package tools

import (
	"context"
	"errors"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestAndroidControlTool_MockedADB(t *testing.T) {
	type call struct {
		serial string
		args   []string
	}

	okLookPath := func(name string) (string, error) {
		if name == "adb" {
			return "/mock/bin/adb", nil
		}
		return "", errors.New("not found")
	}

	t.Run("missing adb returns helpful error", func(t *testing.T) {
		tool := NewAndroidControlToolWithRunner(t.TempDir(), func(string) (string, error) {
			return "", errors.New("executable file not found")
		}, nil)

		res := tool.Execute(context.Background(), map[string]any{"operation": "screenshot"})
		if !res.IsError || !strings.Contains(res.ForLLM, "ADB") {
			t.Fatalf("expected missing ADB error, got: %+v", res)
		}
	})

	t.Run("operations dispatch exact adb arguments", func(t *testing.T) {
		var calls []call
		tmpDir := t.TempDir()
		tool := NewAndroidControlToolWithRunner(tmpDir, okLookPath, func(serial string, args ...string) (string, error) {
			calls = append(calls, call{serial: serial, args: append([]string(nil), args...)})
			return "ok", nil
		})

		// 1. screenshot
		res := tool.Execute(context.Background(), map[string]any{
			"operation": "screenshot",
			"serial":    "emulator-5554",
		})
		if res.IsError {
			t.Fatalf("screenshot failed: %s", res.ForLLM)
		}
		if !strings.Contains(res.ForLLM, filepath.Join(tmpDir, "screenshot.png")) {
			t.Errorf("expected local screenshot path in ForLLM, got: %s", res.ForLLM)
		}
		if len(calls) != 2 {
			t.Fatalf("expected 2 adb calls for screenshot, got %d", len(calls))
		}
		if calls[0].serial != "emulator-5554" || !reflect.DeepEqual(calls[0].args, []string{"shell", "screencap", "-p", "/sdcard/malikclaw_screenshot.png"}) {
			t.Errorf("unexpected screencap call: %+v", calls[0])
		}
		if !reflect.DeepEqual(calls[1].args, []string{"pull", "/sdcard/malikclaw_screenshot.png", filepath.Join(tmpDir, "screenshot.png")}) {
			t.Errorf("unexpected pull call: %+v", calls[1])
		}

		// 2. tap
		calls = nil
		res = tool.Execute(context.Background(), map[string]any{
			"operation": "tap",
			"x":         float64(200),
			"y":         float64(400),
		})
		if res.IsError || len(calls) != 1 || !reflect.DeepEqual(calls[0].args, []string{"shell", "input", "tap", "200", "400"}) {
			t.Fatalf("unexpected tap result/calls: res=%+v calls=%+v", res, calls)
		}

		// 3. type (space escaping)
		calls = nil
		res = tool.Execute(context.Background(), map[string]any{
			"operation": "type",
			"text":      "Assalam o Alaikum",
		})
		if res.IsError || len(calls) != 1 || !reflect.DeepEqual(calls[0].args, []string{"shell", "input", "text", "Assalam%so%sAlaikum"}) {
			t.Fatalf("unexpected type result/calls: res=%+v calls=%+v", res, calls)
		}

		// 4. swipe
		calls = nil
		res = tool.Execute(context.Background(), map[string]any{
			"operation": "swipe",
			"x":         float64(500),
			"y":         float64(20),
			"x2":        float64(500),
			"y2":        float64(1000),
		})
		if res.IsError || len(calls) != 1 || !reflect.DeepEqual(calls[0].args, []string{"shell", "input", "swipe", "500", "20", "500", "1000"}) {
			t.Fatalf("unexpected swipe result/calls: res=%+v calls=%+v", res, calls)
		}

		// 5. keyevent
		calls = nil
		res = tool.Execute(context.Background(), map[string]any{
			"operation": "keyevent",
			"key":       "HOME",
		})
		if res.IsError || len(calls) != 1 || !reflect.DeepEqual(calls[0].args, []string{"shell", "input", "keyevent", "HOME"}) {
			t.Fatalf("unexpected keyevent result/calls: res=%+v calls=%+v", res, calls)
		}

		// 6. unknown operation
		res = tool.Execute(context.Background(), map[string]any{"operation": "open-url"})
		if !res.IsError || !strings.Contains(res.ForLLM, "unknown operation") {
			t.Fatalf("expected unknown operation error, got: %+v", res)
		}
	})
}
