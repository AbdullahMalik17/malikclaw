# Installation Guide 📦

MalikClaw can be installed on a wide variety of platforms, from high-performance servers to $10 edge devices.

---

## 🚀 One-Liner (Recommended)

The fastest way to get MalikClaw is using our installation script:

```bash
# For macOS and Linux
curl -sSfL https://malikclaw.io/install.sh | sh
```

For Windows users, please download the latest `.exe` from the [Releases](https://github.com/AbdullahMalik17/malikclaw/releases) page.

---

## 🛠️ Build from Source

If you want the latest features or want to contribute to development, build from source.

### Prerequisites
- [Go](https://go.dev/doc/install) 1.21 or higher
- [Make](https://www.gnu.org/software/make/) (optional, but recommended)

### Build Steps
```bash
git clone https://github.com/AbdullahMalik17/malikclaw.git
cd malikclaw

# Install dependencies
make deps

# Build for current platform
make build

# Install to /usr/local/bin
sudo make install
```

---

## 🐳 Docker

Run MalikClaw using Docker Compose for a zero-install experience.

```bash
# 1. Clone the repository
git clone https://github.com/AbdullahMalik17/malikclaw.git
cd malikclaw

# 2. Start Gateway
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

For detailed Docker usage, refer to the [README.md](https://github.com/AbdullahMalik17/malikclaw#docker-compose).

---

## 📱 Mobile (Android/Termux)

Give your old phone a second life!

1. Install [Termux](https://termux.dev/) (from F-Droid).
2. Download the `linux-arm64` binary from our releases.
3. Use `proot` for a full Linux environment if needed.
4. Run:
   ```bash
   chmod +x malikclaw-linux-arm64
   ./malikclaw-linux-arm64 onboard
   ```

---

## 🐜 Edge Devices (Raspberry Pi, etc.)

MalikClaw is optimized for low-power hardware.

- **Raspberry Pi Zero 2 W**: Use `make build-pi-zero` to build optimized 32/64-bit binaries.
- **RISC-V Boards**: Support for Sipeed LicheeRV and other RISC-V SBCs is built-in. Use `GOARCH=riscv64 go build`.

---

## 🛡️ Verification

After installation, verify with:
```bash
malikclaw version
```
You should see the current version and build information.
