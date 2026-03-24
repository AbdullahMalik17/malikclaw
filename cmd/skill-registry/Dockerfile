# Stage 1: Build
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Enable CGO_ENABLED=0 for a static binary
ENV CGO_ENABLED=0

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the skill registry microservice
RUN go build -ldflags="-s -w" -o skill-registry ./cmd/skill-registry

# Stage 2: Final Lightweight Image
FROM alpine:latest

# Use a non-root user for security
RUN adduser -D malikclaw
USER malikclaw

WORKDIR /home/malikclaw

COPY --from=builder /app/skill-registry .

EXPOSE 8080

ENTRYPOINT ["./skill-registry"]
