# Security & Sandboxing Policy 🛡️

> Note: This document is the **operational security reference** for operators and is synchronized with root [`SECURITY.md`](../SECURITY.md). It is what the docs site serves at `/docs/security`; vulnerability disclosure is §7 below.

MalikClaw is built with a **Security-First** engineering philosophy. Because the agent executes terminal commands, inspects local files, and automates external services, multiple defense-in-depth security layers are active by default:

- **Workspace sandbox** — filesystem jailing and shell command filtering (§1).
- **Network boundary firewall** — SSRF and private-range blocking, with a per-subsystem loopback opt-in (§3).
- **Prompt-injection data boundary** — untrusted-content isolation and heuristic scanning (§4).

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

## 🕸️ 3. Network Boundary Firewall (SSRF)

**Version:** v2.0.0 · **Source:** `pkg/security/ssrf.go`

Every URL an agent can be *told* to fetch is untrusted input — a web page, an MCP tool result, a skill manifest, a link in an incoming message. MalikClaw now validates outbound HTTP at three independent layers instead of trusting the first DNS answer.

### A. What The Firewall Blocks

| Category | Coverage |
| :--- | :--- |
| **Scheme** | Only `http` and `https`. `file://`, `gopher://`, `dict://`, custom schemes are rejected. |
| **Loopback** | `127.0.0.0/8`, `::1`, and the hostnames `localhost` / `*.localhost` — blocked unless explicitly opted in. |
| **Private networks** | RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. |
| **Cloud metadata** | `169.254.0.0/16` (AWS/GCP/Azure/OpenStack `169.254.169.254`) plus the hostnames `metadata.google.internal`, `metadata.goog`, `*.metadata.google.internal` — blocked **before** DNS resolution, so a poisoned resolver cannot resurrect them. |
| **Link-local** | `fe80::/10` (IPv6), interface-local and IPv4 multicast. |
| **CGNAT** | `100.64.0.0/10` — the range carrier-grade ISPs and many internal service meshes use. |
| **IPv6 ULA** | `fc00::/7`, plus `ff00::/8` multicast. |
| **Reserved** | `0.0.0.0/8` ("this network"), `240.0.0.0/4`, the unspecified addresses `0.0.0.0` and `::`. |
| **Tunnel bypasses** | IPv4-mapped IPv6 (`::ffff:169.254.169.254`) is rejected unconditionally — even with the localhost opt-in enabled. 6to4 (`2002::/16`) and Teredo (`2001:0::/32`) addresses are unpacked and their embedded IPv4 address is re-checked recursively. |

### B. Three Layers Of Enforcement

1. **`ValidateURL` at request time** — parses the URL, applies the scheme and hostname rules, then resolves DNS and checks **every** returned address. A hostname with one public and one `169.254.169.254` record is refused outright.
2. **`NewSafeDialContext` at connect time** — the guard runs again inside the dialer against the IP actually being connected to. This closes the classic **DNS-rebinding (TOCTOU)** bypass where a name resolves to a safe address during validation and a private one when the socket opens. Blocked candidates are skipped; if every resolved address is private, the dial fails with `all resolved addresses … are blocked`.
3. **`NewSafeCheckRedirect` on redirects** — each hop is re-validated, with a redirect cap (default `10`). A public URL that 302s to `http://169.254.169.254/` never opens a socket.

`NewSafeHTTPClient` wires all three together (plus proxy support) and is what the firewalled subsystems use.

### C. Where It Is Active

Verified call sites: the `web` search/fetch tools (including Brave/Tavily/SearXNG/GLM base URLs), the `browser` tool's navigation guard, MCP **SSE/HTTP** server connections, skill registries (ClawHub, GitHub index, simple-registry) and skill downloads, `swarm` peer traffic, `utils` file/media downloads, and the onboarding wizard's provider probes.

### D. Opting A Local Endpoint Through The Guard 🔓

