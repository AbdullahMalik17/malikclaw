#!/usr/bin/env bash
# =============================================================================
# MalikClaw AI Agent - Ultra-Lightweight Installer
# =============================================================================
# Target: $10 SBCs (Orange Pi Zero, Raspberry Pi Zero) & Old Android (Termux)
# Features: Idempotent, Zero Input, <10MB RAM Optimized, Colorful Logging
# =============================================================================

set -euo pipefail

# --- Configuration ---
readonly REPO_OWNER="AbdullahMalik17"
readonly REPO_NAME="malikclaw"
readonly BINARY_NAME="malikclaw"
readonly CONFIG_DIR="$HOME/.malikclaw"
readonly CONFIG_FILE="$CONFIG_DIR/config.json"
readonly WORKSPACE_DIR="$CONFIG_DIR/workspace"

# --- Color Codes (ASCII) ---
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m' # No Color

# --- Logging Functions ---
log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} ${BOLD}$1${NC}"; }
log_warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
log_error()   { echo -e "${RED}[✗]${NC} ${BOLD}$1${NC}"; }
log_step()    { echo -e "\n${MAGENTA}━━━ $1 ${MAGENTA}━━━${NC}"; }

# --- Graceful Exit Handler ---
cleanup_and_exit() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Installation failed with exit code $exit_code"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}Please check the error above and try again${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    fi
    exit $exit_code
}
trap cleanup_and_exit EXIT

# --- Helper: Check if running in Termux ---
is_termux() {
    [[ -n "${TERMUX_VERSION:-}" ]] || \
    [[ -n "${PREFIX:-}" && "$PREFIX" == *"/data/data/com.termux/files/usr"* ]] || \
    [[ "$(uname -o 2>/dev/null)" == "Android" ]]
}

# --- Helper: Check if proot is available ---
has_proot() {
    command -v proot &>/dev/null || command -v termux-chroot &>/dev/null
}

# --- Helper: Download with fallback ---
download_file() {
    local url="$1"
    local output="$2"
    
    if command -v curl &>/dev/null; then
        curl -fsSL -o "$output" "$url"
    elif command -v wget &>/dev/null; then
        wget -q -O "$output" "$url"
    else
        log_error "Neither curl nor wget found. Please install one."
        return 1
    fi
}

# --- Step 1: Detect Architecture & Environment ---
detect_environment() {
    log_step "Detecting Environment"
    
    ARCH=$(uname -m)
    OS=$(uname -s)
    ENV_TYPE="linux"
    
    # Detect Termux
    if is_termux; then
        ENV_TYPE="termux"
        log_info "Detected: ${CYAN}Termux (Android)${NC}"
    else
        log_info "Detected: ${CYAN}Standard Linux${NC}"
    fi
    
    # Detect Architecture
    case "$ARCH" in
        aarch64|arm64)
            ARCH="arm64"
            log_info "Architecture: ${CYAN}ARM64 (aarch64)${NC}"
            ;;
        armv7l|armhf|armv7)
            ARCH="arm"
            log_info "Architecture: ${CYAN}ARMv7 (32-bit)${NC}"
            ;;
        x86_64|amd64)
            ARCH="amd64"
            log_info "Architecture: ${CYAN}x86_64${NC}"
            ;;
        *)
            log_error "Unsupported architecture: $ARCH"
            echo -e "${YELLOW}Supported: aarch64, armv7l, x86_64${NC}"
            return 1
            ;;
    esac
    
    # Set binary path based on environment
    if [[ "$ENV_TYPE" == "termux" ]]; then
        INSTALL_BIN="$PREFIX/bin"
        log_info "Install Path: ${CYAN}$INSTALL_BIN${NC} (Termux)"
    else
        INSTALL_BIN="/usr/local/bin"
        log_info "Install Path: ${CYAN}$INSTALL_BIN${NC} (System)"
    fi
    
    BINARY_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest/download/${BINARY_NAME}-linux-${ARCH}"
}

