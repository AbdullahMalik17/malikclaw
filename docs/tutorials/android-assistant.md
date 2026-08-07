# Building an Autonomous Android Device Control Assistant

This tutorial explains how to build an **Autonomous Android Assistant** using **MalikClaw**. Using ADB (Android Debug Bridge) integration via `AndroidControlTool`, the agent can inspect screen content, perform touch gestures (tap, swipe, keyevents), and automate mobile app workflows.

---

## Architecture Overview

```
 [ Agent Goal ] ──► [ MalikClaw Agent Loop ]
                             │
                             ▼
                  [ AndroidControlTool ]
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ ADB Screencap ]                  [ ADB Input ]
 (PNG -> Temp File)           (tap, swipe, text, keyevent)
            │                                 │
            └────────────────┬────────────────┘
                             ▼
                    [ Android Device ]
                  (USB / Wireless ADB)
```

---

## 1. Runnable Go Implementation

The Go example below configures an agent with `AndroidControlTool` to capture device screenshots, analyze UI layout, and execute input actions.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent"
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	// 1. Verify local ADB availability
	if _, err := exec.LookPath("adb"); err != nil {
		log.Fatalf("ADB binary not found in PATH. Install android-tools/platform-tools first.")
	}

	// 2. Initialize configuration
	cfg := config.DefaultConfig()
	cfg.Agents.Defaults.ModelName = "openai/gpt-4o"
	cfg.Agents.Defaults.MaxToolIterations = 10
	cfg.Agents.Defaults.Workspace = "./android_workspace"

	provider, _, err := providers.CreateProvider(cfg)
	if err != nil {
		log.Fatalf("Provider error: %v", err)
	}

	msgBus := bus.NewMessageBus()
	defer msgBus.Close()

	agentLoop := agent.NewAgentLoop(cfg, msgBus, provider)
	defer agentLoop.Close()

	// 3. Register Android Control Tool
	registry := agentLoop.GetRegistry()
	defAgent := registry.GetDefaultAgent()
	if defAgent == nil {
		log.Fatalf("Default agent instance missing")
	}

	androidTool := tools.NewAndroidControlTool()
	defAgent.Tools.Register(androidTool)

	// 4. Execute device automation task
	prompt := `Perform the following actions on the connected Android device:
1. Take a screenshot to inspect the current screen.
2. Tap on the center of the screen (x=500, y=1000).
3. Send a HOME keyevent to return to the launcher screen.`

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	fmt.Println("Executing Android automation task...")
	response, err := agentLoop.ProcessDirect(ctx, prompt, "session:android-task")
	if err != nil {
		log.Fatalf("Execution failed: %v", err)
	}

	fmt.Println("\n=== Automation Result ===")
	fmt.Println(response)
}
```

### Build & Run Go Example
```bash
export OPENAI_API_KEY="sk-proj-..."
go run main.go
```

---

## 2. CLI Execution Steps

### Step 1: Connect Android Device via ADB
Connect via USB or Wireless ADB:
```bash
# USB Check
adb devices

# Wireless ADB Connection (Android 11+)
adb connect 192.168.1.50:5555
```

### Step 2: Test Screenshot via CLI
```bash
malikclaw run "Take a screenshot of the connected Android device and report the saved path" --debug
```

### Step 3: Run Interactive UI Automation
```bash
malikclaw run "Tap at x=300 y=800, type 'Hello MalikClaw', and press enter keyevent" --session "android-session"
```

---

## 3. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **`error: device unauthorized`** | ADB USB debugging prompt not accepted on phone. | Unlock Android phone, check screen, and tap "Always allow from this computer". |
| **`error: no devices/emulators found`** | ADB daemon down or USB driver missing. | Run `adb kill-server && adb start-server` and verify with `adb devices`. |
| **Tap / Swipe Has No Effect** | Display screen is turned off or device is locked. | Issue keyevent 26 (POWER) or keyevent 82 (MENU/UNLOCK) before touch events. |
| **Coordinates Off Target** | Resolution mismatch between screencap and touch input. | Retrieve screen dimensions via `adb shell wm size` and scale coordinates. |

---

## 4. Production Security Hardening Tips

1. **Restrict Wireless ADB Interfaces**:
   Never leave wireless ADB (`port 5555`) exposed on public Wi-Fi networks. Bind ADB to localhost or secure private VPNs.

2. **Prevent High-Risk Touch Operations**:
   Restrict `AndroidControlTool` execution from tapping dangerous OS dialogs (e.g. system resets, device admin grants, payment confirmations).

3. **Temporary File Management**:
   Screenshots taken during execution are stored in temporary system directories. Ensure automatic cleanup routines purge sensitive UI screenshots containing OTPs or private messages.

4. **ADB Key Pair Authorization**:
   Keep `~/.android/adbkey` protected with `0600` file permissions to prevent unauthorized host machines from accessing your devices.
