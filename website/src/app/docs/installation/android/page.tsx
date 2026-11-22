"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, Smartphone, AlertTriangle } from "lucide-react";

export default function AndroidInstallation() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-[#0B0C10] prose-pre:border prose-pre:border-zinc-800 prose-a:text-teal-700 dark:prose-a:text-[#0df2c9] prose-headings:text-foreground prose-code:text-teal-800 dark:prose-code:text-[#0df2c9] prose-code:bg-teal-500/10 dark:prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Android Installation (Termux)</h1>
      <p className="text-xl text-text-muted mb-8">
        Run MalikClaw on your Android phone using Termux. Give your old phone a second life as an AI assistant!
      </p>

      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-600/25 mb-8 not-prose">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-teal-700 dark:text-[#0df2c9] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-teal-800 dark:text-[#0df2c9] mb-1">Requirements</h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• Android 7.0 (Nougat) or later</li>
              <li>• ARM64 processor (most modern phones)</li>
              <li>• At least 1 GB RAM (2 GB recommended)</li>
              <li>• 100 MB free storage</li>
              <li>• Termux app (from F-Droid or Play Store)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-600/25 mb-8 not-prose">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Important Notes</h3>
            <ul className="text-sm text-amber-900 dark:text-amber-200/85 space-y-1">
              <li>• Termux from Google Play Store is outdated. Use F-Droid version for best results.</li>
              <li>• <code>termux-chroot</code> requires root access or Shizuku for full functionality.</li>
              <li>• Battery optimization may need to be disabled for long-running processes.</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Step 1: Install Termux</h2>

      <h3>Option A: F-Droid (Recommended)</h3>
      <p>Download Termux from F-Droid for the latest version:</p>
      <a
        href="https://f-droid.org/en/packages/com.termux/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors my-4 not-prose"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        Download from F-Droid
      </a>

      <h3>Option B: Google Play Store</h3>
      <p>Note: Play Store version may be outdated:</p>
      <a
        href="https://play.google.com/store/apps/details?id=com.termux"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-1 text-foreground font-medium hover:bg-surface-2 transition-colors border border-card-border my-4 not-prose"
      >
        <Smartphone className="w-4 h-4" aria-hidden="true" />
        Get from Play Store
      </a>

      <h2>Step 2: Update Termux</h2>
      <p>Open Termux and update packages:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          pkg update &amp;&amp; pkg upgrade
        </code>
      </div>

      <h2>Step 3: Install Dependencies</h2>
      <p>Install proot and other required packages:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          pkg install proot proot-distro wget curl
        </code>
      </div>

      <h2>Step 4: Download MalikClaw</h2>
      <p>Easiest route — <code>install.sh</code> detects Termux and installs into <code>$PREFIX/bin</code>:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
        </code>
      </div>

      <p>Or fetch the ARM64 release archive by hand (most modern phones; check with <code>uname -m</code>):</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64.tar.gz<br />
          tar -xzf malikclaw_Linux_arm64.tar.gz<br />
          chmod +x malikclaw
        </code>
      </div>

      <p>The archive unpacks to binaries named <code>malikclaw</code> (plus the launcher), not the archive name.</p>

      <h2>Step 5: Run with Proot</h2>

      <h3>Method A: Direct Execution (No Root)</h3>
      <p>Run MalikClaw directly:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          malikclaw onboard
        </code>
      </div>

      <h3>Method B: With Proot Chroot (Recommended)</h3>
      <p>For better compatibility, use proot chroot:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          termux-chroot<br />
          malikclaw onboard
        </code>
      </div>

      <p>If <code>termux-chroot</code> is not available, install it:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          pkg install termux-exec<br />
          $PREFIX/bin/termux-exec setup
        </code>
      </div>

      <h2>Alternative: Install Ubuntu/Debian in Termux</h2>
      <p>For a full Linux environment:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          pkg install proot-distro<br />
          proot-distro install ubuntu<br />
          proot-distro login ubuntu<br />
          <br />
          # Now install MalikClaw inside Ubuntu<br />
          curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
        </code>
      </div>

      <h2>Step 6: Configure</h2>
      <p>After running <code>onboard</code>, configure your API keys:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          nano ~/.malikclaw/config.json
        </code>
      </div>

      <p>Add your LLM provider API keys (OpenAI, Anthropic, Gemini, or local Ollama) and configure channels.</p>

      <h2>Running in Background</h2>
      <p>Keep MalikClaw running when Termux is in background:</p>

      <h3>Option 1: Use termux-wake-lock</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          termux-wake-lock<br />
          malikclaw gateway
        </code>
      </div>

      <h3>Option 2: Use Boot Menu</h3>
      <p>Create a startup script:</p>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          mkdir -p ~/.termux/boot/<br />
          echo &quot;malikclaw gateway&quot; &gt; ~/.termux/boot/start-malikclaw<br />
          chmod +x ~/.termux/boot/start-malikclaw
        </code>
      </div>

      <h2>Mobile-Specific Features</h2>
      <p>MalikClaw on Android can:</p>
      <ul>
        <li>Control your phone via ADB commands</li>
        <li>Take screenshots and analyze them</li>
        <li>Automate taps, swipes, and text input</li>
        <li>Run as a personal AI assistant 24/7</li>
      </ul>

      <h2>ADB Integration (Advanced)</h2>
      <p>Enable ADB and control your device:</p>

      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          pkg install android-tools<br />
          adb connect localhost:5555<br />
          malikclaw agent -m &quot;Take a screenshot&quot;
        </code>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Permission denied</h3>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          chmod +x malikclaw
        </code>
      </div>

      <h3>termux-chroot not working</h3>
      <p>Some devices require root for full chroot functionality. Try:</p>
      <ul>
        <li>Using direct execution without chroot</li>
        <li>Installing Ubuntu via proot-distro instead</li>
        <li>Using Shizuku for non-root chroot access</li>
      </ul>

      <h3>Out of memory</h3>
      <p>Close other apps or reduce model size:</p>
      <div className="p-4 rounded-xl bg-[#0B0C10] border border-zinc-800 my-4 not-prose overflow-x-auto">
        <code className="text-sm text-zinc-100 font-mono block">
          # In config.json, use smaller models<br />
          &quot;model_name&quot;: &quot;gemini-2.5-flash&quot;
        </code>
      </div>

      <h3>Battery optimization killing process</h3>
      <ol>
        <li>Go to Android Settings → Apps → Termux</li>
        <li>Tap Battery → Battery optimization</li>
        <li>Select &quot;All apps&quot; → Find Termux → Select &quot;Don&apos;t optimize&quot;</li>
      </ol>

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
            href="/docs/mobile-operation"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-1 text-foreground font-medium hover:bg-surface-2 transition-colors border border-card-border"
          >
            Mobile Operation Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
