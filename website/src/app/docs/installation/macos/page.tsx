"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, Terminal } from "lucide-react";

export default function MacOSInstallation() {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white prose-code:text-[#0df2c9] prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">macOS Installation</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Install MalikClaw on macOS (Intel and Apple Silicon).
      </p>

      <div className="p-4 rounded-lg bg-[#0df2c9]/10 border border-[#0df2c9]/20 mb-8">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-[#0df2c9] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#0df2c9] mb-1">System Requirements</h3>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• macOS 11.0 (Big Sur) or later</li>
              <li>• 50 MB free disk space</li>
              <li>• Minimum 512 MB RAM</li>
              <li>• Intel or Apple Silicon (M1/M2/M3)</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Method 1: Homebrew (Recommended)</h2>
      <p>The easiest way to install MalikClaw on macOS.</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          brew install malikclaw
        </code>
      </div>

      <p>If you don&apos;t have Homebrew installed:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          /bin/bash -c &quot;$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)&quot;
        </code>
      </div>

      <h2>Method 2: Auto Installer Script</h2>
      <p>Our installation script handles everything automatically:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          curl -sSfL https://malikclaw.io/install.sh | sh
        </code>
      </div>

      <p>The script will:</p>
      <ul>
        <li>Detect your architecture (Intel or Apple Silicon)</li>
        <li>Download the appropriate binary</li>
        <li>Install to <code>/usr/local/bin</code></li>
        <li>Set up permissions automatically</li>
      </ul>

      <h2>Method 3: Manual Installation</h2>
      
      <h3>Step 1: Download</h3>
      <p>Choose the correct version for your Mac:</p>
      
      <div className="flex gap-4 my-4">
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Darwin_x86_64.tar.gz"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0df2c9] text-black font-medium hover:bg-[#0bc2a1] transition-colors"
        >
          <Download className="w-4 h-4" />
          Intel (x86_64)
        </a>
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Darwin_arm64.tar.gz"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#8e2de2] text-white font-medium hover:bg-[#7a1fc9] transition-colors"
        >
          <Download className="w-4 h-4" />
          Apple Silicon (M1/M2/M3)
        </a>
      </div>

      <p>To check your architecture:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          uname -m<br />
          # x86_64 = Intel<br />
          # arm64 = Apple Silicon
        </code>
      </div>

      <h3>Step 2: Extract</h3>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          cd ~/Downloads<br />
          tar -xzf malikclaw_Darwin_*.tar.gz
        </code>
      </div>

      <h3>Step 3: Install</h3>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          sudo mv malikclaw /usr/local/bin/<br />
          sudo chmod +x /usr/local/bin/malikclaw
        </code>
      </div>

      <h3>Step 4: Verify</h3>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          malikclaw --version
        </code>
      </div>

      <h2>Apple Silicon Optimization</h2>
      <p>MalikClaw includes native ARM64 builds for M1/M2/M3 Macs:</p>
      <ul>
        <li>Up to 30% better performance compared to Rosetta 2 translation</li>
        <li>Lower power consumption</li>
        <li>Optimized memory usage</li>
      </ul>

      <h2>Gatekeeper Warning</h2>
      <p>If you see &quot;malikclaw can&apos;t be opened because the developer cannot be verified&quot;:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          xattr -d com.apple.quarantine /usr/local/bin/malikclaw
        </code>
      </div>

      <p>Or go to <strong>System Preferences → Security & Privacy</strong> and click &quot;Open Anyway&quot;.</p>

      <h2>Uninstall</h2>
      
      <h3>Homebrew</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          brew uninstall malikclaw
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

      <h3>Command not found</h3>
      <p>Add to your PATH in <code>~/.zshrc</code> or <code>~/.bash_profile</code>:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          export PATH=&quot;/usr/local/bin:$PATH&quot;
        </code>
      </div>

      <h3>Permission denied</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          sudo chmod +x /usr/local/bin/malikclaw
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
            href="/docs/configuration"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
          >
            Configuration
          </Link>
        </div>
      </div>
    </div>
  );
}