# --- Step 2: Setup Termux Environment (if needed) ---
setup_termux() {
    if [[ "$ENV_TYPE" != "termux" ]]; then
        return 0
    fi
    
    log_step "Configuring Termux Environment"
    
    # Check if proot is installed
    if ! has_proot; then
        log_info "Installing proot (required for Termux chroot)..."
        pkg update -y &>/dev/null || apt update -y &>/dev/null || true
        pkg install -y proot || apt install -y proot || {
            log_error "Failed to install proot"
            return 1
        }
        log_success "proot installed"
    else
        log_info "proot already available"
    fi
    
    # Create wrapper script for termux-chroot execution
    if [[ -n "$(command -v termux-chroot)" ]]; then
        log_info "termux-chroot available - will use for execution"
    fi
    
    log_success "Termux environment configured"
}

# --- Step 3: Fetch Latest Release Binary ---
fetch_binary() {
    log_step "Fetching Latest Release"
    
    local temp_binary
    temp_binary=$(mktemp)
    
    log_info "Downloading from: ${CYAN}$BINARY_URL${NC}"
    
    if ! download_file "$BINARY_URL" "$temp_binary"; then
        log_error "Failed to download binary"
        echo -e "${YELLOW}Check your internet connection or visit:${NC}"
        echo -e "${CYAN}https://github.com/${REPO_OWNER}/${REPO_NAME}/releases${NC}"
        rm -f "$temp_binary"
        return 1
    fi
    
    # Verify download succeeded
    if [[ ! -s "$temp_binary" ]]; then
        log_error "Downloaded file is empty"
        rm -f "$temp_binary"
        return 1
    fi
    
    # Set executable permissions
    chmod +x "$temp_binary"
    log_success "Binary downloaded and permissions set"
    
    # Move to install location
    if [[ "$ENV_TYPE" == "termux" ]]; then
        mkdir -p "$INSTALL_BIN"
        mv "$temp_binary" "$INSTALL_BIN/${BINARY_NAME}"
    else
        # Try to install to system path, fallback to user path
        if [[ -w "$INSTALL_BIN" ]]; then
            mv "$temp_binary" "$INSTALL_BIN/${BINARY_NAME}"
        else
            log_warn "Cannot write to $INSTALL_BIN (need sudo)"
            log_info "Installing to $HOME/.local/bin instead..."
            INSTALL_BIN="$HOME/.local/bin"
            mkdir -p "$INSTALL_BIN"
            mv "$temp_binary" "$INSTALL_BIN/${BINARY_NAME}"
            log_info "Add to PATH: ${CYAN}export PATH=\$HOME/.local/bin:\$PATH${NC}"
        fi
    fi
    
    log_success "Binary installed to: ${INSTALL_BIN}/${BINARY_NAME}"
}

# --- Step 4: Generate Default Configuration ---
generate_config() {
    log_step "Generating Configuration"
    
    # Create config directory
    mkdir -p "$CONFIG_DIR"
    mkdir -p "$WORKSPACE_DIR"
    
    # Check if config already exists (idempotent)
    if [[ -f "$CONFIG_FILE" ]]; then
        log_warn "Configuration already exists at: $CONFIG_FILE"
        log_info "Skipping config generation (preserving existing)"
        return 0
    fi
    
    # Generate optimized config for <10MB RAM hardware
    cat > "$CONFIG_FILE" << 'EOF'
{
  "agents": {
    "defaults": {
      "workspace": "~/.malikclaw/workspace",
      "model_name": "gpt-5.4",
      "max_tokens": 4096,
      "temperature": 0.7,
      "max_tool_iterations": 10,
      "memory_limit_mb": 8
    }
  },
  "gateway": {
    "host": "127.0.0.1",
    "port": 18790
  },
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-api-key-here",
      "request_timeout": 120
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_key": "your-anthropic-key-here"
    },
    {
      "model_name": "gemini-2.5-flash",
      "model": "gemini/gemini-2.5-flash",
      "api_key": "your-gemini-key-here"
    }
  ],
  "tools": {
    "web": {
      "duckduckgo": {
        "enabled": true,
        "max_results": 3
      },
      "tavily": {
        "enabled": false,
        "api_key": "YOUR_TAVILY_API_KEY",
        "max_results": 3
      },
      "brave": {
        "enabled": false,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 3
      }
    },
    "shell": {
      "enabled": true,
      "sandbox": true
    },
    "file": {
      "enabled": true,
      "workspace_only": true
    }
  },
  "channels": {
    "telegram": {
      "enabled": false,
      "token": "YOUR_BOT_TOKEN",
      "allow_from": []
    },
    "discord": {
      "enabled": false,
      "token": "YOUR_BOT_TOKEN",
      "allow_from": []
    }
  },
  "performance": {
    "max_concurrent_tasks": 2,
    "gc_interval_seconds": 300,
    "low_memory_mode": true
  }
}
EOF
    
    log_success "Configuration generated: $CONFIG_FILE"
    log_info "Edit config to add your API keys before first use"
}

