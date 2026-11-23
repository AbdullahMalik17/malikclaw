"use client";

import Link from "next/link";
import { ArrowRight, Github, Download, Terminal, Cpu, Globe, Smartphone, Check, AlertTriangle, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { MALIKCLAW_VERSION } from "@/lib/version";

type Platform = {
  id: string;
  name: string;
  icon: typeof Globe;
  description: string;
  glowClass: string;
  chipClass: string;
  iconClass: string;
  hoverClass: string;
};

const platforms: (Platform & {
  downloads: { name: string; url: string; size: string; arch: string }[];
  installCommands: { manager: string; command: string }[];
  instructions: string[];
  warnings?: string[];
})[] = [
  {
    id: "windows",
    name: "Windows",
    icon: Globe,
    description: "Windows 10/11 (64-bit)",
    glowClass: "bg-amber-500",
    chipClass: "bg-amber-500/15 border-amber-500/30",
    iconClass: "text-amber-600 dark:text-amber-400",
    hoverClass: "hover:border-amber-500/40",
    downloads: [
      {
        name: "Windows x86_64 (ZIP)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip",
        size: "~15 MB",
        arch: "x86_64",
      },
      {
        name: "Windows ARM64 (ZIP)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_arm64.zip",
        size: "~14 MB",
        arch: "ARM64",
      },
    ],
    installCommands: [
      { manager: "PowerShell (irm)", command: "irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex" },
      { manager: "npm (Node.js)", command: "npm install -g malikclaw" },
      { manager: "Winget", command: "winget install malikclaw" },
      { manager: "Chocolatey", command: "choco install malikclaw" },
    ],
    instructions: [
      "Run the PowerShell one-liner above, or download the ZIP file for your architecture",
      "If installing manually, extract the contents to C:\\Program Files\\MalikClaw",
      "Add the folder to your system PATH",
      "Open PowerShell or Command Prompt and run: malikclaw onboard",
    ],
  },
  {
    id: "macos",
    name: "macOS",
    icon: Terminal,
    description: "Intel & Apple Silicon (M1/M2/M3)",
    glowClass: "bg-sky-500",
    chipClass: "bg-sky-500/15 border-sky-500/30",
    iconClass: "text-sky-600 dark:text-sky-400",
    hoverClass: "hover:border-sky-500/40",
    downloads: [
      {
        name: "macOS x86_64 (TAR.GZ)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Darwin_x86_64.tar.gz",
        size: "~14 MB",
        arch: "x86_64",
      },
      {
        name: "macOS ARM64 (TAR.GZ)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Darwin_arm64.tar.gz",
        size: "~13 MB",
        arch: "ARM64 (M1/M2/M3)",
      },
    ],
    installCommands: [
      { manager: "npm (Node.js)", command: "npm install -g malikclaw" },
      { manager: "Homebrew", command: "brew install malikclaw" },
      { manager: "cURL", command: "curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash" },
    ],
    instructions: [
      "Download the TAR.GZ file for your architecture",
      "Extract: tar -xzf malikclaw_*.tar.gz",
      "Move to /usr/local/bin: sudo mv malikclaw /usr/local/bin/",
      "Run: malikclaw onboard",
    ],
  },
  {
    id: "linux",
    name: "Linux",
    icon: Cpu,
    description: "x86_64, ARM64, ARMv6/7, RISC-V",
    glowClass: "bg-emerald-500",
    chipClass: "bg-emerald-500/15 border-emerald-500/30",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    hoverClass: "hover:border-emerald-500/40",
    downloads: [
      {
        name: "Linux x86_64 (TAR.GZ)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz",
        size: "~14 MB",
        arch: "x86_64",
      },
      {
        name: "Linux ARM64 (TAR.GZ)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz",
        size: "~13 MB",
        arch: "ARM64",
      },
      {
        name: "Linux ARMv6 (TAR.GZ)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv6.tar.gz",
        size: "~12 MB",
        arch: "ARMv6 (Pi Zero)",
      },
      {
        name: "Linux ARMv7 (TAR.GZ)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv7.tar.gz",
        size: "~12 MB",
        arch: "ARMv7",
      },
      {
        name: "Linux RISC-V 64 (TAR.GZ)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_riscv64.tar.gz",
        size: "~13 MB",
        arch: "RISC-V",
      },
    ],
    installCommands: [
      { manager: "Auto Install", command: "curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash" },
      { manager: "npm (Node.js)", command: "npm install -g malikclaw" },
      { manager: "DEB (Debian/Ubuntu)", command: "wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_amd64.deb && sudo dpkg -i malikclaw_amd64.deb" },
      { manager: "RPM (Fedora/RHEL)", command: "wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_x86_64.rpm && sudo dnf install malikclaw_x86_64.rpm" },
    ],
    instructions: [
      "Method 1: Run the auto-installer script",
      "Method 2: Download the appropriate package for your distribution",
      "For DEB: sudo dpkg -i malikclaw_*.deb",
      "For RPM: sudo dnf install malikclaw_*.rpm",
      "Run: malikclaw onboard",
    ],
  },
  {
    id: "android",
    name: "Android",
    icon: Smartphone,
    description: "Termux (ARM64/ARMv8)",
    glowClass: "bg-zinc-400",
    chipClass: "bg-zinc-400/15 border-zinc-400/30",
    iconClass: "text-zinc-600 dark:text-zinc-300",
    hoverClass: "hover:border-zinc-400/40",
    downloads: [
      {
        name: "Linux ARM64 (for Termux)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz",
        size: "~13 MB",
        arch: "ARM64",
      },
    ],
    installCommands: [
      { manager: "npm (Termux Node.js)", command: "pkg install nodejs-lts && npm install -g malikclaw" },
    ],
    instructions: [
      "Install Termux from F-Droid or Google Play Store",
      "Open Termux and run: pkg update && pkg upgrade",
      "Install proot: pkg install proot",
      "Download: wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz",
      "Extract and make executable: tar -xzf malikclaw_Linux_arm64.tar.gz && chmod +x malikclaw",
      "Run with proot: termux-chroot ./malikclaw onboard",
    ],
    warnings: [
      "Requires Android 7.0 or higher",
      "ARM64 device recommended for best performance",
      "Termux-chroot requires root access or Shizuku",
    ],
  },
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-amber-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-card-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter text-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
            MalikClaw
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-text-muted hover:text-foreground transition-colors">Home</Link>
            <Link href="/docs" className="text-text-muted hover:text-foreground transition-colors">Docs</Link>
            <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors">
              <Github className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight text-foreground">
              Download <span className="text-gold-gradient">MalikClaw</span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Current Version: <span className="text-amber-700 dark:text-amber-400 font-mono tabular-nums">{MALIKCLAW_VERSION}</span>
            </p>
            <p className="text-lg text-text-muted max-w-3xl mx-auto mt-2">
              Choose your platform and get started with the ultra-lightweight AI assistant in minutes.
            </p>
          </motion.div>
        </div>

        {/* Platform Cards */}
        <div className="space-y-12">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              id={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="scroll-mt-24"
            >
              <div className="glass-card-interactive p-8 md:p-10 rounded-2xl group relative overflow-hidden shadow-xl">
                {/* Ambient Glow */}
                <div
                  className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${platform.glowClass}`}
                ></div>

                <div className="flex items-start gap-6 mb-8 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border ${platform.chipClass}`}
                  >
                    <platform.icon className={`w-8 h-8 ${platform.iconClass}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{platform.name}</h2>
                    <p className="text-text-muted text-lg">{platform.description}</p>
                  </div>
                </div>

                {/* Download Links */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Download Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platform.downloads.map((download) => (
                      <a
                        key={download.name}
                        href={download.url}
                        className="flex items-center justify-between p-4 rounded-xl bg-surface-2 border border-card-border hover:border-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 transition-colors group"
                      >
                        <div>
                          <div className="font-medium text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {download.name}
                          </div>
                          <div className="text-sm text-text-muted mt-1">{download.arch}</div>
                        </div>
                        <div className="text-end">
                          <Download className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mx-auto" aria-hidden="true" />
                          <div className="text-xs text-text-muted mt-1 tabular-nums">{download.size}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Package Managers */}
                {platform.installCommands.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Install with Package Manager</h3>
                    <div className="space-y-3">
                      {platform.installCommands.map((pkg) => (
                        <div key={pkg.manager} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 text-zinc-100">
                          <div className="flex items-center gap-2 shrink-0">
                            <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                            <span className="text-sm font-medium text-zinc-300">{pkg.manager}:</span>
                          </div>
                          <code className="px-3 py-1 rounded bg-black/60 text-xs sm:text-sm text-amber-300 font-mono overflow-x-auto select-all">
                            {pkg.command}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Installation Instructions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Manual Installation Steps</h3>
                  <ol className="space-y-3">
                    {platform.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-sm font-semibold flex-shrink-0 tabular-nums">
                          {i + 1}
                        </span>
                        <span className="text-text-muted">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Warnings */}
                {platform.warnings && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-600/25">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-2">Important Notes</h4>
                        <ul className="space-y-1">
                          {platform.warnings.map((warning, i) => (
                            <li key={i} className="text-sm text-amber-900 dark:text-amber-200/85">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Build from Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 glass-card-interactive p-8 md:p-10 rounded-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Build from Source</h2>
          <p className="text-text-muted mb-6">
            Want the latest features or need a custom build? Compile MalikClaw from source (Go 1.25+).
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 overflow-x-auto">
              <code className="text-sm text-zinc-100 font-mono">
                git clone https://github.com/AbdullahMalik17/malikclaw.git<br />
                cd malikclaw<br />
                make deps<br />
                make build<br />
                sudo make install
              </code>
            </div>
            <Link
              href="/docs/installation/source"
              className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 hover:text-foreground transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 rounded"
            >
              View detailed build instructions <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* Docker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 glass-card-interactive p-8 md:p-10 rounded-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Docker Deployment</h2>
          <p className="text-text-muted mb-6">
            Run MalikClaw in a container with the official GHCR image or Docker Compose.
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 overflow-x-auto">
              <code className="text-sm text-zinc-100 font-mono">
                docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/home/malikclaw/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest
              </code>
            </div>
            <Link
              href="/docs/deployment/docker"
              className="inline-flex items-center gap-2 text-sky-700 dark:text-sky-400 hover:text-foreground transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 rounded"
            >
              View Docker documentation <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-text-muted mb-4">Need help getting started?</p>
          <Link
            href="/docs/quick-start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
          >
            Read Quick Start Guide <ArrowRight className="w-5 h-5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border py-12 text-center text-sm text-text-muted">
        <p className="inline-flex items-center justify-center gap-1.5">
          Built with Next.js, Go 1.25+ and <Heart className="w-4 h-4 text-amber-500 dark:text-amber-400" aria-hidden="true" fill="currentColor" /> by the MalikClaw Community.
        </p>
        <p className="mt-2 text-xs">© 2026 Muhammad Abdullah Athar</p>
      </footer>
    </div>
  );
}
