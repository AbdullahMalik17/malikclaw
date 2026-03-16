"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Zap, Smartphone, Feather, ShieldCheck, Download, Terminal, Cpu, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-[#0df2c9]/30">

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter text-white">MalikClaw</span>
            <span className="px-2 py-0.5 rounded-full bg-[#0df2c9]/10 text-[#0df2c9] text-xs font-medium border border-[#0df2c9]/20">
              v0.1.1
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/download" className="flex items-center gap-2 text-sm font-medium text-[#0df2c9] hover:text-white transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Link>
            <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#0df2c9] transition-colors">
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-12 mb-24 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
              <Zap className="w-4 h-4 text-[#8e2de2]" />
              <span className="text-zinc-300">Open source AI Assistant in Go</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
              Ultra-Efficient AI Assistant.<br className="hidden sm:block" />
              <span className="text-gradient">آگے بڑھو، ملک کلاؤ!</span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-2xl mt-4">
              Designed to bring powerful agentic AI capabilities to low-cost hardware. Runs on $10 boards, uses less than 10MB RAM, and boots in 1 second.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <Link href="/docs/installation" className="flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-[#0df2c9] text-black font-semibold hover:bg-[#0bc2a1] transition-colors">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" /> View on GitHub
              </a>
            </div>
          </motion.div>
          
          {/* Terminal Snippet */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 bg-[#121214] shadow-[0_0_40px_-10px_rgba(13,242,201,0.15)]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs text-zinc-500 font-mono">bash</span>
            </div>
            <div className="p-4 sm:p-6 text-left font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
              <div className="text-zinc-400"># Install & Run in seconds</div>
              <div className="flex">
                <span className="text-pink-500 mr-2">❯</span>
                <span className="text-zinc-300">curl -sSfL https://malikclaw.io/install.sh | sh</span>
              </div>
              <div className="flex mt-2">
                <span className="text-pink-500 mr-2">❯</span>
                <span className="text-zinc-300">malikclaw onboard</span>
              </div>
              <div className="text-zinc-500 mt-1">Starting MalikClaw Agent...</div>
              <div className="text-[#0df2c9] mt-1">✓ Booted in 0.8s</div>
              <div className="text-[#0df2c9]">✓ Memory usage: 8.4MB / 1024MB</div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Built for Performance</h2>
            <p className="text-zinc-400 mt-2">Zero compromises on efficiency and speed.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[#0df2c9]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Feather className="w-6 h-6 text-[#0df2c9]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Urdu-First Strategy</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Native Right-to-Left UI with bilingual onboarding optimized for the South Asian developer ecosystem.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#8e2de2]/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[#8e2de2]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#8e2de2]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Ultra-Lightweight</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Requires under 10MB of RAM. That&apos;s 99% smaller than typical bloated Javascript bots and alternatives.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[#0df2c9]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#0df2c9]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Lightning Fast</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                400X faster startup times. Boots instantly in under 1 second thanks to our optimized Go architecture.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#8e2de2]/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[#8e2de2]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6 text-[#8e2de2]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Mobile Operation</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Control Android devices via ADB natively. Give your decade-old phone a second life with Termux integration.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="w-full py-24 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">The Edge Hardware Champion</h2>
            <p className="text-zinc-400 mt-2">How MalikClaw stacks up against the competition.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 border-b border-white/10 font-semibold text-zinc-400">Metric</th>
                  <th className="py-4 px-6 border-b border-white/10 font-semibold text-zinc-400">OpenClaw</th>
                  <th className="py-4 px-6 border-b border-[#0df2c9]/30 font-bold text-white bg-[#0df2c9]/5 rounded-t-lg">MalikClaw</th>
                </tr>
              </thead>
              <tbody className="text-sm sm:text-base">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 font-medium text-white">Language</td>
                  <td className="py-5 px-6 text-zinc-400">TypeScript</td>
                  <td className="py-5 px-6 text-[#0df2c9] font-medium bg-[#0df2c9]/5">Go</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 font-medium text-white">RAM Usage</td>
                  <td className="py-5 px-6 text-zinc-400">{'>'} 1GB</td>
                  <td className="py-5 px-6 text-[#0df2c9] font-medium bg-[#0df2c9]/5">{'<'} 10MB</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 font-medium text-white">Startup Time (0.8GHz core)</td>
                  <td className="py-5 px-6 text-zinc-400">{'>'} 500s</td>
                  <td className="py-5 px-6 text-[#0df2c9] font-medium bg-[#0df2c9]/5">{'<'} 1s</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 font-medium text-white rounded-bl-lg">Hardware Cost</td>
                  <td className="py-5 px-6 text-zinc-400">Mac Mini (~$599)</td>
                  <td className="py-5 px-6 text-[#0df2c9] font-medium bg-[#0df2c9]/5 rounded-br-lg">Any Linux Board (~$10)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Download Section */}
        <section id="download" className="w-full py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Download MalikClaw</h2>
            <p className="text-zinc-400 mt-2">Choose your platform and get started in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Windows */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0df2c9]/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-[#0df2c9]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Windows</h3>
              <p className="text-zinc-400 text-sm mb-4">Windows 10/11 (64-bit)</p>
              <div className="space-y-2">
                <a 
                  href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip"
                  className="block w-full py-2 px-4 rounded-md bg-[#0df2c9] text-black font-medium text-center hover:bg-[#0bc2a1] transition-colors text-sm"
                >
                  Download EXE
                </a>
                <code className="block p-2 rounded bg-black/50 text-xs text-zinc-400 font-mono">
                  winget install malikclaw
                </code>
              </div>
            </motion.div>

            {/* macOS */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#8e2de2]/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#8e2de2]/10 flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-[#8e2de2]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">macOS</h3>
              <p className="text-zinc-400 text-sm mb-4">Intel & Apple Silicon</p>
              <div className="space-y-2">
                <a 
                  href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Darwin_x86_64.tar.gz"
                  className="block w-full py-2 px-4 rounded-md bg-[#8e2de2] text-white font-medium text-center hover:bg-[#7a1fc9] transition-colors text-sm"
                >
                  Download TAR.GZ
                </a>
                <code className="block p-2 rounded bg-black/50 text-xs text-zinc-400 font-mono">
                  brew install malikclaw
                </code>
              </div>
            </motion.div>

            {/* Linux */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0df2c9]/10 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-[#0df2c9]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Linux</h3>
              <p className="text-zinc-400 text-sm mb-4">x86_64, ARM64, ARMv6/7</p>
              <div className="space-y-2">
                <a 
                  href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz"
                  className="block w-full py-2 px-4 rounded-md bg-[#0df2c9] text-black font-medium text-center hover:bg-[#0bc2a1] transition-colors text-sm"
                >
                  Download TAR.GZ
                </a>
                <code className="block p-2 rounded bg-black/50 text-xs text-zinc-400 font-mono">
                  curl -sSfL https://malikclaw.io/install.sh | sh
                </code>
              </div>
            </motion.div>

            {/* Android/Termux */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#8e2de2]/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#8e2de2]/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-[#8e2de2]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Android</h3>
              <p className="text-zinc-400 text-sm mb-4">Termux (ARM64)</p>
              <div className="space-y-2">
                <Link 
                  href="/docs/installation/android"
                  className="block w-full py-2 px-4 rounded-md bg-[#8e2de2] text-white font-medium text-center hover:bg-[#7a1fc9] transition-colors text-sm"
                >
                  View Guide
                </Link>
                <code className="block p-2 rounded bg-black/50 text-xs text-zinc-400 font-mono">
                  pkg install proot && termux-chroot
                </code>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-sm mb-4">
              Want to build from source or need a different architecture?
            </p>
            <Link 
              href="/docs/installation/source"
              className="inline-flex items-center gap-2 text-[#0df2c9] hover:text-white transition-colors font-medium"
            >
              View source installation guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-zinc-500">
        <p>Built with Next.js, Go and ❤️ by the MalikClaw Community.</p>
        <p className="mt-2 text-xs">© 2026 Muhammad Abdullah Athar</p>
      </footer>
    </div>
  );
}
