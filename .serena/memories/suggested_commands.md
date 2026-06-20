# MalikClaw Suggested Commands

## Build and Install
* `make build`: Build the `malikclaw` binary for the current platform.
* `make install`: Install the binary to `~/.local/bin`.
* `make build-all`: Cross-compile for all supported platforms.
* `make build-launcher`: Build the web console backend.

## Development and Testing
* `make check`: Run the full pre-commit check (deps + fmt + vet + test).
* `make test`: Run all Go tests.
* `make lint`: Run all linters using `golangci-lint`.
* `make fmt`: Format the Go source code.
* `make deps`: Download and verify dependencies.

## Running Entrypoints
* `malikclaw agent`: Start the agent in interactive mode.
* `malikclaw agent -m "command"`: Run a single agent command.
* `malikclaw gateway`: Start the web console and gateway.
* `malikclaw onboard`: Run the interactive onboarding setup.
* `malikclaw status`: Check the system status.

## Docker Commands
* `make docker-build`: Build minimal Alpine-based Docker images.
* `make docker-run`: Run the gateway in Docker.
* `make docker-test`: Test MCP tools inside a Docker container.
