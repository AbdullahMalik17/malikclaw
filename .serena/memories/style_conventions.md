# MalikClaw Coding Style and Conventions

## Go Coding Style
* Follow idiomatic Go patterns.
* Use `make fmt` and `make lint` (using `golangci-lint`) to ensure consistency.

## Commit Message Conventions
* Use **Conventional Commits** (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
* Use the **imperative mood** (e.g., "Add retry logic" not "Added retry logic").
* Reference issues when relevant: `Fix session leak (#123)`.

## AI-Assisted Contributions
Disclosure is **required** in Pull Requests:
* 🤖 **Level 1:** Fully AI-generated (reviewed/validated by contributor).
* 🛠️ **Level 2:** Mostly AI-generated (contributor made significant modifications).
* 👨‍💻 **Level 3:** Mostly Human-written.

## Branching Strategy
* Always branch off `main` (e.g., `feat/feature-name`, `fix/bug-name`).
* Pull Requests target `main`.
* No force-pushing after a review has started.
