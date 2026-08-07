# Enterprise Production Deployment & Security Guide

This guide covers production deployment patterns for **MalikClaw**, including TLS termination (Nginx/Caddy), systemd daemon management, Swarm node orchestration, rate limiting, and zero-trust security hardening.

---

## Production Architecture

```
  [ Internet Clients / Webhooks ]
                │
                ▼ (HTTPS / WSS Port 443)
  [ Caddy / Nginx Reverse Proxy ]
  (TLS 1.3 / Let's Encrypt / Rate Limiter)
                │
                ▼ (HTTP Port 18790)
  [ MalikClaw Primary Gateway Node ]
                │
       ┌────────┴────────┐
       ▼                 ▼
[ Local Memory ]   [ Swarm Node Cluster ]
(JSONL Store)      (pkg/swarm HTTP Mesh)
```

---

## 1. Systemd Service Deployment

Create `/etc/systemd/system/malikclaw.service`:

```ini
[Unit]
Description=MalikClaw Production Agent Gateway
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=malikclaw
Group=malikclaw
WorkingDirectory=/var/lib/malikclaw
EnvironmentFile=/etc/malikclaw/environment
ExecStart=/usr/local/bin/malikclaw gateway
Restart=always
RestartSec=3s
LimitNOFILE=65536

# Security Hardening
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/malikclaw /var/log/malikclaw
PrivateTmp=true
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictRealtime=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

---

## 2. Reverse Proxy & TLS Configuration (Caddy & Nginx)

### Caddyfile (Automatic Let's Encrypt TLS)
```caddy
agent.yourdomain.com {
    reverse_proxy 127.0.0.1:18790 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
    }

    # Rate limiting & header security
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
    }
}
```

### Nginx Configuration (`/etc/nginx/sites-available/malikclaw`)
```nginx
server {
    listen 443 ssl http2;
    server_name agent.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/agent.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agent.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://127.0.0.1:18790;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Distributed Swarm Cluster Orchestration (Go Code Example)

The following Go application demonstrates setting up a production Swarm node to dispatch micro-agent workloads across nodes using `pkg/swarm`:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/swarm"
)

func main() {
	// 1. Initialize Swarm Node
	cfg := swarm.Config{
		NodeID:   "node-primary-01",
		BindAddr: ":7331",
	}

	// Task handler function for processing distributed tasks
	handler := func(ctx context.Context, task swarm.Task) (swarm.TaskResult, error) {
		log.Printf("Executing remote swarm task %s for agent %s", task.ID, task.AgentID)
		return swarm.TaskResult{
			TaskID: task.ID,
			Result: fmt.Sprintf("Task %s completed successfully on %s", task.ID, cfg.NodeID),
			NodeID: cfg.NodeID,
		}, nil
	}

	s := swarm.NewSwarm(cfg, handler)

	// 2. Start Swarm Server
	go func() {
		if err := s.Start(); err != nil {
			log.Fatalf("Swarm server error: %v", err)
		}
	}()
	defer s.Stop(context.Background())

	// 3. Register Peer Node
	s.RegisterNode(&swarm.Node{
		ID:       "node-worker-02",
		Address:  "10.0.0.2:7331",
		LastSeen: time.Now(),
	})

	// 4. Dispatch Task to Swarm Peer
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	task := swarm.Task{
		ID:      "task-101",
		AgentID: "coding-agent",
		Payload: "Run unit tests on sub-repository",
	}

	fmt.Println("Dispatching task to swarm worker node...")
	res, err := s.Dispatch(ctx, "node-worker-02", task)
	if err != nil {
		log.Printf("Swarm dispatch failed (simulated peer offline): %v", err)
		return
	}

	fmt.Printf("Swarm Response: %+v\n", res)
}
```

---

## 4. Operational & Administrative Execution Steps

### Step 1: Environment File Security (`/etc/malikclaw/environment`)
```bash
sudo mkdir -p /etc/malikclaw
sudo cat << 'EOF' > /etc/malikclaw/environment
MALIKCLAW_GATEWAY_HOST=127.0.0.1
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
EOF
sudo chmod 600 /etc/malikclaw/environment
sudo chown malikclaw:malikclaw /etc/malikclaw/environment
```

### Step 2: Service Verification & Metrics Monitoring
```bash
# Service status check
sudo systemctl status malikclaw

# Real-time log stream
sudo journalctl -u malikclaw -f

# Verify API health response
curl -i http://127.0.0.1:18790/health
```

---

## 5. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **HTTP 502 Bad Gateway** | Systemd service dead or listening on wrong address. | Verify `MALIKCLAW_GATEWAY_HOST=127.0.0.1` and check `journalctl -u malikclaw`. |
| **WebSocket Connection Drops** | Reverse proxy idle timeout too aggressive. | Increase `proxy_read_timeout` in Nginx to `86400s` for persistent WebSocket channels. |
| **LLM Provider HTTP 429 (Rate Limit)** | Concurrent agent requests exceeding API tier limits. | Configure provider fallback chains (`model_fallbacks`) or enable request throttling in `config.json`. |
| **Systemd Start Failure (`Read-only file system`)** | Application attempting to write outside `ReadWritePaths`. | Ensure `/var/lib/malikclaw` is included under `ReadWritePaths` in `malikclaw.service`. |

---

## 6. Production Security Hardening Tips

1. **Zero-Trust File Isolation**:
   Set `restrict_to_workspace: true` in `config.json`. Ensure the production workspace directory is restricted to `chown malikclaw:malikclaw` with `0700` permissions.

2. **At-Rest API Key Encryption**:
   Encrypt API keys and sensitive tokens in memory using `ChaCha20-Poly1305` and avoid writing plain credentials to log files.

3. **UFW Firewall Enforcement**:
   Block all public access to backend ports `18790` and `7331`. Only allow traffic via reverse proxy ports `80`/`443`:
   ```bash
   sudo ufw default deny incoming
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **Channel Whitelisting**:
   Strictly populate `allow_from` arrays for all connected messaging platforms (Telegram, Discord, Slack, Feishu) to prevent unauthorized bot invocation.
