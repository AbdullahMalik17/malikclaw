import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Installation Guide — MalikClaw Documentation",
  description:
    "Install MalikClaw v2.0.0 on Windows, macOS, Linux, and Android with the installer scripts, npm, go install, or Docker, then verify the binary.",
  alternates: { canonical: "/docs/installation" },
};

export default function InstallationPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-[#0B0C10] prose-pre:border prose-pre:border-zinc-800 prose-a:text-amber-700 dark:prose-a:text-amber-400 prose-headings:text-foreground prose-code:text-amber-800 dark:prose-code:text-amber-300 prose-code:bg-amber-500/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Installation Guide</h1>
      <p className="text-xl text-text-muted mb-8">
        MalikClaw v2.0.0 is designed for easy deployment across multiple platforms. Choose your preferred installation method below.
      </p>

      <h2>Quick Install</h2>

      <h3>Linux / Android (Termux)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
        </code>
      </div>

      <h3>Windows (PowerShell)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex
        </code>
      </div>

      <h3>Node.js (npm) — All Platforms</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          npm install -g malikclaw
        </code>
      </div>
      <p className="text-sm text-text-muted">
        Requires Node.js 18+. The <code>malikclaw</code> npm package is a tiny shim: npm automatically downloads the
        matching <code>@malikclaw/cli-&lt;os&gt;-&lt;arch&gt;</code> package for your platform (win32-x64, darwin-arm64,
        linux-x64, and more) and runs the native Go binary through it. Verify with <code>malikclaw version</code>,
        and update anytime with <code>npm update -g malikclaw</code>.
      </p>
      <p className="text-sm text-text-muted">
        Note: npm packages are published automatically alongside every GitHub release. If
        <code>npm install -g malikclaw</code> returns a 404, that release has not been published to the
        registry yet — use the cURL installer or <code>go install</code> in the meantime.
      </p>

      <h3>macOS</h3>
      <p className="text-sm text-text-muted">
        <code>install.sh</code> has no macOS branch. Install with <code>go install</code>, the Docker image, or the
        signed <code>Darwin</code> archives — see the macOS guide.
      </p>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          go install github.com/AbdullahMalik17/malikclaw/cmd/malikclaw@latest
        </code>
      </div>

      <h2>Platform-Specific Guides</h2>
      <ul className="space-y-2 my-4">
        <li><Link href="/docs/installation/windows" className="text-amber-700 dark:text-amber-400 hover:underline">Windows Installation</Link> - Detailed Windows setup guide</li>
        <li><Link href="/docs/installation/macos" className="text-amber-700 dark:text-amber-400 hover:underline">macOS Installation</Link> - Go install, Docker, and manual archives</li>
        <li><Link href="/docs/installation/linux" className="text-amber-700 dark:text-amber-400 hover:underline">Linux Installation</Link> - DEB, RPM, Docker, and binary installation</li>
        <li><Link href="/docs/installation/android" className="text-amber-700 dark:text-amber-400 hover:underline">Android/Termux</Link> - Run MalikClaw on your phone</li>
      </ul>

      <h2>Verify Installation</h2>
      <p>After installation, verify MalikClaw is working:</p>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          malikclaw version
        </code>
      </div>
      <p>You should see output similar to:</p>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block whitespace-pre">
{`🦅 malikclaw 2.0.0 (git: a1b2c3d)
  Build: 2026-11-21T09:00:00Z
  Go: go1.25.7`}
        </code>
      </div>

      <h2>Next Steps</h2>
      <div className="flex flex-wrap gap-3 my-4 not-prose">
        <Link
          href="/docs/quick-start"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        >
          Quick Start Guide
        </Link>
        <Link
          href="/docs/configuration"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-1 text-foreground font-medium hover:bg-surface-2 transition-colors border border-card-border"
        >
          Configuration
        </Link>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Command not found</h3>
      <p>Ensure the installation directory is in your system PATH:</p>
      <ul>
        <li><strong>Linux/macOS</strong>: <code>~/.local/bin</code> or <code>/usr/local/bin</code></li>
        <li><strong>Windows</strong>: <code>C:\Program Files\MalikClaw</code></li>
      </ul>

      <h3>Permission denied (Linux/macOS)</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          sudo chmod +x /usr/local/bin/malikclaw
        </code>
      </div>

      <h2>Building from Source</h2>
      <p>See the <Link href="/docs/installation/source" className="text-amber-700 dark:text-amber-400 hover:underline">Source Installation Guide</Link> for detailed build instructions.</p>
    </div>
  );
}
