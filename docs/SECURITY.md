# Security & Sandboxing 🛡️

MalikClaw is built with a **Security-First** philosophy. Because the agent can execute shell commands, manage files, and automate device interactions, multiple defense-in-depth protection layers are active by default.

---

## 🏗️ The Sandboxed Execution Model

By default, MalikClaw runs in a **Workspace-Restricted Sandbox**. This ensures the agent operates within safe boundaries without risking system integrity.

### 1. FileSystem Jailing
The `read_file`, `write_file`, `edit_file`, and tool execution mechanisms are jailed within the configured workspace directory (`~/.malikclaw/workspace`).
- **Access Control**: Attempts to inspect system files outside permitted paths (e.g. `/etc/passwd`, `C:\Windows\System32`) are blocked.
- **Escalation Prevention**: Following directory symlinks outside the workspace jail is disabled.

### 2. Regex-Based Command Filtering
The `shell` tool uses a strict regex-based engine to block dangerous commands before execution.

**Examples of Blocked Operations:**
- **Privilege Escalation**: `sudo`, `su`, `chmod`, `chown`.
- **Destructive Deletion**: `rm -rf /`, `del /f/q`, `rmdir /s`.
- **System Control**: `shutdown`, `reboot`, `poweroff`, `systemctl`.
- **Untrusted Downloader Execution**: Raw `curl | sh`, `wget | sh`.
- **Disk Partitioning**: `format`, `mkfs`, `dd if=`, `fdisk`.

---

## ⚙️ Configuration & Customization

You can fine-tune security controls in `~/.malikclaw/config.json`.

### Toggle Workspace Sandbox
Workspace restriction is enabled (`true`) by default:

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
To allow access to specific external logs or directories, populate path allowlists:

```json
{
  "tools": {
    "allow_read_paths": ["/home/user/logs/app.log"],
    "allow_write_paths": ["/home/user/backups/"]
  }
}
```

---

## 🦅 Guardian: Self-Evolution Security

The **Guardian engine** allows MalikClaw to modify its own source code when explicitly authorized.
- **Bounded Scope**: Restricted strictly to the local `malikclaw` code repository.
- **Non-Destructive Diffs**: Applies Git-native diffs, allowing easy rollback (`git checkout`).
- **Explicit Opt-In**: Disabled by default until enabled in config.

---

## ⚠️ Best Practices

1. **Least Privilege**: Run the `malikclaw` process under a unprivileged user account.
2. **Access Control**: Always populate the `allow_from` user list in channel configs (Telegram, Discord, WhatsApp) to prevent unauthorized access.
3. **Web Interface Security**: The Gateway dashboard listens on `http://localhost:18790` by default. Do not expose this port publicly without authentication.

