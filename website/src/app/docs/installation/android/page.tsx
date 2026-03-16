"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, Smartphone, AlertTriangle } from "lucide-react";

export default function AndroidInstallation() {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white prose-code:text-[#0df2c9] prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Android Installation (Termux)</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Run MalikClaw on your Android phone using Termux. Give your old phone a second life as an AI assistant!
      </p>

      <div className="p-4 rounded-lg bg-[#0df2c9]/10 border border-[#0df2c9]/20 mb-8">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-[#0df2c9] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#0df2c9] mb-1">Requirements</h3>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• Android 7.0 (Nougat) or later</li>
              <li>• ARM64 processor (most modern phones)</li>
              <li>• At least 1 GB RAM (2 GB recommended)</li>
              <li>• 100 MB free storage</li>
              <li>• Termux app (from F-Droid or Play Store)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-500 mb-2">Important Notes</h3>
            <ul className="text-sm text-yellow-200/80 space-y-1">
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
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0df2c9] text-black font-medium hover:bg-[#0bc2a1] transition-colors my-4"
      >
        <Download className="w-4 h-4" />
        Download from F-Droid
      </a>

      <h3>Option B: Google Play Store</h3>
      <p>Note: Play Store version may be outdated:</p>
      <a 
        href="https://play.google.com/store/apps/details?id=com.termux"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10 my-4"
      >
        <Smartphone className="w-4 h-4" />
        Get from Play Store
      </a>

      <h2>Step 2: Update Termux</h2>
      <p>Open Termux and update packages:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          pkg update && pkg upgrade
        </code>
      </div>

      <h2>Step 3: Install Dependencies</h2>
      <p>Install proot and other required packages:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          pkg install proot proot-distro wget curl
        </code>
      </div>

      <h2>Step 4: Download MalikClaw</h2>
      <p>Download the ARM64 binary:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          wget https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_arm64<br />
          chmod +x malikclaw_Linux_arm64
        </code>
      </div>

      <h2>Step 5: Run with Proot</h2>
      
      <h3>Method A: Direct Execution (No Root)</h3>
      <p>Run MalikClaw directly:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          ./malikclaw_Linux_arm64 onboard
        </code>
      </div>

      <h3>Method B: With Proot Chroot (Recommended)</h3>
      <p>For better compatibility, use proot chroot:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          termux-chroot<br />
          ./malikclaw_Linux_arm64 onboard
        </code>
      </div>

      <p>If <code>termux-chroot</code> is not available, install it:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          pkg install termux-exec<br />
          $PREFIX/bin/termux-exec setup
        </code>
      </div>

      <h2>Alternative: Install Ubuntu/Debian in Termux</h2>
      <p>For a full Linux environment:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          pkg install proot-distro<br />
          proot-distro install ubuntu<br />
          proot-distro login ubuntu<br />
          <br />
          # Now install MalikClaw inside Ubuntu<br />
          curl -sSfL https://malikclaw.io/install.sh | sh
        </code>
      </div>

      <h2>Step 6: Configure</h2>
      <p>After running <code>onboard</code>, configure your API keys:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          nano ~/.malikclaw/config.json
        </code>
      </div>

      <p>Add your LLM provider API keys (OpenAI, Anthropic, etc.) and configure channels.</p>

      <h2>Running in Background</h2>
      <p>Keep MalikClaw running when Termux is in background:</p>

      <h3>Option 1: Use termux-wake-lock</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          termux-wake-lock<br />
          ./malikclaw_Linux_arm64 gateway
        </code>
      </div>

      <h3>Option 2: Use Boot Menu</h3>
      <p>Create a startup script:</p>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          mkdir -p ~/.termux/boot/<br />
          echo &quot;./malikclaw_Linux_arm64 gateway&quot; &gt; ~/.termux/boot/start-malikclaw<br />
          chmod +x ~/.termux/boot/start-malikclaw
        </code>
      </div>

      <h2>Mobile-Specific Features</h2>
      <p>MalikClaw on Android can:</p>
      <ul>
        <li>• Control your phone via ADB commands</li>
        <li>• Take screenshots and analyze them</li>
        <li>• Automate taps, swipes, and text input</li>
        <li>• Run as a personal AI assistant 24/7</li>
      </ul>

      <h2>ADB Integration (Advanced)</h2>
      <p>Enable ADB and control your device:</p>

      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          pkg install android-tools<br />
          adb connect localhost:5555<br />
          malikclaw agent -m &quot;Take a screenshot&quot;
        </code>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Permission denied</h3>
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          chmod +x malikclaw_Linux_arm64
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
      <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 my-4">
        <code className="text-sm text-zinc-300 font-mono block">
          # In config.json, use smaller models<br />
          &quot;model_name&quot;: &quot;gpt-3.5-turbo&quot;
        </code>
      </div>

      <h3>Battery optimization killing process</h3>
      <ol>
        <li>Go to Android Settings → Apps → Termux</li>
        <li>Tap Battery → Battery optimization</li>
        <li>Select &quot;All apps&quot; → Find Termux → Select &quot;Don&apos;t optimize&quot;</li>
      </ol>

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
            href="/docs/mobile-operation"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
          >
            Mobile Operation Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
