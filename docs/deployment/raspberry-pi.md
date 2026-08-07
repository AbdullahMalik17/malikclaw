# Deploying MalikClaw on Raspberry Pi (ARM64 / IoT)

This guide provides step-by-step instructions for deploying **MalikClaw** on **Raspberry Pi 4, 5, and Zero 2 W** running 64-bit Raspberry Pi OS or Ubuntu Server.

---

## Hardware Architecture

```
  [ Sensors / I2C / SPI / GPIO ]
                │
                ▼
  [ Raspberry Pi 4/5 Hardware ]
 (ARM64 SoC - BCM2711 / BCM2712)
                │
                ▼
  [ Systemd Service (malikclaw) ]
                │
      ┌─────────┴─────────┐
      ▼                   ▼
 [ Native I2CTool ]  [ Native SPITool ]
  (/dev/i2c-1)        (/dev/spidev0.0)
```

---

## 1. Cross-Compiling for Raspberry Pi (ARM64)

Compile the binary on your development workstation for fast build speeds:

### Host Build Commands
```bash
# Linux / macOS
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o build/malikclaw-arm64 ./cmd/malikclaw/

# Windows PowerShell
$env:CGO_ENABLED="0"; $env:GOOS="linux"; $env:GOARCH="arm64"; go build -ldflags="-w -s" -o build/malikclaw-arm64 ./cmd/malikclaw/
```

---

## 2. Raspberry Pi Setup & Hardware Permissions

### Step 1: Install Required Utilities
On your Raspberry Pi terminal:
```bash
sudo apt update && sudo apt install -y i2c-tools spi-tools curl git
```

### Step 2: Enable I2C & SPI Hardware Buses
```bash
sudo raspi-config nonint do_i2c 0
sudo raspi-config nonint do_spi 0
```

### Step 3: Create Dedicated System User & Grant Hardware Permissions
```bash
sudo useradd -r -m -s /bin/bash malikclaw
sudo usermod -aG i2c,gpio,spi-users,dialout malikclaw
```

### Step 4: Install Binary
Transfer `malikclaw-arm64` to the Pi:
```bash
sudo mv malikclaw-arm64 /usr/local/bin/malikclaw
sudo chmod +x /usr/local/bin/malikclaw
```

---

## 3. Systemd Service Unit Configuration

Create a production systemd unit file at `/etc/systemd/system/malikclaw.service`:

```ini
[Unit]
Description=MalikClaw Personal AI Agent Gateway
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=malikclaw
Group=malikclaw
WorkingDirectory=/home/malikclaw
Environment="MALIKCLAW_GATEWAY_HOST=0.0.0.0"
Environment="ANTHROPIC_API_KEY=sk-ant-..."
Environment="OPENAI_API_KEY=sk-proj-..."
ExecStart=/usr/local/bin/malikclaw gateway
Restart=always
RestartSec=5s

# Security Hardening Directives
ProtectSystem=full
ProtectHome=false
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

### Enable & Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now malikclaw
sudo systemctl status malikclaw
```

---

## 4. Programmatic Hardware Control (Go Code Example)

This Go example demonstrates interacting with connected I2C sensor hardware using MalikClaw tools on Raspberry Pi:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func main() {
	// Instantiate I2C Tool for bus 1 (/dev/i2c-1)
	i2cTool := tools.NewI2CTool()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Read 2 bytes from I2C sensor at address 0x68 (e.g. MPU6050 / RTC)
	args := map[string]any{
		"bus":     1,
		"address": "0x68",
		"reg":     "0x75", // WHO_AM_I register
		"length":  1,
	}

	result := i2cTool.Execute(ctx, args)
	if result.IsError {
		log.Fatalf("I2C Read Error: %s", result.Error)
	}

	fmt.Printf("I2C Hardware Read Success: %s\n", result.Content)
}
```

---

## 5. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **`permission denied: /dev/i2c-1`** | `malikclaw` user not added to `i2c` group. | Run `sudo usermod -aG i2c malikclaw` and restart service (`sudo systemctl restart malikclaw`). |
| **Thermal Throttling / Slow Execution** | Pi CPU overheating under heavy agent tool loops. | Add passive heatsink / active fan and inspect status via `vcgencmd measure_temp`. |
| **SD Card Corruption / IO Stalls** | Excessive session logging writing to cheap SD cards. | Enable zRAM and log to RAM (`tmpfs`), or boot Pi from external USB3 SSD. |
| **OOM (Out Of Memory) Crash** | Limited RAM on Pi 4 1GB or Pi Zero 2 W. | Add 2GB swap space (`sudo dphys-swapfile swapon`) or configure `light_model` routing. |

---

## 6. Production Security Hardening Tips

1. **Systemd Security Restrictions**:
   Maintain `ProtectSystem=full` and `NoNewPrivileges=true` in `/etc/systemd/system/malikclaw.service` to prevent process privilege escalation.

2. **Disable Default `pi` User**:
   Delete or disable the default Raspberry Pi user (`sudo usermod -L pi`) to mitigate SSH brute-force attempts.

3. **UFW Firewall Rules**:
   Restrict incoming traffic to gateway port `18790` only from trusted subnets:
   ```bash
   sudo ufw default deny incoming
   sudo ufw allow ssh
   sudo ufw allow from 192.168.1.0/24 to any port 18790
   sudo ufw enable
   ```

4. **Hardware Access Scope**:
   Only add the `malikclaw` user to specific hardware groups (`i2c`, `gpio`) that are strictly required for your IoT deployment.
