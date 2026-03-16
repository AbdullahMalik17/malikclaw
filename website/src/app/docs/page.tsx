import Link from "next/link";
import { ArrowRight, Book, Zap, Shield, MessageSquare } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Documentation</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Welcome to the MalikClaw documentation. Learn how to install, configure, and get the most out of your ultra-lightweight AI assistant.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <Link href="/docs/installation" className="p-6 rounded-xl bg-[#18181b] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group">
          <Book className="w-8 h-8 text-[#0df2c9] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">Installation</h3>
          <p className="text-zinc-400 text-sm">Step-by-step guides for Windows, macOS, Linux, and Android</p>
        </Link>

        <Link href="/docs/quick-start" className="p-6 rounded-xl bg-[#18181b] border border-white/5 hover:border-[#8e2de2]/50 transition-colors group">
          <Zap className="w-8 h-8 text-[#8e2de2] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">Quick Start</h3>
          <p className="text-zinc-400 text-sm">Get your AI assistant running in under 5 minutes</p>
        </Link>

        <Link href="/docs/configuration" className="p-6 rounded-xl bg-[#18181b] border border-white/5 hover:border-[#0df2c9]/50 transition-colors group">
          <Shield className="w-8 h-8 text-[#0df2c9] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">Configuration</h3>
          <p className="text-zinc-400 text-sm">Set up API keys, models, and customize settings</p>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Getting Started</h2>
      <ul className="space-y-3">
        <li>• <Link href="/docs/installation" className="text-[#0df2c9] hover:underline">Installation Guide</Link> - Install MalikClaw on your platform</li>
        <li>• <Link href="/docs/quick-start" className="text-[#0df2c9] hover:underline">Quick Start</Link> - Configure and run your first agent</li>
        <li>• <Link href="/docs/configuration" className="text-[#0df2c9] hover:underline">Configuration</Link> - Set up API keys and models</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Core Concepts</h2>
      <ul className="space-y-3">
        <li>• <Link href="/docs/architecture" className="text-[#0df2c9] hover:underline">Architecture</Link> - Understand how MalikClaw works</li>
        <li>• <Link href="/docs/providers" className="text-[#0df2c9] hover:underline">Providers & Models</Link> - Configure LLM providers</li>
        <li>• <Link href="/docs/security" className="text-[#0df2c9] hover:underline">Security</Link> - Security features and best practices</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Channels</h2>
      <p className="text-zinc-400">Connect MalikClaw to your favorite messaging platforms:</p>
      <ul className="space-y-3">
        <li>• <Link href="/docs/channels/telegram" className="text-[#0df2c9] hover:underline">Telegram</Link> - Easy setup with just a bot token</li>
        <li>• <Link href="/docs/channels/discord" className="text-[#0df2c9] hover:underline">Discord</Link> - Integrate with your Discord server</li>
        <li>• <Link href="/docs/channels/whatsapp" className="text-[#0df2c9] hover:underline">WhatsApp</Link> - Native WhatsApp support via whatsmeow</li>
      </ul>

      <div className="mt-12 p-6 rounded-xl bg-[#18181b] border border-white/5">
        <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
        <p className="text-zinc-400 mb-4">
          If you can&apos;t find what you&apos;re looking for, check out these resources:
        </p>
        <div className="flex flex-wrap gap-3">
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
          >
            GitHub Repository
          </a>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw/issues" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
          >
            Report an Issue
          </a>
        </div>
      </div>
    </div>
  );
}
