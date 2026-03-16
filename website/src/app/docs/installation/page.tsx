"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, Terminal } from "lucide-react";

export default function InstallationPage() {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white prose-code:text-[#0df2c9] prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Installation Guide</h1>
      <p className="text-xl text-zinc-400 mb-8">
        MalikClaw is designed for easy deployment across multiple platforms. Choose your preferred installation method below.
      </p>

      <h2>Quick Install</h2>

      <h3>Linux/macOS</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          curl -sSfL https://malikclaw.io/install.sh | sh
        </code>
      </div>

      <h3>Windows (PowerShell)</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          winget install malikclaw
        </code>
      </div>

      <h2>Platform-Specific Guides</h2>
      <ul className="space-y-2 my-4">
        <li>• <Link href="/docs/installation/windows" className="text-[#0df2c9] hover:underline">Windows Installation</Link> - Detailed Windows setup guide</li>
        <li>• <Link href="/docs/installation/macos" className="text-[#0df2c9] hover:underline">macOS Installation</Link> - Homebrew and manual installation</li>
        <li>• <Link href="/docs/installation/linux" className="text-[#0df2c9] hover:underline">Linux Installation</Link> - DEB, RPM, and binary installation</li>
        <li>• <Link href="/docs/installation/android" className="text-[#0df2c9] hover:underline">Android/Termux</Link> - Run MalikClaw on your phone</li>
      </ul>

      <h2>Verify Installation</h2>
      <p>After installation, verify MalikClaw is working:</p>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          malikclaw --version
        </code>
      </div>
      <p>You should see output similar to:</p>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          MalikClaw v0.1.1<br />
          Go version: go1.25.7<br />
          Build time: 2026-03-14
        </code>
      </div>

      <h2>Next Steps</h2>
      <div className="flex flex-wrap gap-3 my-4">
        <Link 
          href="/docs/quick-start"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0df2c9] text-black font-medium hover:bg-[#0bc2a1] transition-colors"
        >
          Quick Start Guide
        </Link>
        <Link 
          href="/docs/configuration"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
        >
          Configuration
        </Link>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Command not found</h3>
      <p>Ensure the installation directory is in your system PATH:</p>
      <ul>
        <li><strong>Linux/macOS</strong>: <code className="text-[#0df2c9]">~/.local/bin</code> or <code className="text-[#0df2c9]">/usr/local/bin</code></li>
        <li><strong>Windows</strong>: <code className="text-[#0df2c9]">C:\Program Files\MalikClaw</code></li>
      </ul>

      <h3>Permission denied (Linux/macOS)</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          sudo chmod +x /usr/local/bin/malikclaw
        </code>
      </div>

      <h2>Building from Source</h2>
      <p>See the <Link href="/docs/installation/source" className="text-[#0df2c9] hover:underline">Source Installation Guide</Link> for detailed build instructions.</p>
    </div>
  );
}
