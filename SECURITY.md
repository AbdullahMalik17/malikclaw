# Security & Sandboxing Policy 🛡️

MalikClaw is built with a **Security-First** engineering philosophy. Because the agent executes terminal commands, inspects local files, and automates external services, multiple defense-in-depth security layers are active by default.

---

## 🔒 1. Threat Model & Sandboxed Execution

By default, MalikClaw operates within a **Workspace-Restricted Sandbox** (`~/.malikclaw/workspace`).

### A. Filesystem Jailing
- **Directory Bounds**: File operations (`read_file`, `write_file`, `list_dir`) are jailed to the workspace directory tree.
- **Symlink Protection**: Attempts to traverse directory symlinks leading outside the jailed workspace are blocked.
- **System Directory Blocking**: Inspecting OS core directories (e.g. `/etc/passwd`, `/root`, `C:\Windows\System32`) is prohibited unless explicitly whitelisted.

### B. Shell Command Filtering
The `shell` tool employs regex filtering to block destructive operations before execution:

```
[Command Execution Request]
       │
       ▼
 [Regex Security Filter] ──(Matches Blocklist)──► [REJECT: Security Violation]
       │
       ▼ (Safe Command)
  [System Execution]
```

**Blocked Command Patterns Include:**
- **Privilege Escalation**: `sudo`, `su`, `doas`, `chmod 777`, `chown`.
- **Destructive Deletion**: `rm -rf /`, `rm -rf ~`, `del /f/q C:\*`, `rmdir /s /q`.
- **System Power Controls**: `shutdown`, `reboot`, `poweroff`, `init 0`.
- **Disk Partitioning & Formatting**: `format`, `mkfs`, `fdisk`, `dd if=`.
- **Remote Script Piping**: `curl ... | bash`, `wget ... | sh`.

---

## ⚙️ 2. Security Configuration

Security settings can be customized in `~/.malikclaw/config.json`:

### Toggle Workspace Sandbox
```json
{
  "agents": {
    "defaults": {
      "restrict_to_workspace": true
    }
  }
}
```

### Explicit Path Whitelisting
To allow reading or writing to external paths (e.g. log directories or shared backup folders):

```json
{
  "tools": {
    "allow_read_paths": [
      "/var/log/syslog",
      "/home/user/projects/app.log"
    ],
    "allow_write_paths": [
      "/home/user/backups/"
    ]
  }
}
```

### Channel Access Whitelisting (`allow_from`)
To prevent unauthorized users from interacting with your agent over messaging platforms, restrict access to verified user IDs:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "allow_from": ["@verified_admin_handle", "987654321"]
    },
    "discord": {
      "enabled": true,
      "allow_from": ["123456789012345678"]
    }
  }
}
```

---

## 🦅 3. Guardian Engine Security Bounds

The **Guardian engine** allows MalikClaw to inspect, debug, and patch its own source code when enabled:
- **Repository Bound**: Operations are strictly isolated to the local `malikclaw` Git repository.
- **Git Patch Validation**: Self-modifications are applied as non-destructive Git diffs, enabling instantaneous rollback (`git reset --hard HEAD`).
- **Opt-In Only**: Guardian mode is disabled by default in production configurations.

---

## 🔐 4. Secret Management & Sensitive Data Redaction

- **In-Memory Encryption**: Sensitive API keys and tokens are encrypted at rest using `ChaCha20-Poly1305`.
- **Log Masking**: API keys, bearer tokens, and PII are automatically redacted before logs are written to disk or stdout.

---

## 🐛 5. Reporting a Security Vulnerability

We take security vulnerabilities seriously. If you discover a security flaw in MalikClaw:

1. **Do NOT open a public GitHub issue**.
2. Submit a private vulnerability report via [GitHub Security Advisories](https://github.com/AbdullahMalik17/malikclaw/security/advisories/new) or email `security@malikclaw.io`.
3. Include detailed steps to reproduce the issue, proof of concept code, and impact assessment.
4. The core maintainers will acknowledge receipt within 24 hours and provide a timeline for patch deployment.
