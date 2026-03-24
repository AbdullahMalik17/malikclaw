import Link from "next/link";
import { ArrowRight, Book, Zap, Shield, MessageSquare } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="prose prose-invert max-w-none pt-8">
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0df2c9]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight">
          MalikClaw <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0df2c9] to-[#8e2de2]">Docs</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Welcome to the MalikClaw documentation. Learn how to install, configure, and get the most out of your ultra-lightweight AI assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
        <Link href="/docs/installation" className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-[#0df2c9]/30 transition-all duration-300 group relative overflow-hidden shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#0df2c9]/10 border border-[#0df2c9]/20 flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110">
            <Book className="w-7 h-7 text-[#0df2c9]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">Installation</h3>
          <p className="text-zinc-400 text-sm relative z-10">Step-by-step guides for Windows, macOS, Linux, and Android</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#0df2c9]/10 rounded-full blur-3xl group-hover:bg-[#0df2c9]/20 transition-colors"></div>
        </Link>

        <Link href="/docs/quick-start" className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-[#8e2de2]/30 transition-all duration-300 group relative overflow-hidden shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#8e2de2]/10 border border-[#8e2de2]/20 flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110">
            <Zap className="w-7 h-7 text-[#8e2de2]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">Quick Start</h3>
          <p className="text-zinc-400 text-sm relative z-10">Get your AI assistant running in under 5 minutes</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#8e2de2]/10 rounded-full blur-3xl group-hover:bg-[#8e2de2]/20 transition-colors"></div>
        </Link>

        <Link href="/docs/configuration" className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-[#fbbf24]/30 transition-all duration-300 group relative overflow-hidden shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110">
            <Shield className="w-7 h-7 text-[#fbbf24]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">Configuration</h3>
          <p className="text-zinc-400 text-sm relative z-10">Set up API keys, models, and customize settings</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#fbbf24]/10 rounded-full blur-3xl group-hover:bg-[#fbbf24]/20 transition-colors"></div>
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight">Getting Started</h2>
      <div className="space-y-3">
        <Link href="/docs/installation" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/30 transition-all group">
          <div className="flex items-center gap-3"><Book className="w-5 h-5 text-[#0df2c9]" /><span className="font-semibold text-white group-hover:text-[#0df2c9] transition-colors">Installation Guide</span><span className="text-zinc-500 text-sm hidden sm:inline">- Install MalikClaw on your platform</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#0df2c9] transition-colors" />
        </Link>
        <Link href="/docs/quick-start" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/30 transition-all group">
          <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-[#0df2c9]" /><span className="font-semibold text-white group-hover:text-[#0df2c9] transition-colors">Quick Start</span><span className="text-zinc-500 text-sm hidden sm:inline">- Configure and run your first agent</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#0df2c9] transition-colors" />
        </Link>
        <Link href="/docs/configuration" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#0df2c9]/30 transition-all group">
          <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-[#0df2c9]" /><span className="font-semibold text-white group-hover:text-[#0df2c9] transition-colors">Configuration</span><span className="text-zinc-500 text-sm hidden sm:inline">- Set up API keys and models</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#0df2c9] transition-colors" />
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight">Core Concepts</h2>
      <div className="space-y-3">
        <Link href="/docs/architecture" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#8e2de2]/30 transition-all group">
          <div className="flex items-center gap-3"><span className="font-semibold text-white group-hover:text-[#8e2de2] transition-colors">Architecture</span><span className="text-zinc-500 text-sm hidden sm:inline">- Understand how MalikClaw works</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#8e2de2] transition-colors" />
        </Link>
        <Link href="/docs/providers" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#8e2de2]/30 transition-all group">
          <div className="flex items-center gap-3"><span className="font-semibold text-white group-hover:text-[#8e2de2] transition-colors">Providers & Models</span><span className="text-zinc-500 text-sm hidden sm:inline">- Configure LLM providers</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#8e2de2] transition-colors" />
        </Link>
        <Link href="/docs/security" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#8e2de2]/30 transition-all group">
          <div className="flex items-center gap-3"><span className="font-semibold text-white group-hover:text-[#8e2de2] transition-colors">Security</span><span className="text-zinc-500 text-sm hidden sm:inline">- Security features and best practices</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#8e2de2] transition-colors" />
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-4 tracking-tight">Channels</h2>
      <p className="text-zinc-400 mb-6">Connect MalikClaw to your favorite messaging platforms:</p>
      <div className="space-y-3">
        <Link href="/docs/channels/telegram" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#fbbf24]/30 transition-all group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-[#fbbf24]" /><span className="font-semibold text-white group-hover:text-[#fbbf24] transition-colors">Telegram</span><span className="text-zinc-500 text-sm hidden sm:inline">- Easy setup with just a bot token</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#fbbf24] transition-colors" />
        </Link>
        <Link href="/docs/channels/discord" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#fbbf24]/30 transition-all group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-[#fbbf24]" /><span className="font-semibold text-white group-hover:text-[#fbbf24] transition-colors">Discord</span><span className="text-zinc-500 text-sm hidden sm:inline">- Integrate with your Discord server</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#fbbf24] transition-colors" />
        </Link>
        <Link href="/docs/channels/whatsapp" className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-[#fbbf24]/30 transition-all group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-[#fbbf24]" /><span className="font-semibold text-white group-hover:text-[#fbbf24] transition-colors">WhatsApp</span><span className="text-zinc-500 text-sm hidden sm:inline">- Native WhatsApp support via whatsmeow</span></div><ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#fbbf24] transition-colors" />
        </Link>
      </div>

      <div className="mt-16 p-8 md:p-10 rounded-[2rem] bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0df2c9]/30 to-transparent"></div>
        <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
        <p className="text-zinc-400 mb-6 text-lg">
          If you can&apos;t find what you&apos;re looking for, check out these resources:
        </p>
        <div className="flex flex-wrap gap-4">
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors border border-white/10 shadow-lg"
          >
            GitHub Repository
          </a>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw/issues" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0df2c9] text-black font-semibold hover:bg-[#0bc2a1] transition-colors shadow-[0_0_15px_rgba(13,242,201,0.2)]"
          >
            Report an Issue
          </a>
        </div>
      </div>
    </div>
  );
}
