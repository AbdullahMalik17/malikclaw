# Security & Sandboxing 🛡️

MalikClaw is built with a **Security-First** philosophy. Since the agent can execute commands and access files, multiple layers of protection are in place to prevent accidental or malicious actions.

---

## 🏗️ The Sandboxed Execution Model

By default, MalikClaw runs in a restricted sandbox. This means the agent can only access files and execute commands within its own **Workspace**.

### Key Restrictions:
- **File System Operations**: `read_file`, `write_file`, and `edit_file` are restricted to the workspace directory.
- **Shell Command Execution**: Command paths must be within the workspace, and dangerous commands are explicitly blocked.
- **Network Access**: Outbound requests are permitted for LLM communication and tools (web search), but local network discovery is limited.

---

## 🚫 Blocked Commands (Safety Guard)

Even if the sandbox is disabled, MalikClaw's `exec` tool will block these dangerous patterns:
- **Bulk Deletion**: `rm -rf`, `del /f`, `rmdir /s`
- **Disk Operations**: `format`, `mkfs`, `diskpart`, `dd if=`
- **System Control**: `shutdown`, `reboot`, `poweroff`
- **Dangerous Constructs**: Fork bombs (e.g., `:(){ :|:& };:`)

---

## ⚙️ Configuration

You can configure the security level in your `config.json` or through environment variables.

### Workspace Restriction
Toggle the sandbox mode (Default: `true`).

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
Enable the agent to read/write specific paths outside the workspace.

```json
{
  "tools": {
    "allow_read_paths": ["/var/log/app.log", "C:\\temp\\data.csv"],
    "allow_write_paths": ["/home/user/exports/"]
  }
}
```

---

## 🦅 Self-Evolution (Guardian)

The **Guardian engine** allows MalikClaw to improve its own source code. This is also sandboxed:
- The agent can only analyze and patch its own source directory.
- All patches are applied safely and can be reverted if they break the build.
- This feature is **off by default** and must be explicitly enabled for specific agents.

---

## ⚠️ Important Warnings

- **Never** run MalikClaw with administrative/root privileges unless absolutely necessary.
- **Always** use `allow_from` in channel configurations to restrict who can talk to your agent.
- **Avoid** exposing the Web Console (launcher) to the public internet, as it currently lacks authentication.

---

Remember: A secure AI assistant is an effective AI assistant. Use the sandbox!
