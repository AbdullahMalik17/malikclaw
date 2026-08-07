# Deploying MalikClaw with Docker & Docker Compose

This guide provides instructions for building, configuring, and running **MalikClaw** inside containerized Docker and Docker Compose environments.

---

## Container Architecture

```
                                [ Host Machine ]
                                       │
                         Port 18790    │    Port 18800
                         (Gateway)     │    (Launcher)
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Docker Container (malikclaw:cloud)                           │
        │ User: malikclaw (UID 1000)                                  │
        │                                                             │
        │   ┌──────────────────┐            ┌─────────────────────┐   │
        │   │  malikclaw       │            │  ~/.malikclaw       │   │
        │   │  binary          │            │  workspace & config │   │
        │   └─────────┬────────┘            └──────────▲──────────┘   │
        │             │                                │              │
        └─────────────┼────────────────────────────────┼──────────────┘
                      │                                │
                      └────── Persistent Volume ───────┘
                              (malikclaw_data)
```

---

## 1. Dockerfile & Multi-Stage Build

Below is the production multi-stage `Dockerfile` optimized for minimal size (~35MB) and security.

```dockerfile
# ============================================================
# Stage 1: Build binary
# ============================================================
FROM golang:1.25-alpine AS builder

RUN apk add --no-cache git make

WORKDIR /src

# Cache dependency layers
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and compile statically
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o build/malikclaw ./cmd/malikclaw/

# ============================================================
# Stage 2: Minimal runtime image
# ============================================================
FROM alpine:3.23

RUN apk add --no-cache ca-certificates tzdata curl

# Create unprivileged service user
RUN addgroup -g 1000 malikclaw && \
    adduser -D -u 1000 -G malikclaw malikclaw

USER malikclaw
WORKDIR /home/malikclaw

# Copy binary from builder
COPY --from=builder /src/build/malikclaw /usr/local/bin/malikclaw

ENV MALIKCLAW_GATEWAY_HOST=0.0.0.0

# Initialize default directory structure
RUN /usr/local/bin/malikclaw onboard

EXPOSE 18790 18800

VOLUME ["/home/malikclaw/.malikclaw"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:18790/health || exit 1

ENTRYPOINT ["malikclaw"]
CMD ["gateway"]
```

---

## 2. Docker Compose Configuration

Create a `docker-compose.yml` file to manage persistent storage, environment secrets, and networking:

```yaml
version: '3.8'

services:
  malikclaw:
    build:
      context: .
      dockerfile: Dockerfile
    image: malikclaw:cloud
    container_name: malikclaw
    restart: unless-stopped
    environment:
      - MALIKCLAW_GATEWAY_HOST=0.0.0.0
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "18790:18790" # REST/WebSocket Gateway API
      - "18800:18800" # Web UI / Launcher
    volumes:
      - malikclaw_data:/home/malikclaw/.malikclaw
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:18790/health"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  malikclaw_data:
    name: malikclaw_data
```

---

## 3. Deployment & Execution Steps

### Step 1: Create `.env` Secret File
```bash
cat << 'EOF' > .env
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
EOF
chmod 600 .env
```

### Step 2: Build & Start Container
```bash
docker-compose build
docker-compose up -d
```

### Step 3: Verify Deployment & Health Status
```bash
# Check container logs
docker-compose logs -f malikclaw

# Verify health endpoint
curl http://localhost:18790/health
```

### Step 4: Run Task via Container Exec
```bash
docker exec -it malikclaw malikclaw run "Check system health and memory usage"
```

---

## 4. Programmatic Container Check (Go Code Example)

You can check and interact with your containerized MalikClaw gateway programmatically using Go:

```go
package main

import (
	"context"
	"io"
	"log"
	"net/http"
	"time"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", "http://localhost:18790/health", nil)
	if err != nil {
		log.Fatalf("Request build error: %v", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatalf("Container health check failed: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	log.Printf("Container Status: %d | Response: %s", resp.StatusCode, string(body))
}
```

---

## 5. Troubleshooting Notes

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **`Permission Denied` on volume mount** | Host volume directory owned by `root` instead of UID `1000`. | Run `chown -R 1000:1000 /var/lib/docker/volumes/malikclaw_data`. |
| **Gateway connection refused on host** | `MALIKCLAW_GATEWAY_HOST` bound to `127.0.0.1` inside container. | Ensure `MALIKCLAW_GATEWAY_HOST=0.0.0.0` environment variable is set. |
| **Container unhealthy status** | Gateway service crashed due to invalid API keys. | Run `docker logs malikclaw` to inspect startup errors. |
| **OutOfMemory (OOM) Kill** | Heavy web fetch or context window exceeding RAM limits. | Configure container memory limit in Compose: `mem_limit: 1g`. |

---

## 6. Production Security Hardening Tips

1. **Non-Root Execution**:
   The `Dockerfile` creates and switches to a dedicated unprivileged user (`malikclaw`, UID 1000). Never remove `USER malikclaw`.

2. **Read-Only Root Filesystem**:
   Enforce a read-only root filesystem in Docker Compose, allowing writes only to `/tmp` and the volume mount:
   ```yaml
   read_only: true
   tmpfs:
     - /tmp
   ```

3. **No Capability Escapes**:
   Drop all default Linux kernel capabilities:
   ```yaml
   cap_drop:
     - ALL
   ```

4. **Secret Isolation**:
   Pass credentials via Docker secrets or `.env` files with `0600` permissions. Do not hardcode API tokens into the image or `Dockerfile`.
