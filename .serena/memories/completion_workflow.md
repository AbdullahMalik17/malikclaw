# MalikClaw Task Completion Workflow

Before considering a task complete or submitting a PR, ensure the following steps are performed:

1. **Format Code:**
   ```bash
   make fmt
   ```

2. **Static Analysis:**
   ```bash
   make vet
   ```

3. **Run Linters:**
   ```bash
   make lint
   ```

4. **Run Tests:**
   ```bash
   make test
   ```

5. **Full Pre-commit Check:**
   ```bash
   make check
   ```
   *Note: `make check` runs deps, fmt, vet, and test.*

6. **Verify Binary:**
   ```bash
   make build
   ./build/malikclaw version
   ```

7. **PR Disclosure:**
   Ensure the AI involvement level is correctly noted in the PR description.
