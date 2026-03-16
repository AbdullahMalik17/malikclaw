# MalikClaw Frontend Setup & Run Script
# This script automates pnpm installation, frontend builds, and starts the launcher.

Write-Host "Checking prerequisites..." -ForegroundColor Cyan

# Ensure we are running from the project root if script is in /scripts
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Split-Path -Parent $ScriptPath
Set-Location $ProjectRoot

# 1. Check for Node.js/pnpm
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm not found. Attempting to install pnpm via npm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# 2. Setup Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Cyan
if (Test-Path "web/frontend") {
    cd web/frontend
    pnpm install
    pnpm build:backend
    cd ../..
} else {
    Write-Host "Error: web/frontend directory not found at $(Get-Location)!" -ForegroundColor Red
    exit 1
}

# 3. Build & Run Launcher
Write-Host "Building and Running Launcher..." -ForegroundColor Cyan
if (Test-Path "web/backend/main.go") {
    go run ./web/backend/main.go
} else {
    Write-Host "Error: web/backend/main.go not found!" -ForegroundColor Red
    exit 1
}