Private ranges stay blocked **permanently** — the opt-in only ever relaxes **loopback**, which is what a local Ollama, vLLM, LM Studio, SearXNG, or self-hosted MCP server needs. It is a separate decision per subsystem, so a local search box does not silently expose your whole LAN.

```json
{
  "tools": {
    "web": {
      "allow_localhost": true,
      "searxng": {
        "enabled": true,
        "base_url": "http://127.0.0.1:8888/search",
        "allow_localhost": true
      }
    },
    "mcp": {
      "servers": {
        "local-tools": {
          "enabled": true,
          "type": "http",
          "url": "http://localhost:3000/mcp",
          "allow_localhost": true
        }
      }
    }
  },
  "skills": {
    "registries": {
      "clawhub": {
        "base_url": "http://127.0.0.1:8787",
        "allow_localhost": true
      }
    }
  }
}
```

Equivalent environment variables (verified in `pkg/config`):

- `MALIKCLAW_TOOLS_WEB_ALLOW_LOCALHOST`
- `MALIKCLAW_TOOLS_WEB_TAVILY_ALLOW_LOCALHOST`
- `MALIKCLAW_TOOLS_WEB_SEARXNG_ALLOW_LOCALHOST`
- `MALIKCLAW_TOOLS_WEB_GLM_ALLOW_LOCALHOST`
- `MALIKCLAW_SKILLS_REGISTRIES_CLAWHUB_ALLOW_LOCALHOST`

`tools.mcp.servers.<name>.allow_localhost` is **config-file only** — no environment override exists.

A local **Ollama/vLLM model provider** needs no opt-in: provider base URLs are dialed by the LLM client and are **not** routed through this firewall. The loopback allowance in the onboarding probe (`http://localhost:11434`) is hard-coded for that detection step only.

### E. Proxy Support

`tools.web.proxy` (`MALIKCLAW_TOOLS_WEB_PROXY`) accepts `http`, `https`, `socks5`, and `socks5h`; anything else is rejected at startup. When it is unset, `HTTP_PROXY`/`HTTPS_PROXY` are honoured. For authenticated proxies use the environment variables rather than embedding credentials in `config.json`. Note that a proxy hands name resolution to the proxy for `socks5h`, so the dial-time check then applies to whatever the proxy resolves.

### F. Limits ⚠️

- **Allow-listing loopback means the agent can reach anything listening on 127.0.0.1.** Local services frequently trust the loopback interface as authentication.
- The firewall covers **HTTP(S) fetch paths only**. It does not police `exec`, file, or database tools; a shell command is still the widest network door and remains under the command filter in §1.
- Public hosts that resolve to private IPs are blocked, but a hostile **public** service that proxies onward to an internal one is outside what IP-range checks can see.
- Validation happens per request; it is not an egress policy engine. For hard isolation, run MalikClaw in a container or network namespace with its own egress rules (see `deployment/docker.md`).

---

## 🧱 4. Prompt-Injection Data Boundary

**Version:** v2.0.0 · **Source:** `pkg/security/prompt_guard.go`

Anything the agent reads from outside — a fetched web page, an MCP tool payload, an email body, a calendar invite — is data, and data must never be able to pose as instructions. Two mechanisms enforce that boundary.

### A. Data-Boundary Isolation (`WrapUntrusted`)

Untrusted payloads are wrapped at ingestion:

```
<untrusted_data source="gmail:list_unread">
… fetched content …
</untrusted_data>
```

- The `source` attribute is sanitised to `[a-zA-Z0-9._:/@ -]`, so a crafted source string cannot break out of the attribute quote.
- Any `<untrusted_data>` or `</untrusted_data>` tag **inside** the content — case variants and whitespace tricks like `< /  untrusted_data >` included — is HTML-escaped to `&lt;`/`&gt;`. A fetched page cannot close the envelope early and start a fake "system" block.

Applied at verified call sites: `web` fetch/search results, the `browser` tool, MCP tool results **and** MCP error text, `gmail:list_unread`, `calendar:list_events`, and the observations recorded in the agentic loop.

### B. Heuristic Scanner (`ScanPromptInjection`)

