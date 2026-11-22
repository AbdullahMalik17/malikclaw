"use client";

import Link from "next/link";
import { ArrowRight, Download, Check } from "lucide-react";

export default function MacOSInstallation() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-[#0B0C10] prose-pre:border prose-pre:border-zinc-800 prose-a:text-teal-700 dark:prose-a:text-[#0df2c9] prose-headings:text-foreground prose-code:text-teal-800 dark:prose-code:text-[#0df2c9] prose-code:bg-teal-500/10 dark:prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">macOS Installation</h1>
      <p className="text-xl text-text-muted mb-8">
        Install MalikClaw on macOS (Intel and Apple Silicon).
      </p>

      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-600/25 mb-8 not-prose">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-teal-700 dark:text-[#0df2c9] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-teal-800 dark:text-[#0df2c9] mb-1">System Requirements</h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• macOS 11.0 (Big Sur) or later</li>
              <li>• 50 MB free disk space</li>
              <li>• Minimum 512 MB RAM</li>
              <li>• Intel or Apple Silicon (M1/M2/M3)</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Method 1: Go Install (Recommended)</h2>
      <p>Build and install the latest tagged release straight from the module with the Go toolchain (Go 1.25.7 or newer).</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          go install github.com/AbdullahMalik17/malikclaw/cmd/malikclaw@latest
        </code>
      </div>

      <p>If you don&apos;t have Go yet:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          brew install go<br />
          export PATH=&quot;$(go env GOPATH)/bin:$PATH&quot;
        </code>
      </div>

      <h2>Method 2: Docker Image</h2>
      <p>Skip the local install entirely and run the published multi-arch image:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          docker pull ghcr.io/abdullahmalik17/malikclaw:latest<br />
          docker run -it --rm -v ~/.malikclaw:/root/.malikclaw --entrypoint malikclaw ghcr.io/abdullahmalik17/malikclaw:latest version
        </code>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 my-4 not-prose">
        <p className="text-sm text-foreground m-0">
          <strong>Note:</strong> the <code>install.sh</code> one-liner supports Linux and Android/Termux only — its
          architecture detection has no macOS branch. On a Mac, use one of the methods on this page.
        </p>
      </div>

      <p>The manual archive route:</p>
      <ul>
        <li>Pick the <code>Darwin_arm64</code> or <code>Darwin_x86_64</code> tarball below</li>
        <li>Extract the <code>malikclaw</code> binary</li>
        <li>Install to <code>/usr/local/bin</code></li>
        <li>Clear the Gatekeeper quarantine attribute</li>
      </ul>

      <h2>Method 3: Manual Installation</h2>

      <h3>Step 1: Download</h3>
      <p>Choose the correct version for your Mac:</p>

      <div className="flex flex-wrap gap-4 my-4 not-prose">
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Darwin_x86_64.tar.gz"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Intel (x86_64)
        </a>
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Darwin_arm64.tar.gz"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-600 transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Apple Silicon (M1/M2/M3)
        </a>
      </div>

      <p>To check your architecture:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          uname -m<br />
          # x86_64 = Intel<br />
          # arm64 = Apple Silicon
        </code>
      </div>

      <h3>Step 2: Extract</h3>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          cd ~/Downloads<br />
          tar -xzf malikclaw_Darwin_*.tar.gz
        </code>
      </div>

      <h3>Step 3: Install</h3>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          sudo mv malikclaw /usr/local/bin/<br />
          sudo chmod +x /usr/local/bin/malikclaw
        </code>
      </div>

      <h3>Step 4: Verify</h3>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          malikclaw version
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

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          xattr -d com.apple.quarantine /usr/local/bin/malikclaw
        </code>
      </div>

      <p>Or go to <strong>System Preferences → Security &amp; Privacy</strong> and click &quot;Open Anyway&quot;.</p>

      <h2>Uninstall</h2>

      <h3>Go Install</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          rm &quot;$(go env GOPATH)/bin/malikclaw&quot;
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

      <h3>Command not found</h3>
      <p>Add to your PATH in <code>~/.zshrc</code> or <code>~/.bash_profile</code>:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          export PATH=&quot;/usr/local/bin:$PATH&quot;
        </code>
      </div>

      <h3>Permission denied</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          sudo chmod +x /usr/local/bin/malikclaw
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
            href="/docs/configuration"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-1 text-foreground font-medium hover:bg-surface-2 transition-colors border border-card-border"
          >
            Configuration
          </Link>
        </div>
      </div>
    </div>
  );
}