# --- Step 5: Post-Installation Setup ---
post_install() {
    log_step "Finalizing Installation"
    
    # Verify binary is executable
    if [[ -x "$INSTALL_BIN/${BINARY_NAME}" ]]; then
        log_success "Binary is executable"
    else
        log_error "Binary is not executable"
        return 1
    fi
    
    # Show version info
    local version_info
    if version_info=$("$INSTALL_BIN/${BINARY_NAME}" --version 2>&1); then
        log_info "Version: ${CYAN}$version_info${NC}"
    fi
    
    # Create wrapper script for Termux if needed
    if [[ "$ENV_TYPE" == "termux" ]] && command -v termux-chroot &>/dev/null; then
        local wrapper_script="$INSTALL_BIN/${BINARY_NAME}-chroot"
        cat > "$wrapper_script" << EOF
#!/usr/bin/env bash
# Wrapper to run ${BINARY_NAME} in termux-chroot environment
exec termux-chroot "$INSTALL_BIN/${BINARY_NAME}" "\$@"
EOF
        chmod +x "$wrapper_script"
        log_info "Created wrapper: ${CYAN}${BINARY_NAME}-chroot${NC}"
    fi
}

# --- Step 6: Display Usage Information ---
show_usage() {
    echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   🦅 MalikClaw Installation Complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    echo -e "${BOLD}Quick Start:${NC}"
    echo -e "  ${CYAN}1.${NC} Edit config: ${YELLOW}nano $CONFIG_FILE${NC}"
    echo -e "  ${CYAN}2.${NC} Add your API keys (LLM, Web Search)"
    echo -e "  ${CYAN}3.${NC} Initialize:  ${YELLOW}${BINARY_NAME} onboard${NC}"
    echo -e "  ${CYAN}4.${NC} Start chat:  ${YELLOW}${BINARY_NAME} agent -m \"Hello!\"${NC}\n"
    
    echo -e "${BOLD}Get API Keys:${NC}"
    echo -e "  • LLM: ${CYAN}https://openrouter.ai/keys${NC}"
    echo -e "  • LLM: ${CYAN}https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys${NC}"
    echo -e "  • Web Search (optional): ${CYAN}https://tavily.com${NC}\n"
    
    echo -e "${BOLD}Documentation:${NC}"
    echo -e "  • GitHub: ${CYAN}https://github.com/${REPO_OWNER}/${REPO_NAME}${NC}"
    echo -e "  • Roadmap: ${CYAN}https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/ROADMAP.md${NC}\n"
    
    if [[ "$ENV_TYPE" == "termux" ]]; then
        echo -e "${YELLOW}Termux Note:${NC} Use '${BINARY_NAME}-chroot' for full Linux compatibility\n"
    fi
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   آگے بڑھو، ملک کلاؤ! (Let's Go, MalikClaw!)${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# =============================================================================
# Main Installation Flow
# =============================================================================
main() {
    echo -e "\n${BOLD}${MAGENTA}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${MAGENTA}║   🦅 MalikClaw AI Agent Installer          ║${NC}"
    echo -e "${BOLD}${MAGENTA}║   Ultra-Lightweight • <$10 Hardware        ║${NC}"
    echo -e "${BOLD}${MAGENTA}╚════════════════════════════════════════════╝${NC}\n"
    
    detect_environment
    setup_termux
    fetch_binary
    generate_config
    post_install
    show_usage
    
    log_success "Installation completed successfully!"
}

# Run main function
main "$@"
