# =============================================================================
# MalikClaw AI Agent - Windows Installer (PowerShell)
# =============================================================================
# Target: Windows 10/11 (WSL2 or Native)
# Features: One-command install, automatic path setup
# =============================================================================

param(
    [switch]$Verbose,
    [switch]$Help
)

# Help
if ($Help) {
    Write-Host @"
MalikClaw Windows Installer

Usage:
  .\install.ps1 [-Verbose] [-Help]

Options:
  -Verbose    Show detailed output
  -Help       Show this help message

Examples:
  .\install.ps1
  .\install.ps1 -Verbose
"@
    exit 0
}

# Configuration
$REPO_OWNER = "AbdullahMalik17"
$REPO_NAME = "malikclaw"
$BINARY_NAME = "malikclaw"
$CONFIG_DIR = "$env:USERPROFILE\.malikclaw"
$CONFIG_FILE = "$CONFIG_DIR\config.json"

# Colors
function Write-Info    { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Blue }
function Write-Success { param($msg) Write-Host "[✓] $msg" -ForegroundColor Green -BackgroundColor Black }
function Write-Warn    { param($msg) Write-Host "[!] $msg" -ForegroundColor Yellow }
function Write-Error   { param($msg) Write-Host "[✗] $msg" -ForegroundColor Red -BackgroundColor Black }
function Write-Step    { param($msg) Write-Host "`n━━━ $msg ━━━`n" -ForegroundColor Magenta }

# Error handler
$ErrorActionPreference = "Stop"
trap {
    Write-Error "Installation failed: $_"
    exit 1
}

# Check for WSL2
function Test-WSL2 {
    try {
        $wslVersion = wsl --version 2>&1
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

# Step 1: Detect Environment
Write-Step "Detecting Environment"

$useWSL = Test-WSL2
$arch = (Get-CimInstance Win32_Processor).AddressWidth
$installPath = ""

if ($useWSL) {
    Write-Info "Detected: WSL2 (Recommended)"
    $installPath = "$env:USERPROFILE\.local\bin"
} else {
    Write-Info "Detected: Native Windows"
    $installPath = "$env:USERPROFILE\.local\bin"
}

Write-Info "Architecture: $arch-bit"
Write-Info "Install Path: $installPath"

# Step 2: Create Install Directory
Write-Step "Creating Install Directory"

if (!(Test-Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath -Force | Out-Null
    Write-Success "Created: $installPath"
} else {
    Write-Info "Directory exists: $installPath"
}

# Add to PATH if not already
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installPath*") {
    Write-Info "Adding to PATH..."
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$currentPath;$installPath",
        "User"
    )
    Write-Success "Added to PATH (restart terminal to apply)"
}

# Step 3: Download Binary
Write-Step "Downloading Binary"

$mapArch = @{
    "64" = "amd64"
    "32" = "arm"  # Fallback
}
$goArch = $mapArch[$arch.ToString()]

$downloadUrl = "https://github.com/$REPO_OWNER/$REPO_NAME/releases/latest/download/$BINARY_NAME-windows-$goArch.exe"
$outputFile = "$installPath\$BINARY_NAME.exe"

Write-Info "Downloading from: $downloadUrl"

try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $outputFile -UseBasicParsing
    Write-Success "Downloaded: $outputFile"
} catch {
    Write-Error "Download failed: $_"
    Write-Info "Manual download: https://github.com/$REPO_OWNER/$REPO_NAME/releases"
    exit 1
}

# Step 4: Create Config Directory
Write-Step "Creating Configuration"

if (!(Test-Path $CONFIG_DIR)) {
    New-Item -ItemType Directory -Path $CONFIG_DIR -Force | Out-Null
    Write-Success "Created: $CONFIG_DIR"
}

# Generate default config if not exists
if (!(Test-Path $CONFIG_FILE)) {
    $config = @{
        agents = @{
            defaults = @{
                workspace = "$CONFIG_DIR\workspace"
                model_name = "gpt-4o-mini"
                max_tokens = 4096
                temperature = 0.7
                max_tool_iterations = 10
            }
        }
        gateway = @{
            host = "127.0.0.1"
            port = 18790
        }
        model_list = @(
            @{
                model_name = "gpt-4o-mini"
                model = "openai/gpt-4o-mini"
                api_key = "your-api-key-here"
                request_timeout = 120
            }
        )
        tools = @{
            web = @{
                duckduckgo = @{ enabled = $true; max_results = 3 }
                tavily = @{ enabled = $false }
            }
            shell = @{ enabled = $true; sandbox = $true }
            file = @{ enabled = $true; workspace_only = $true }
        }
        performance = @{
            max_concurrent_tasks = 2
            gc_interval_seconds = 300
            low_memory_mode = $true
        }
    }

    $config | ConvertTo-Json -Depth 10 | Out-File -FilePath $CONFIG_FILE -Encoding utf8
    Write-Success "Generated config: $CONFIG_FILE"
} else {
    Write-Info "Config exists: $CONFIG_FILE"
}

# Step 5: WSL2 Installation (if available)
if ($useWSL) {
    Write-Step "Installing in WSL2"

    Write-Info "Downloading Linux binary for WSL2..."
    $wslDownloadUrl = "https://github.com/$REPO_OWNER/$REPO_NAME/releases/latest/download/$BINARY_NAME-linux-$goArch"
    $wslOutput = "$CONFIG_DIR\$BINARY_NAME"

    try {
        Invoke-WebRequest -Uri $wslDownloadUrl -OutFile $wslOutput -UseBasicParsing
        chmod +x $wslOutput 2>$null
        Write-Success "WSL2 binary installed: $wslOutput"
    } catch {
        Write-Warn "WSL2 binary download failed, using Windows binary"
    }
}

# Step 6: Verify Installation
Write-Step "Verifying Installation"

try {
    & $outputFile --version 2>&1 | Out-Null
    Write-Success "Binary is executable"
} catch {
    Write-Error "Binary verification failed"
    exit 1
}

# Step 7: Show Usage
Write-Step "Installation Complete!"

Write-Host @"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🦅 MalikClaw Installation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick Start:

  1. Restart your terminal (to apply PATH)
  2. Edit config: notepad $CONFIG_FILE
  3. Add your API keys (OpenRouter, etc.)
  4. Test: malikclaw agent -m "Hello!"

Get API Keys:
  • LLM: https://openrouter.ai/keys
  • Web Search (optional): https://tavily.com

Documentation:
  • GitHub: https://github.com/$REPO_OWNER/$REPO_NAME
  • Quick Start: https://github.com/$REPO_OWNER/$REPO_NAME/blob/main/PRODUCT.md

"@

if ($useWSL) {
    Write-Host @"
WSL2 Note:
  You can run MalikClaw in WSL2 for better Linux compatibility:
  wsl malikclaw agent -m "Hello!"

"@
}

Write-Success "Installation completed successfully!"
