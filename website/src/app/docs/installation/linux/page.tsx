"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, Terminal, Cpu } from "lucide-react";

export default function LinuxInstallation() {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white prose-code:text-[#0df2c9] prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Linux Installation</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Install MalikClaw on Linux distributions and embedded devices.
      </p>

      <div className="p-4 rounded-lg bg-[#0df2c9]/10 border border-[#0df2c9]/20 mb-8">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-[#0df2c9] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#0df2c9] mb-1">Supported Architectures</h3>
            <ul className="text-sm text-zinc-300 space-y-1">
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

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          curl -sSfL https://malikclaw.io/install.sh | sh
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
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_amd64.deb<br />
          sudo dpkg -i malikclaw_amd64.deb<br />
          sudo apt-get install -f  # Fix dependencies if needed
        </code>
      </div>

      <h3>Fedora/RHEL (RPM)</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_x86_64.rpm<br />
          sudo dnf install malikclaw_x86_64.rpm
        </code>
      </div>

      <h3>Arch Linux (AUR)</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          yay -S malikclaw<br />
          # or<br />
          paru -S malikclaw
        </code>
      </div>

      <h2>Method 3: Manual Binary Installation</h2>

      <h3>Step 1: Download</h3>
      <p>Choose the binary for your architecture:</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz"
          className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#0df2c9]" />
            <span className="text-sm font-medium text-white">x86_64</span>
          </div>
          <Download className="w-4 h-4 text-zinc-400 group-hover:text-[#0df2c9]" />
        </a>
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz"
          className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#8e2de2]" />
            <span className="text-sm font-medium text-white">ARM64</span>
          </div>
          <Download className="w-4 h-4 text-zinc-400 group-hover:text-[#0df2c9]" />
        </a>
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv6.tar.gz"
          className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#0df2c9]" />
            <span className="text-sm font-medium text-white">ARMv6 (Pi Zero)</span>
          </div>
          <Download className="w-4 h-4 text-zinc-400 group-hover:text-[#0df2c9]" />
        </a>
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv7.tar.gz"
          className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#8e2de2]" />
            <span className="text-sm font-medium text-white">ARMv7</span>
          </div>
          <Download className="w-4 h-4 text-zinc-400 group-hover:text-[#0df2c9]" />
        </a>
      </div>

      <h3>Step 2: Extract and Install</h3>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          cd ~/Downloads<br />
          tar -xzf malikclaw_Linux_*.tar.gz<br />
          sudo mv malikclaw /usr/local/bin/<br />
          sudo chmod +x /usr/local/bin/malikclaw
        </code>
      </div>

      <h3>Step 3: Verify</h3>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          malikclaw --version
        </code>
      </div>

      <h2>Raspberry Pi Installation</h2>
      
      <h3>Raspberry Pi Zero 2 W (64-bit)</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz<br />
          tar -xzf malikclaw_Linux_arm64.tar.gz<br />
          sudo mv malikclaw /usr/local/bin/<br />
          malikclaw onboard
        </code>
      </div>

      <h3>Raspberry Pi Zero (32-bit)</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_armv6.tar.gz<br />
          tar -xzf malikclaw_Linux_armv6.tar.gz<br />
          sudo mv malikclaw /usr/local/bin/<br />
          malikclaw onboard
        </code>
      </div>

      <h2>Systemd Service (Optional)</h2>
      <p>Run MalikClaw as a background service:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          sudo systemctl enable malikclaw<br />
          sudo systemctl start malikclaw<br />
          sudo systemctl status malikclaw
        </code>
      </div>

      <h2>Docker Installation</h2>
      <p>For containerized deployments:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          docker pull ghcr.io/abdullahmalik17/malikclaw:latest<br />
          docker run -d --name malikclaw \<br />
          {'  '}-v ~/.malikclaw:/root/.malikclaw \<br />
          {'  '}ghcr.io/abdullahmalik17/malikclaw:latest
        </code>
      </div>

      <h2>Uninstall</h2>
      
      <h3>DEB/RPM</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          sudo apt-get remove malikclaw<br />
          # or<br />
          sudo dnf remove malikclaw
        </code>
      </div>

      <h3>Manual</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          sudo rm /usr/local/bin/malikclaw<br />
          rm -rf ~/.malikclaw
        </code>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Missing dependencies</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          # Debian/Ubuntu<br />
          sudo apt-get install libc6<br />
          <br />
          # Fedora/RHEL<br />
          sudo dnf install glibc
        </code>
      </div>

      <h3>Architecture detection</h3>
      <p>Check your system architecture:</p>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          uname -m<br />
          # or<br />
          dpkg --print-architecture
        </code>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-[#18181b] border border-white/5">
        <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/docs/quick-start"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0df2c9] text-black font-medium hover:bg-[#0bc2a1] transition-colors"
          >
            Quick Start Guide <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/docs/deployment/docker"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
          >
            Docker Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
