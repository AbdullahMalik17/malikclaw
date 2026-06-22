# ============================================================
# Stage 1: Build the malikclaw binary
# ============================================================
FROM golang:1.25-alpine AS builder

RUN apk add --no-cache git make

WORKDIR /src

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build
COPY . .
RUN make build

# ============================================================
# Stage 2: Minimal runtime image for Cloud Deployment
# ============================================================
FROM alpine:3.23

RUN apk add --no-cache ca-certificates tzdata curl

# Health check (gateway runs on 18790)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:18790/health || exit 1

# Create non-root user and group
RUN addgroup -g 1000 malikclaw && \
    adduser -D -u 1000 -G malikclaw malikclaw

# Switch to non-root user
USER malikclaw
WORKDIR /home/malikclaw

# Copy binary
COPY --from=builder /src/build/malikclaw /usr/local/bin/malikclaw

# Set environment variables for external access
ENV MALIKCLAW_GATEWAY_HOST=0.0.0.0

# Run onboard to create initial directories and config
RUN /usr/local/bin/malikclaw onboard

# Expose default ports used by gateway and launcher
EXPOSE 18790 18800

# Persistent volume for application data
VOLUME ["/home/malikclaw/.malikclaw"]

ENTRYPOINT ["malikclaw"]
CMD ["gateway"]
