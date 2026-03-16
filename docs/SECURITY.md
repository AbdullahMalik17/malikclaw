# Security & Sandboxing 🛡️

MalikClaw is built with a **Security-First** philosophy. Since the agent has the power to execute shell commands and access the local filesystem, multiple protection layers are enforced by default.

---

## 🏗️ The Sandboxed Execution Model

By default, MalikClaw runs in a **Workspace-Restricted Sandbox**. This ensures the agent behaves as a localized tool rather than a full system user.

### 1. FileSystem Jailing
The `read_file`, `write_file`, and `edit_file` tools are jailed within the configured workspace directory.
- **Access Control**: Attempting to read files like `/etc/passwd` or `C:\Windows\System32` will be blocked automatically.
- **Escalation Prevention**: Symlink following outside the workspace is disabled.

### 2. Regex-Based Command Filtering
The `exec` tool uses a sophisticated regex engine to block dangerous shell commands before they are ever sent to the system.

**Examples of Blocked Commands:**
- **Privilege Escalation**: `sudo`, `su`, `chmod`, `chown`.
- **Destructive Deletion**: `rm -rf`, `del /f/q`, `rmdir /s`.
- **System Control**: `shutdown`, `reboot`, `poweroff`, `systemctl`.
- **Remote Execution**: `curl | sh`, `wget | sh`, `ssh`.
- **Disk/Low-level**: `format`, `mkfs`, `dd if=`, `fdisk`.
- **Container Escaping**: `docker run`, `docker exec`.

---

## ⚙️ Configuration & Customization

You can fine-tune the security posture in your `config.json`.

### Toggle Sandbox Mode
We recommend keeping this enabled (`true`) for all general-purpose agents.

```json
{
  "agents": {
    "defaults": {
      "restrict_to_workspace": true
    }
  }
}
```

### Path Whitelisting
If you need your agent to access specific external files (e.g., a database or log file), use the allow-lists:

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

The **Guardian engine** allows MalikClaw to modify its own source code. This is the highest privilege an agent can have.
- **Bounded Domain**: It can only "see" and "patch" its own project directory.
- **Non-Destructive**: Guardian works by applying Git-like diffs, allowing for safe rollbacks.
- **Disabled by Default**: Requires explicit configuration to enable.

---

## ⚠️ Best Practices

1.  **Least Privilege**: Run the `malikclaw` binary as a standard user, never as root/Administrator.
2.  **Access Lists**: Always populate the `allow_from` field in your messaging channels (Telegram, Discord) to prevent unauthorized users from hijacking your agent.
3.  **Local Web Console**: The Web Launcher listens on `localhost:18800` by default. Do not expose this port to the public internet using `-public` unless you are behind a secure VPN or firewall.

---

Remember: A secure AI assistant is an effective AI assistant. **Trust, but verify.**
