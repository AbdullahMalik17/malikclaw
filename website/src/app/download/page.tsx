"use client";

import Link from "next/link";
import { ArrowRight, Github, Download, Terminal, Cpu, Globe, Smartphone, Check, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const platforms = [
  {
    id: "windows",
    name: "Windows",
    icon: Globe,
    description: "Windows 10/11 (64-bit)",
    color: "#0df2c9",
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
      { manager: "Winget", command: "winget install malikclaw" },
      { manager: "Chocolatey", command: "choco install malikclaw" },
    ],
    instructions: [
      "Download the ZIP file for your architecture",
      "Extract the contents to a folder (e.g., C:\\Program Files\\MalikClaw)",
      "Add the folder to your system PATH",
      "Open PowerShell or Command Prompt and run: malikclaw onboard",
    ],
  },
  {
    id: "macos",
    name: "macOS",
    icon: Terminal,
    description: "Intel & Apple Silicon (M1/M2/M3)",
    color: "#8e2de2",
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
      { manager: "Homebrew", command: "brew install malikclaw" },
      { manager: "Manual", command: "curl -sSfL https://malikclaw.io/install.sh | sh" },
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
    color: "#0df2c9",
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
      { manager: "Auto Install", command: "curl -sSfL https://malikclaw.io/install.sh | sh" },
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
    color: "#8e2de2",
    downloads: [
      {
        name: "Linux ARM64 (for Termux)",
        url: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz",
        size: "~13 MB",
        arch: "ARM64",
      },
    ],
    installCommands: [],
    instructions: [
      "Install Termux from F-Droid or Google Play Store",
      "Open Termux and run: pkg update && pkg upgrade",
      "Install proot: pkg install proot",
      "Download: wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64",
      "Make executable: chmod +x malikclaw_Linux_arm64",
      "Run with proot: termux-chroot ./malikclaw_Linux_arm64 onboard",
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-[#0df2c9]/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-[#0df2c9] transition-colors">
            MalikClaw
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
            <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</Link>
            <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight">
              Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-gryphon-gold via-[#fbbf24] to-[#d97706]">MalikClaw</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Current Version: <span className="text-[#0df2c9] font-mono">v0.2.3</span>
            </p>
            <p className="text-lg text-zinc-500 max-w-3xl mx-auto mt-2">
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
              <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-white/20 transition-all duration-500 group relative overflow-hidden shadow-2xl">
                {/* Ambient Glow */}
                <div 
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" 
                  style={{ backgroundColor: platform.color }}
                ></div>

                <div className="flex items-start gap-6 mb-8 relative z-10">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                    style={{ backgroundColor: `${platform.color}15`, borderColor: `${platform.color}30` }}
                  >
                    <platform.icon className="w-8 h-8" style={{ color: platform.color }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{platform.name}</h2>
                    <p className="text-zinc-400 text-lg">{platform.description}</p>
                  </div>
                </div>

                {/* Download Links */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Download Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platform.downloads.map((download) => (
                      <a
                        key={download.name}
                        href={download.url}
                        className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group"
                      >
                        <div>
                          <div className="font-medium text-white group-hover:text-[#0df2c9] transition-colors">
                            {download.name}
                          </div>
                          <div className="text-sm text-zinc-500 mt-1">{download.arch}</div>
                        </div>
                        <div className="text-right">
                          <Download className="w-5 h-5 text-zinc-400 group-hover:text-[#0df2c9] transition-colors mx-auto" />
                          <div className="text-xs text-zinc-500 mt-1">{download.size}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Package Managers */}
                {platform.installCommands.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Install with Package Manager</h3>
                    <div className="space-y-3">
                      {platform.installCommands.map((pkg) => (
                        <div key={pkg.manager} className="flex items-center gap-4 p-4 rounded-lg bg-[#0a0a0c] border border-white/5">
                          <Check className="w-5 h-5 text-[#0df2c9] flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-zinc-400">{pkg.manager}:</span>
                            <code className="ml-2 px-3 py-1 rounded bg-black/50 text-sm text-[#0df2c9] font-mono">
                              {pkg.command}
                            </code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Installation Instructions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Manual Installation Steps</h3>
                  <ol className="space-y-3">
                    {platform.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0df2c9]/10 text-[#0df2c9] text-sm font-medium flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-zinc-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Warnings */}
                {platform.warnings && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-500 mb-2">Important Notes</h4>
                        <ul className="space-y-1">
                          {platform.warnings.map((warning, i) => (
                            <li key={i} className="text-sm text-yellow-200/80">• {warning}</li>
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
          className="mt-12 p-8 md:p-10 rounded-[2rem] bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden group"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0df2c9]/30 to-transparent"></div>
          <h2 className="text-2xl font-bold text-white mb-4">Build from Source</h2>
          <p className="text-zinc-400 mb-6">
            Want the latest features or need a custom build? Compile MalikClaw from source.
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5">
              <code className="text-sm text-zinc-300 font-mono">
                git clone https://github.com/AbdullahMalik17/malikclaw.git<br />
                cd malikclaw<br />
                make deps<br />
                make build<br />
                sudo make install
              </code>
            </div>
            <Link 
              href="/docs/installation/source"
              className="inline-flex items-center gap-2 text-[#0df2c9] hover:text-white transition-colors font-medium"
            >
              View detailed build instructions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Docker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-8 md:p-10 rounded-[2rem] bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden group"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8e2de2]/30 to-transparent"></div>
          <h2 className="text-2xl font-bold text-white mb-4">Docker Deployment</h2>
          <p className="text-zinc-400 mb-6">
            Run MalikClaw in a container with Docker Compose.
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5">
              <code className="text-sm text-zinc-300 font-mono">
                docker compose -f docker/docker-compose.yml --profile gateway up -d
              </code>
            </div>
            <Link 
              href="/docs/deployment/docker"
              className="inline-flex items-center gap-2 text-[#0df2c9] hover:text-white transition-colors font-medium"
            >
              View Docker documentation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-400 mb-4">Need help getting started?</p>
          <Link 
            href="/docs/quickstart"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#0df2c9] text-black font-semibold hover:bg-[#0bc2a1] transition-colors"
          >
            Read Quick Start Guide <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-zinc-500">
        <p>Built with Next.js, Go and ❤️ by the MalikClaw Community.</p>
        <p className="mt-2 text-xs">© 2026 Muhammad Abdullah Athar</p>
      </footer>
    </div>
  );
}
