# MalikClaw Installation Guide 📦

This document provides complete installation instructions for **MalikClaw** across Linux, macOS, Windows, Docker, Android (Termux), edge SBCs (Raspberry Pi, Orange Pi, RISC-V), and package managers.

---

## ⚡ 1. One-Line Automatic Installers (Recommended)

The automated installation script detects your operating system, CPU architecture, downloads the latest pre-compiled static binary, places it in your PATH, and sets up shell completions.

### Linux / macOS / Android Termux
```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex
```

---

## 🐳 2. Docker & Container Deployment

MalikClaw provides multi-architecture Docker images hosted on GitHub Container Registry (`ghcr.io/abdullahmalik17/malikclaw`).

### Quick Docker Run
```bash
docker run -d \
  --name malikclaw \
  --restart unless-stopped \
  -p 18790:18790 \
  -v ~/.malikclaw:/root/.malikclaw \
  ghcr.io/abdullahmalik17/malikclaw:latest
```

### Docker Compose Options

#### Lightweight Mode (Alpine Linux, &lt;15MB Image Size)
`docker/docker-compose.yml`:
```yaml
services:
  malikclaw:
    image: ghcr.io/abdullahmalik17/malikclaw:latest
    container_name: malikclaw
    ports:
      - "18790:18790"
    volumes:
      - ~/.malikclaw:/root/.malikclaw
    restart: unless-stopped
```
Run:
```bash
docker compose -f docker/docker-compose.yml up -d
```

#### Full-Featured Mode (Includes Node.js 24 for MCP Servers & Playwright Browser Automation)
`docker/docker-compose.full.yml`:
```yaml
services:
  malikclaw:
    image: ghcr.io/abdullahmalik17/malikclaw:full
    container_name: malikclaw-full
    ports:
      - "18790:18790"
    environment:
      - PLAYWRIGHT_BROWSERS_PATH=0
    volumes:
      - ~/.malikclaw:/root/.malikclaw
    restart: unless-stopped
```
Run:
```bash
docker compose -f docker/docker-compose.full.yml up -d
```

---

## 🍺 3. Package Managers

### macOS & Linux via Homebrew
```bash
brew install malikclaw
```

### Windows via Scoop
```powershell
scoop bucket add malikclaw https://github.com/AbdullahMalik17/scoop-bucket.git
scoop install malikclaw
```

### Arch Linux via AUR
```bash
yay -S malikclaw
```

---

## 🛠️ 4. Build from Source

Building MalikClaw from source requires **Go 1.21+** and **Git**.

### Step 1: Clone Repository
```bash
git clone https://github.com/AbdullahMalik17/malikclaw.git
cd malikclaw
```

### Step 2: Download Dependencies
```bash
make deps
```

### Step 3: Compile Binary
```bash
# Build for host OS & Architecture
make build

# Install binary into system PATH (/usr/local/bin or $GOPATH/bin)
sudo make install
```

### Cross-Compiling for Other Architectures
```bash
# Cross-compile static binaries for all targets (Linux amd64/arm64/riscv64, Windows, macOS)
make build-all
```

---

## 📱 5. Android Smartphone Deployment (Termux)

Turn an old or unused Android phone into a 24/7 autonomous edge AI server without root privileges:

1. Install **Termux** from [F-Droid](https://f-droid.org/packages/com.termux/) or GitHub Releases.
2. Open Termux and execute:
   ```bash
   pkg update && pkg install curl git -y
   curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
   ```
3. Initialize onboarding wizard:
   ```bash
   malikclaw onboard
   ```
4. Start background gateway server:
   ```bash
   malikclaw gateway &
   ```

---

## 🐜 6. Edge SBCs (Raspberry Pi, Orange Pi, RISC-V)

MalikClaw is engineered specifically for low-resource single-board computers (`<10MB` RAM footprint).

### Supported SBC Devices:
- **Raspberry Pi**: Pi Zero W, Pi Zero 2 W, Pi 3/4/5 (`linux/arm64` or `linux/armv7`)
- **Orange Pi**: Orange Pi Zero, Zero 2 W, Orange Pi 5 (`linux/arm64`)
- **RISC-V SBCs**: Sipeed LicheeRV, Milk-V Duo (`linux/riscv64`)

### Manual Binary Download:
Download pre-built static binaries directly from [GitHub Releases](https://github.com/AbdullahMalik17/malikclaw/releases):

```bash
# Example for Linux ARM64 (Raspberry Pi / Orange Pi)
wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw-linux-arm64.tar.gz
tar -xvf malikclaw-linux-arm64.tar.gz
sudo mv malikclaw /usr/local/bin/
```

---

## 🔍 7. Verification & Post-Install Setup

Verify that MalikClaw is successfully installed and available in your environment:

```bash
# Check version & build info
malikclaw version

# View runtime status
malikclaw status

# Launch interactive onboarding
malikclaw onboard
```

Visit [`QUICKSTART.md`](QUICKSTART.md) to run your first agent tasks.
