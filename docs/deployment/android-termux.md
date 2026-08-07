# Deploying MalikClaw on Android via Termux

This guide covers deploying and running **MalikClaw** natively on Android smartphones and tablets using **Termux**.

---

## Deployment Architecture

```
  [ Android OS (Linux Kernel) ]
               │
               ▼
     [ Termux Environment ]
 (ARM64 Userland / ~/termux)
               │
               ▼
     [ MalikClaw Gateway ]
  (Native ARM64 Go Binary)
               │
   ┌───────────┴───────────┐
   ▼                       ▼
[ Termux API ]      [ ADB Loopback ]
(Battery/SMS)      (Device Control)
```

---

## 1. Cross-Compiling for Android ARM64

You can cross-compile the MalikClaw binary from Linux, macOS, or Windows host machines.

### Cross-Compilation Command (Host Machine)

#### Linux / macOS:
```bash
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o build/malikclaw-arm64 ./cmd/malikclaw/
```

#### Windows PowerShell:
```powershell
$env:CGO_ENABLED="0"; $env:GOOS="linux"; $env:GOARCH="arm64"; go build -ldflags="-w -s" -o build/malikclaw-arm64 ./cmd/malikclaw/
```

---

## 2. Termux Installation & Setup Steps

Perform the following steps inside Termux on your Android device (installed from F-Droid).

### Step 1: Update Packages & Install Dependencies
```bash
pkg update && pkg upgrade -y
pkg install -y git openjdk-17 android-tools curl ts
```

### Step 2: Transfer & Install MalikClaw Binary
Transfer `malikclaw-arm64` to your device (via `scp`, `adb push`, or HTTP download):

```bash
# Make binary executable and move to bin directory
chmod +x malikclaw-arm64
mv malikclaw-arm64 $PREFIX/bin/malikclaw
```

### Step 3: Run Initialization & Onboarding
```bash
malikclaw onboard
```

### Step 4: Export Environment Credentials
Add credentials to `~/.bashrc` or `~/.zshrc`:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-proj-..."
```

---

## 3. Running MalikClaw Gateway as a Background Service

To keep MalikClaw running continuously without being killed by Android battery optimization:

### Step 1: Acquire Termux Wake-Lock
```bash
termux-wake-lock
```

### Step 2: Disable Battery Optimization
In Android Settings:
`Settings -> Apps -> Termux -> Battery -> Set to "Unrestricted"`.

### Step 3: Start Gateway Service
```bash
nohup malikclaw gateway > ~/.malikclaw/gateway.log 2>&1 &
```

---

## 4. Programmatic Device Control (Go Example)

This Go snippet demonstrates invoking Android system features via Termux API from within MalikClaw tools:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"time"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Execute termux-battery-status command
	cmd := exec.CommandContext(ctx, "termux-battery-status")
	output, err := cmd.Output()
	if err != nil {
		log.Fatalf("Termux API call failed: %v", err)
	}

	fmt.Println("=== Android Battery Status ===")
	fmt.Println(string(output))
}
```

---

## 5. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **Process Killed in Background** | Android Phantom Process Killer terminating background apps. | Run `termux-wake-lock` and disable battery optimizations. On Android 12+, disable phantom process killer via ADB (`adb shell device_config put activity_manager max_phantom_processes 2147483647`). |
| **`Permission Denied` when executing binary** | Binary located on internal SD card (`/sdcard`) which lacks execute bits. | Move binary to `$PREFIX/bin/` or `~/`. |
| **`termux-api` commands hang** | Termux:API app not installed or missing permissions. | Install `Termux:API` APK from F-Droid and grant Android system permissions. |
| **DNS Resolution Failure in Termux** | Android Wi-Fi/Cellular network change. | Configure static DNS in Termux: `echo "nameserver 1.1.1.1" > $PREFIX/etc/resolv.conf`. |

---

## 6. Production Security Hardening Tips

1. **Secure OpenSSH Access**:
   If enabling SSH in Termux (`sshd`), enforce key-based authentication (`authorized_keys`) and disable password authentication in `$PREFIX/etc/ssh/sshd_config`.

2. **Loopback Only Gateway Binding**:
   Bind the gateway to `127.0.0.1` unless remote network access is explicitly needed, preventing local Wi-Fi devices from reaching your phone's agent.

3. **Storage Access Isolation**:
   Only run `termux-setup-storage` if file access is required. Keep `restrict_to_workspace: true` in `config.json`.

4. **Keep Packages Updated**:
   Periodically update Termux packages (`pkg update && pkg upgrade`) to patch local OpenSSL and Android library vulnerabilities.
