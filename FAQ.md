# Frequently Asked Questions (FAQ) ❓

Find answers to common questions about **MalikClaw** architecture, installation, hardware requirements, security sandboxing, local LLMs, and mobile automation.

---

## ❓ 1. General & Vision

### Q: How is MalikClaw different from Python agent frameworks like AutoGen, CrewAI, or LangChain?
**A:** Most Python agent frameworks consume 200MB–500MB+ of RAM, require heavy virtual environments, and take 10+ seconds to start up. MalikClaw is compiled natively in **Go**. It consumes **&lt;10MB RAM**, boots in **&lt;1s**, ships as a single static binary (~30MB), and runs efficiently on $10 edge hardware (Orange Pi Zero, Raspberry Pi, old Android phones).

### Q: What hardware can run MalikClaw?
**A:** MalikClaw runs on almost any computer or embedded board produced in the last 15 years:
- **Low-Cost Linux SBCs**: Orange Pi Zero, Raspberry Pi Zero W / 2 W, Sipeed LicheeRV RISC-V.
- **Android Smartphones**: Runs natively inside **Termux** (Android 8.0+, non-root).
- **Desktops & Cloud VPS**: Linux (`x86_64`, `arm64`), macOS (Apple Silicon / Intel), Windows 10/11, Docker, Kubernetes.

---

## ❓ 2. Installation & Runtime

### Q: Why does terminal say `command not found: malikclaw` after installation?
**A:** The installation directory (`$HOME/.local/bin` or `/usr/local/bin`) might not be in your environment `$PATH`.
Add it to your shell configuration (`~/.bashrc` or `~/.zshrc`):
```bash
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Q: How do I run MalikClaw as a 24/7 background daemon?
**A:** You can launch the gateway server using Docker, systemd, or nohup:
```bash
# Via malikclaw gateway command
nohup malikclaw gateway > ~/.malikclaw/gateway.log 2>&1 &

# Or via Docker
docker run -d --name malikclaw --restart unless-stopped -p 18790:18790 -v ~/.malikclaw:/root/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest
```

---

## ❓ 3. LLM Providers & Local Models

### Q: How do I run 100% offline private LLMs with Ollama?
**A:** Install Ollama (`ollama serve`) and pull your model (e.g. `ollama pull llama3.3`).
In `~/.malikclaw/config.json`, add Ollama to `model_list`:
```json
{
  "model_list": [
    {
      "model_name": "llama3.3",
      "model": "ollama/llama3.3",
      "api_base": "http://localhost:11434/v1"
    }
  ]
}
```

### Q: How do automated fallback chains work?
**A:** If your primary LLM API key runs out of quota, hits rate limits (HTTP 429), or suffers downtime, MalikClaw automatically retries down the ordered list of models defined in `model_list`.

---

## ❓ 4. Security & Sandboxing

### Q: Why did MalikClaw refuse to run my command (`Command blocked by security filter`)?
**A:** MalikClaw enforces strict regex filtering on shell execution to prevent privilege escalation (`sudo`, `su`), catastrophic file deletion (`rm -rf /`), disk formatting (`mkfs`), or dangerous remote script pipes (`curl | sh`).

### Q: Can I allow file access outside `~/.malikclaw/workspace`?
**A:** Yes. You can configure path allowlists in `~/.malikclaw/config.json`:
```json
{
  "tools": {
    "allow_read_paths": ["/var/log/syslog", "/etc/hosts"],
    "allow_write_paths": ["/home/user/backups/"]
  }
}
```

---

## ❓ 5. Channels & Mobile Control (ADB)

### Q: How do I connect my Android phone for ADB control?
**A:**
1. Enable **Developer Options** and **USB Debugging** on your phone.
2. Connect your phone to your computer via USB or Wi-Fi ADB.
3. Verify connection by running `adb devices`.
4. Issue natural language commands to MalikClaw: `malikclaw agent -m "Take a screenshot of my phone"`.

### Q: How do I prevent strangers from talking to my agent on Telegram or Discord?
**A:** Set the `allow_from` whitelist in your channel configuration inside `config.json` with your specific user IDs:
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "bot_token": "YOUR_BOT_TOKEN",
      "allow_from": ["@your_telegram_username", "123456789"]
    }
  }
}
```

---

## ❓ 6. Troubleshooting & Diagnostics

### Q: Where are log files located?
**A:** Standard logs are output to stdout/stderr. When running the gateway daemon, logs are saved in `~/.malikclaw/logs/` or accessible via:
```bash
malikclaw logs --follow
```

### Q: How do I enable debug logging?
**A:** Pass the `--verbose` flag on CLI commands:
```bash
malikclaw agent -m "Debug system state" --verbose
```
