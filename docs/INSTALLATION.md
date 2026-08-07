# Installation Guide 📦

MalikClaw can be installed on a wide variety of platforms, from high-performance servers and cloud containers down to $10 Linux single-board computers (SBCs) and Android mobile devices.

---

## 🚀 One-Command Installation (Recommended)

### Linux / macOS:
```bash
curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
```
*Alternatively via short link:* `curl -sSfL https://malikclaw.io/install.sh | sh`

### Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex
```

---

## 🐳 Docker Deployment

Run MalikClaw using Docker or Docker Compose with persistent configuration:

### Quick Run:
```bash
docker run -d --name malikclaw \
  -p 18790:18790 \
  -v ~/.malikclaw:/root/.malikclaw \
  ghcr.io/abdullahmalik17/malikclaw:latest
```

### Docker Compose:
```bash
# Minimal (Alpine-based, <15MB image)
docker compose -f docker/docker-compose.yml up -d

# Full-featured (Node.js for MCP support & Playwright)
docker compose -f docker/docker-compose.full.yml up -d
```

---

## 🍺 Package Managers

### Homebrew (macOS / Linux):
```bash
brew install malikclaw
```

### Scoop (Windows):
```bash
scoop install malikclaw
```

### AUR (Arch Linux):
```bash
yay -S malikclaw
```

---

## 🛠️ Build from Source

Building from source requires Go 1.21+ and optional Make.

```bash
# 1. Clone repo
git clone https://github.com/AbdullahMalik17/malikclaw.git
cd malikclaw

# 2. Download dependencies
make deps

# 3. Build for current OS/architecture
make build

# 4. Install binary to system path
sudo make install

# 5. Build for all platforms (Linux/macOS/Windows/ARM)
make build-all
```

---

## 📱 Mobile (Android / Termux)

Repurpose an old Android smartphone into an autonomous edge AI server:

1. Install **Termux** (from F-Droid or GitHub Releases).
2. Download and run the one-command installer inside Termux:
   ```bash
   pkg update && pkg install curl -y
   curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
   ```
3. Initialize onboarding:
   ```bash
   malikclaw onboard
   ```

---

## 🐜 Edge SBCs (Raspberry Pi, Orange Pi, RISC-V)

MalikClaw is optimized for low-power hardware (<10MB RAM, <1s boot):

- **Raspberry Pi / Orange Pi Zero**: Cross-compile with `make build-pi-zero` or download the `linux-arm64` release binary.
- **RISC-V SBCs (Sipeed LicheeRV, etc.)**: Built-in support using `GOARCH=riscv64 go build`.

---

## 🛡️ Verification & Onboarding

After installation, verify your installation and configure your model API keys:

```bash
# Check version
malikclaw version

# Run interactive onboarding wizard
malikclaw onboard

# Start gateway / web UI
malikclaw gateway
```
Access the Bento Grid web interface at: **http://localhost:18790**

