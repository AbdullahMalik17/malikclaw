#!/usr/bin/env bash
# =============================================================================
# MalikClaw Demo Script
# =============================================================================
# Demonstrates three core capabilities:
# 1. Phone Control (ADB)
# 2. Email Sending (Gmail)
# 3. Information Fetching (Web Search)
# =============================================================================

set -euo pipefail

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m'

# Logging
log_step() { echo -e "\n${MAGENTA}━━━ $1 ${MAGENTA}━━━${NC}"; }
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} ${BOLD}$1${NC}"; }
log_warn() { echo -e "${YELLOW}[!]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} ${BOLD}$1${NC}"; }

# Configuration
MALIKCLAW_CMD="${MALIKCLAW_CMD:-malikclaw}"
CONFIG_DIR="$HOME/.malikclaw"
CONFIG_FILE="$CONFIG_DIR/config.json"

# Check prerequisites
check_prerequisites() {
    log_step "Checking Prerequisites"

    # Check malikclaw binary
    if ! command -v "$MALIKCLAW_CMD" &>/dev/null; then
        log_error "MalikClaw not found. Install first:"
        echo "  curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash"
        exit 1
    fi
    log_success "MalikClaw installed: $(which $MALIKCLAW_CMD)"

    # Check config
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log_error "Configuration not found. Run setup first:"
        echo "  $MALIKCLAW_CMD onboard"
        exit 1
    fi
    log_success "Configuration found: $CONFIG_FILE"

    # Show version
    log_info "Version: $($MALIKCLAW_CMD --version)"
}

# Demo 1: Phone Control via ADB
demo_phone_control() {
    log_step "Demo 1: Phone Control (ADB)"

    cat << 'EOF'
This demo shows how MalikClaw can control your Android phone via ADB.

Commands available:
  - screenshot: Take a screenshot
  - tap: Tap at coordinates
  - swipe: Swipe gesture
  - type: Type text
  - list_apps: List installed apps

EOF

    echo -e "${CYAN}Example commands:${NC}"
    echo ""
    echo "  # Take a screenshot"
    echo "  $MALIKCLAW_CMD agent -m \"Take a screenshot of my phone\""
    echo ""
    echo "  # Tap at coordinates (x=500, y=1000)"
    echo "  $MALIKCLAW_CMD agent -m \"Tap at position 500, 1000 on my phone\""
    echo ""
    echo "  # Type text"
    echo "  $MALIKCLAW_CMD agent -m \"Type 'Hello World' on my phone\""
    echo ""
    echo "  # Open an app"
    echo "  $MALIKCLAW_CMD agent -m \"Open WhatsApp on my phone\""
    echo ""

    # Check if ADB is available
    if command -v adb &>/dev/null; then
        log_success "ADB is available"
        echo -e "${YELLOW}To test manually:${NC}"
        echo "  adb devices  # List connected devices"
        echo "  adb shell screencap -p /sdcard/screenshot.png  # Take screenshot"
    else
        log_warn "ADB not installed. Install with:"
        echo "  sudo apt install android-tools-adb  # Debian/Ubuntu"
        echo "  sudo dnf install android-tools      # Fedora"
    fi
}

# Demo 2: Email Sending via Gmail
demo_email_sending() {
    log_step "Demo 2: Email Sending (Gmail)"

    cat << 'EOF'
This demo shows how MalikClaw can send emails via Gmail.

Prerequisites:
  - Gmail API enabled in config
  - OAuth2 credentials configured

EOF

    echo -e "${CYAN}Example commands:${NC}"
    echo ""
    echo "  # Send an email"
    echo "  $MALIKCLAW_CMD agent -m \"Send an email to john@example.com with subject 'Meeting' and body 'Let's meet at 3pm'\""
    echo ""
    echo "  # Check recent emails"
    echo "  $MALIKCLAW_CMD agent -m \"Show my recent emails\""
    echo ""
    echo "  # Search emails"
    echo "  $MALIKCLAW_CMD agent -m \"Find emails from last week about 'project'\""
    echo ""

    # Check Gmail config
    if grep -q "gmail" "$CONFIG_FILE" 2>/dev/null; then
        log_success "Gmail integration found in config"
    else
        log_warn "Gmail not configured. Add to config.json:"
        cat << 'EOFCONFIG'
  "tools": {
    "gmail": {
      "enabled": true,
      "credentials_file": "~/.malikclaw/gmail_credentials.json"
    }
  }
EOFCONFIG
    fi
}

