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
$rawArch = $null
try {
    $rawArch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
} catch {
    $rawArch = $env:PROCESSOR_ARCHITECTURE
}
if ([string]::IsNullOrWhiteSpace($rawArch)) {
    $rawArch = $env:PROCESSOR_ARCHITECTURE
}

switch ($rawArch.ToUpperInvariant()) {
    "X64"   { $archiveArch = "x86_64" }
    "AMD64" { $archiveArch = "x86_64" }
    "ARM64" { $archiveArch = "arm64" }
    default {
        Write-Error "Unsupported architecture: $rawArch (supported: x86_64/AMD64, arm64)"
        exit 1
    }
}

$installPath = ""

if ($useWSL) {
    Write-Info "Detected: WSL2 (Recommended)"
    $installPath = "$env:USERPROFILE\.local\bin"
} else {
    Write-Info "Detected: Native Windows"
    $installPath = "$env:USERPROFILE\.local\bin"
}

Write-Info "Architecture: $archiveArch ($rawArch)"
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

$downloadUrl = "https://github.com/$REPO_OWNER/$REPO_NAME/releases/latest/download/${BINARY_NAME}_Windows_${archiveArch}.zip"
$outputFile = "$installPath\$BINARY_NAME.exe"
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) "malikclaw-install-$PID"
$zipFile = Join-Path $tempDir "$BINARY_NAME.zip"

Write-Info "Downloading from: $downloadUrl"

try {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
    Expand-Archive -Path $zipFile -DestinationPath $tempDir -Force
    $extractedExe = Join-Path $tempDir "$BINARY_NAME.exe"
    if (!(Test-Path $extractedExe)) {
        throw "Expected binary '$BINARY_NAME.exe' was not found in archive"
    }
    Copy-Item -Path $extractedExe -Destination $outputFile -Force
    Write-Success "Installed: $outputFile"
} catch {
    Write-Error "Download/extraction failed: $_"
    Write-Info "Manual download: https://github.com/$REPO_OWNER/$REPO_NAME/releases"
    exit 1
} finally {
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
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

    Write-Info "Downloading Linux archive for WSL2..."
    $wslDownloadUrl = "https://github.com/$REPO_OWNER/$REPO_NAME/releases/latest/download/${BINARY_NAME}_Linux_${archiveArch}.tar.gz"
    $wslOutput = "$CONFIG_DIR\$BINARY_NAME"
    $wslTempDir = Join-Path ([System.IO.Path]::GetTempPath()) "malikclaw-wsl-install-$PID"
    $wslArchive = Join-Path $wslTempDir "$BINARY_NAME.tar.gz"

    try {
        New-Item -ItemType Directory -Path $wslTempDir -Force | Out-Null
        Invoke-WebRequest -Uri $wslDownloadUrl -OutFile $wslArchive -UseBasicParsing
        if (Get-Command tar.exe -ErrorAction SilentlyContinue) {
            & tar.exe -xzf $wslArchive -C $wslTempDir $BINARY_NAME
            if ($LASTEXITCODE -ne 0) { throw "tar.exe exited with code $LASTEXITCODE" }
        } else {
            $wslArchiveUnix = (& wsl wslpath -u $wslArchive).Trim()
            $wslTempUnix = (& wsl wslpath -u $wslTempDir).Trim()
            & wsl tar -xzf $wslArchiveUnix -C $wslTempUnix $BINARY_NAME
            if ($LASTEXITCODE -ne 0) { throw "wsl tar exited with code $LASTEXITCODE" }
        }
        $wslExtracted = Join-Path $wslTempDir $BINARY_NAME
        if (!(Test-Path $wslExtracted)) {
            throw "Expected binary '$BINARY_NAME' was not found in archive"
        }
        Copy-Item -Path $wslExtracted -Destination $wslOutput -Force
        $wslOutputUnix = (& wsl wslpath -u $wslOutput).Trim()
        & wsl chmod +x $wslOutputUnix
        if ($LASTEXITCODE -ne 0) { throw "wsl chmod exited with code $LASTEXITCODE" }
        & wsl sh -c "mkdir -p ~/.local/bin && ln -sf '$wslOutputUnix' ~/.local/bin/$BINARY_NAME"
        Write-Success "WSL2 binary installed: $wslOutput"
    } catch {
        Write-Warn "WSL2 binary download failed ($_); using Windows binary"
    } finally {
        if (Test-Path $wslTempDir) {
            Remove-Item -Path $wslTempDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# Step 6: Verify Installation
Write-Step "Verifying Installation"

try {
    $null = & $outputFile --version
    if ($LASTEXITCODE -ne 0) {
        throw "Binary exited with code $LASTEXITCODE"
    }
    Write-Success "Binary is executable"
} catch {
    Write-Error "Binary verification failed: $_"
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
