"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, Cpu } from "lucide-react";

export default function LinuxInstallation() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-[#0B0C10] prose-pre:border prose-pre:border-zinc-800 prose-a:text-teal-700 dark:prose-a:text-[#0df2c9] prose-headings:text-foreground prose-code:text-teal-800 dark:prose-code:text-[#0df2c9] prose-code:bg-teal-500/10 dark:prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Linux Installation</h1>
      <p className="text-xl text-text-muted mb-8">
        Install MalikClaw on Linux distributions and embedded devices.
      </p>

      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-600/25 mb-8 not-prose">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-teal-700 dark:text-[#0df2c9] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-teal-800 dark:text-[#0df2c9] mb-1">Supported Architectures</h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• <strong>x86_64</strong> - Desktop/server CPUs (Intel/AMD)</li>
              <li>• <strong>ARM64</strong> - Raspberry Pi 4, Orange Pi, servers</li>
              <li>• <strong>ARMv6</strong> - Raspberry Pi Zero, Pi 1</li>
              <li>• <strong>ARMv7</strong> - Raspberry Pi 2/3, older boards</li>
              <li>• <strong>RISC-V 64</strong> - Emerging RISC-V boards</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Method 1: Auto Installer (Recommended)</h2>
      <p>Our installation script works on most Linux distributions:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
        </code>
      </div>

      <p>The script will:</p>
      <ul>
        <li>Detect your distribution and architecture</li>
        <li>Download the appropriate binary</li>
        <li>Install to <code>/usr/local/bin</code></li>
        <li>Create systemd service (optional)</li>
      </ul>

      <h2>Method 2: Distribution Packages</h2>

      <h3>Debian/Ubuntu (DEB)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_amd64.deb<br />
          sudo dpkg -i malikclaw_amd64.deb<br />
          sudo apt-get install -f  # Fix dependencies if needed
        </code>
      </div>

      <h3>Fedora/RHEL (RPM)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_x86_64.rpm<br />
          sudo dnf install malikclaw_x86_64.rpm
        </code>
      </div>

      <h3>Arch Linux (AUR)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          yay -S malikclaw<br />
          # or<br />
          paru -S malikclaw
        </code>
      </div>

      <h2>Method 3: Manual Binary Installation</h2>

      <h3>Step 1: Download</h3>
      <p>Choose the binary for your architecture:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 not-prose">
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz"
          className="flex items-center justify-between p-3 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-teal-700 dark:text-[#0df2c9]" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">x86_64</span>
          </div>
          <Download className="w-4 h-4 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9]" aria-hidden="true" />
        </a>
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz"
          className="flex items-center justify-between p-3 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-700 dark:text-purple-400" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">ARM64</span>
          </div>
          <Download className="w-4 h-4 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9]" aria-hidden="true" />
        </a>
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv6.tar.gz"
          className="flex items-center justify-between p-3 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-teal-700 dark:text-[#0df2c9]" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">ARMv6 (Pi Zero)</span>
          </div>
          <Download className="w-4 h-4 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9]" aria-hidden="true" />
        </a>
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv7.tar.gz"
          className="flex items-center justify-between p-3 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-700 dark:text-purple-400" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">ARMv7</span>
          </div>
          <Download className="w-4 h-4 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9]" aria-hidden="true" />
        </a>
      </div>

      <h3>Step 2: Extract and Install</h3>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          cd ~/Downloads<br />
          tar -xzf malikclaw_Linux_*.tar.gz<br />
          sudo mv malikclaw /usr/local/bin/<br />
          sudo chmod +x /usr/local/bin/malikclaw
        </code>
      </div>

      <h3>Step 3: Verify</h3>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          malikclaw --version
        </code>
      </div>

      <h2>Raspberry Pi Installation</h2>

      <h3>Raspberry Pi Zero 2 W (64-bit)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz<br />
          tar -xzf malikclaw_Linux_arm64.tar.gz<br />
          sudo mv malikclaw /usr/local/bin/<br />
          malikclaw onboard
        </code>
      </div>

      <h3>Raspberry Pi Zero (32-bit)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv6.tar.gz<br />
          tar -xzf malikclaw_Linux_armv6.tar.gz<br />
          sudo mv malikclaw /usr/local/bin/<br />
          malikclaw onboard
        </code>
      </div>

      <h2>Systemd Service (Optional)</h2>
      <p>Run MalikClaw as a background service:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          sudo systemctl enable malikclaw<br />
          sudo systemctl start malikclaw<br />
          sudo systemctl status malikclaw
        </code>
      </div>

      <h2>Docker Installation</h2>
      <p>For containerized deployments (non-root UID 1000 user):</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          docker pull ghcr.io/abdullahmalik17/malikclaw:latest<br />
          docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/home/malikclaw/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest
        </code>
      </div>

      <h2>Uninstall</h2>

      <h3>DEB/RPM</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          sudo apt-get remove malikclaw<br />
          # or<br />
          sudo dnf remove malikclaw
        </code>
      </div>

      <h3>Manual</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          sudo rm /usr/local/bin/malikclaw<br />
          rm -rf ~/.malikclaw
        </code>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Missing dependencies</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          # Debian/Ubuntu<br />
          sudo apt-get install libc6<br />
          <br />
          # Fedora/RHEL<br />
          sudo dnf install glibc
        </code>
      </div>

      <h3>Architecture detection</h3>
      <p>Check your system architecture:</p>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          uname -m<br />
          # or<br />
          dpkg --print-architecture
        </code>
      </div>

      <div className="mt-8 p-6 rounded-xl bg-card-bg border border-card-border not-prose">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/quick-start"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          >
            Quick Start Guide <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <Link
            href="/docs/deployment/docker"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-1 text-foreground font-medium hover:bg-surface-2 transition-colors border border-card-border"
          >
            Docker Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
