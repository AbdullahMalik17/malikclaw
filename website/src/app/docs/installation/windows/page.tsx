"use client";

import Link from "next/link";
import { ArrowRight, Download, Check } from "lucide-react";

export default function WindowsInstallation() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-[#0B0C10] prose-pre:border prose-pre:border-zinc-800 prose-a:text-teal-700 dark:prose-a:text-[#0df2c9] prose-headings:text-foreground prose-code:text-teal-800 dark:prose-code:text-[#0df2c9] prose-code:bg-teal-500/10 dark:prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Windows Installation</h1>
      <p className="text-xl text-text-muted mb-8">
        Install MalikClaw on Windows 10/11 (64-bit) using your preferred method.
      </p>

      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-600/25 mb-8 not-prose">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-teal-700 dark:text-[#0df2c9] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-teal-800 dark:text-[#0df2c9] mb-1">System Requirements</h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• Windows 10 version 1903 or later (64-bit / ARM64)</li>
              <li>• 50 MB free disk space</li>
              <li>• Minimum 512 MB RAM (MalikClaw uses &lt;10MB idle RSS)</li>
              <li>• PowerShell 5.1+ or Windows Terminal</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Method 1: PowerShell One-Liner (Recommended)</h2>
      <p>Install the latest signed Windows binary and configure PATH automatically:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex
        </code>
      </div>

      <p>Verify the installation and start onboarding:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          malikclaw --version<br />
          malikclaw onboard
        </code>
      </div>

      <h2>Method 2: Winget &amp; Chocolatey</h2>
      <p>You can also install using Windows Package Manager or Chocolatey:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          winget install malikclaw<br />
          # or<br />
          choco install malikclaw
        </code>
      </div>

      <h2>Method 3: Manual Installation</h2>

      <h3>Step 1: Download</h3>
      <p>Download the latest release from GitHub:</p>

      <div className="flex flex-wrap gap-4 my-4 not-prose">
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download x86_64 ZIP
        </a>
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_arm64.zip"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-600 transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download ARM64 ZIP
        </a>
      </div>

      <h3>Step 2: Extract</h3>
      <p>Extract the ZIP file to your preferred location:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          C:\Program Files\MalikClaw\
        </code>
      </div>

      <h3>Step 3: Add to PATH</h3>
      <ol>
        <li>Press <code>Win + X</code> and select <strong>System</strong></li>
        <li>Click <strong>Advanced system settings</strong></li>
        <li>Click <strong>Environment Variables</strong></li>
        <li>Under <strong>System variables</strong>, find and select <code>Path</code></li>
        <li>Click <strong>Edit</strong> → <strong>New</strong></li>
        <li>Add: <code>C:\Program Files\MalikClaw\</code></li>
        <li>Click <strong>OK</strong> to save all changes</li>
      </ol>

      <h3>Step 4: Verify</h3>
      <p>Open a new PowerShell or Command Prompt window:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          malikclaw --version
        </code>
      </div>

      <h2>Windows on ARM</h2>
      <p>For devices with Qualcomm Snapdragon processors (Surface Pro X, etc.):</p>
      <ul>
        <li>Download the ARM64 version from the links above</li>
        <li>Installation steps are identical to x86_64</li>
        <li>Performance is optimized for ARM architecture</li>
      </ul>

      <h2>Uninstall</h2>

      <h3>Winget/Chocolatey</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          winget uninstall malikclaw<br />
          # or<br />
          choco uninstall malikclaw
        </code>
      </div>

      <h3>Manual</h3>
      <ol>
        <li>Delete the installation directory: <code>C:\Program Files\MalikClaw\</code></li>
        <li>Remove the PATH entry from Environment Variables</li>
        <li>Delete configuration: <code>%USERPROFILE%\.malikclaw\</code></li>
      </ol>

      <h2>Troubleshooting</h2>

      <h3>&quot;malikclaw&quot; is not recognized</h3>
      <p>Close and reopen your terminal after installation. If the issue persists:</p>
      <ul>
        <li>Verify the installation directory is in PATH</li>
        <li>Run <code>echo %PATH%</code> to check</li>
        <li>Restart your computer if necessary</li>
      </ul>

      <h3>Antivirus warnings</h3>
      <p>Some antivirus software may flag the binary. This is a false positive. You can:</p>
      <ul>
        <li>Add an exception for <code>malikclaw.exe</code></li>
        <li>Verify the SHA256 checksum from the release page</li>
        <li>Build from source if you prefer</li>
      </ul>

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