Content is scanned against ten high-confidence rules and assigned the **highest** severity matched:

| Category | Detects | Severity |
| :--- | :--- | :--- |
| `instruction_override` | "ignore/disregard/forget … previous/system instructions", "do not follow the system rules" | High |
| `role_override` | `<|im_start|> system`, `[system prompt]`, `### System Instructions`, `new system prompt:`, "you are now in developer/DAN/unrestricted mode" | High / Medium |
| `secret_exfiltration` | "reveal/print/dump/leak your system prompt", verbs (`exfiltrate`, `steal`, `send`, `upload`…) targeting API keys, OAuth tokens, `.env`, `~/.ssh`, AWS credentials, `process.env`, plus direct `cat ~/.ssh/id_rsa` / `cat /etc/shadow` | High / **Critical** |
| `encoded_payload` | `base64 -d \| sh`, `curl … \| bash`, `wget … \| sh`, `powershell -enc <blob>` | **Critical** |

`SanitizeUntrustedOutput` combines both: on a **High or Critical** hit it logs a structured warning (`source`, `severity`, matched rule names — never the raw payload) and prepends a banner inside the envelope telling the model to treat the content as passive data.

### C. Inbound Message Guard

User messages are screened before they ever reach the model (`CheckPromptInjection` in the agent loop). A High/Critical match, one of the ten additional jailbreak phrases (`ignore all previous instructions`, `jailbreak`, `bypass your filters`, `print your system prompt`, `developer mode enabled`, …), or a >500-character payload that is more than 60% non-alphanumeric is rejected with:

> ⚠️ Security Policy Violation: Your message contains patterns associated with prompt injection or bypass attempts and has been blocked.

**This screen is unconditional.** There is no `config.json` key and no environment variable that turns it off, and message-blocking is not configurable per agent or per channel.

### D. Limits ⚠️

- **Heuristics are not a guarantee.** The rule set is deliberately narrow and high-confidence to avoid blocking legitimate traffic; paraphrase, translation, homoglyphs, or an entirely novel phrasing pass through untouched. Treat detection as telemetry, never as a sandbox.
- Low and Medium findings are recorded but produce **no banner** — only High/Critical annotate the payload.
- Wrapping **marks** the boundary; it cannot force a weak model to respect it. Boundary compliance is strongest with instruction-following frontier models.
- The scanner does not remove, redact, or truncate content — an injected string that reads as plain prose is forwarded verbatim inside the envelope.
- Tag escaping covers the `untrusted_data` boundary specifically. It is not a general HTML/XSS sanitizer, and output is not re-sanitized before it is rendered in a Web UI or forwarded to a channel.

---

## 🦅 5. Guardian Engine Security Bounds

The **Guardian engine** allows MalikClaw to inspect, debug, and patch its own source code when enabled:
- **Repository Bound**: Operations are strictly isolated to the local `malikclaw` Git repository.
- **Git Patch Validation**: Self-modifications are applied as non-destructive Git diffs, enabling instantaneous rollback (`git reset --hard HEAD`).
- **Opt-In Only**: Guardian mode is disabled by default in production configurations.

---

## 🔐 6. Secret Management & Sensitive Data Redaction

- **In-Memory Encryption**: Sensitive API keys and tokens are encrypted at rest using `ChaCha20-Poly1305`.
- **Log Masking**: API keys, bearer tokens, and PII are automatically redacted before logs are written to disk or stdout.

---

## 🐛 7. Reporting a Security Vulnerability

We take security vulnerabilities seriously. If you discover a security flaw in MalikClaw:

1. **Do NOT open a public GitHub issue**.
2. Submit a private vulnerability report via [GitHub Security Advisories](https://github.com/AbdullahMalik17/malikclaw/security/advisories/new) or email `security@malikclaw.io`.
3. Include detailed steps to reproduce the issue, proof of concept code, and impact assessment.
4. The core maintainers will acknowledge receipt within 24 hours and provide a timeline for patch deployment.