# Demo 3: Information Fetching
demo_info_fetching() {
    log_step "Demo 3: Information Fetching (Web Search)"

    cat << 'EOF'
This demo shows how MalikClaw can fetch information from the web.

Supported search engines:
  - DuckDuckGo (free, no API key)
  - Tavily (AI-optimized)
  - Brave Search
  - Perplexity
  - SearXNG (self-hosted)

EOF

    echo -e "${CYAN}Example commands:${NC}"
    echo ""
    echo "  # Search for news"
    echo "  $MALIKCLAW_CMD agent -m \"What are the latest AI news today?\""
    echo ""
    echo "  # Fetch weather"
    echo "  $MALIKCLAW_CMD agent -m \"What's the weather in Lahore today?\""
    echo ""
    echo "  # Research topic"
    echo "  $MALIKCLAW_CMD agent -m \"Research quantum computing breakthroughs in 2025\""
    echo ""
    echo "  # Get documentation"
    echo "  $MALIKCLAW_CMD agent -m \"Fetch the Go 1.25 release notes\""
    echo ""

    # Test web search (if DuckDuckGo enabled)
    log_info "Testing web search..."
    if $MALIKCLAW_CMD agent -m "What is the capital of Pakistan?" --timeout 30s 2>/dev/null; then
        log_success "Web search working!"
    else
        log_warn "Web search test failed. Check your internet connection."
    fi
}

# Interactive Demo
run_interactive_demo() {
    log_step "Interactive Demo"

    cat << 'EOF'
Try these commands interactively:

1. Phone Control:
   - "Take a screenshot of my phone"
   - "Open YouTube on my phone"
   - "Type 'Hello' on my phone"

2. Email:
   - "Send an email to test@example.com"
   - "Show my unread emails"

3. Web Search:
   - "What's trending on Hacker News?"
   - "Find Go programming tutorials"
   - "Search for MalikClaw documentation"

4. File Operations:
   - "List files in current directory"
   - "Create a file called test.txt"
   - "Search for TODO comments in my code"

EOF

    echo -e "${CYAN}Start interactive session:${NC}"
    echo "  $MALIKCLAW_CMD agent"
    echo ""
    echo -e "${YELLOW}Or run a single command:${NC}"
    echo "  $MALIKCLAW_CMD agent -m \"Your command here\""
}

# Show configuration status
show_config_status() {
    log_step "Configuration Status"

    if [[ -f "$CONFIG_FILE" ]]; then
        log_success "Config file exists"

        # Check for API keys (without exposing them)
        if grep -q "api_key.*your-" "$CONFIG_FILE" 2>/dev/null; then
            log_warn "Default API keys found. Update with your keys!"
        else
            log_success "API keys configured"
        fi

        # Check tools enabled
        log_info "Enabled tools:"
        grep -E '"enabled":\s*true' "$CONFIG_FILE" 2>/dev/null | head -5 || log_warn "No tools enabled"
    else
        log_error "No configuration found"
    fi
}

# Main
main() {
    echo -e "\n${BOLD}${MAGENTA}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${MAGENTA}║   🦅 MalikClaw Demo Script                 ║${NC}"
    echo -e "${BOLD}${MAGENTA}║   Phone • Email • Web Search               ║${NC}"
    echo -e "${BOLD}${MAGENTA}╚════════════════════════════════════════════╝${NC}\n"

    check_prerequisites
    show_config_status
    demo_phone_control
    demo_email_sending
    demo_info_fetching
    run_interactive_demo

    echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   Demo Complete! 🦅${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

    log_info "Next steps:"
    echo "  1. Update config with your API keys"
    echo "  2. Connect your Android device (for ADB)"
    echo "  3. Run: $MALIKCLAW_CMD agent -m \"Hello!\""
    echo ""
}

main "$@"
