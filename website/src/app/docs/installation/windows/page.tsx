"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, AlertCircle } from "lucide-react";

export default function WindowsInstallation() {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white prose-code:text-[#0df2c9] prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Windows Installation</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Install MalikClaw on Windows 10/11 (64-bit) using your preferred method.
      </p>

      <div className="p-4 rounded-lg bg-[#0df2c9]/10 border border-[#0df2c9]/20 mb-8">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-[#0df2c9] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#0df2c9] mb-1">System Requirements</h3>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• Windows 10 version 1903 or later (64-bit)</li>
              <li>• 50 MB free disk space</li>
              <li>• Minimum 512 MB RAM (recommend 1 GB)</li>
              <li>• .NET Framework 4.5+ (usually pre-installed)</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Method 1: Winget (Recommended)</h2>
      <p>Windows Package Manager (winget) is the easiest way to install and update MalikClaw.</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          winget install malikclaw
        </code>
      </div>

      <p>Verify the installation:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          malikclaw --version
        </code>
      </div>

      <h2>Method 2: Chocolatey</h2>
      <p>If you prefer Chocolatey package manager:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          choco install malikclaw
        </code>
      </div>

      <h2>Method 3: Manual Installation</h2>
      
      <h3>Step 1: Download</h3>
      <p>Download the latest release from GitHub:</p>
      
      <div className="flex gap-4 my-4">
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0df2c9] text-black font-medium hover:bg-[#0bc2a1] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download x86_64 ZIP
        </a>
        <a 
          href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_arm64.zip"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#8e2de2] text-white font-medium hover:bg-[#7a1fc9] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download ARM64 ZIP
        </a>
      </div>

      <h3>Step 2: Extract</h3>
      <p>Extract the ZIP file to your preferred location:</p>
      
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
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

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
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
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
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
