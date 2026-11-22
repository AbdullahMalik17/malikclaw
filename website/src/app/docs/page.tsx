import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Book, Zap, Shield, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation — MalikClaw v2.0.0",
  description:
    "Official MalikClaw v2.0.0 documentation: quick start, platform installation, Smart Cost Router providers, SSRF + prompt-injection security, and 21 messaging channels.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Documentation — MalikClaw v2.0.0",
    description:
      "Guides for installing, configuring, and running MalikClaw v2.0.0 across laptops, $10 SBCs, Android Termux, and Docker.",
    url: "https://malikclaw.vercel.app/docs",
    images: [
      {
        url: "/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "MalikClaw v2.0.0 Documentation",
      },
    ],
  },
};

export default function DocsPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none pt-8">
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight text-foreground">
          MalikClaw <span className="text-gold-gradient">Docs</span>
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Welcome to the MalikClaw v2.0.0 documentation. Learn how to install, configure, and get the most out of your ultra-lightweight AI assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 not-prose">
        <Link href="/docs/installation" className="p-8 rounded-[2rem] bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors duration-300 group relative overflow-hidden shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-600/20 dark:border-[#0df2c9]/20 flex items-center justify-center mb-6 relative z-10">
            <Book className="w-7 h-7 text-teal-700 dark:text-[#0df2c9]" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">Installation</h3>
          <p className="text-text-muted text-sm relative z-10">Step-by-step guides for Windows, macOS, Linux, and Android</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors"></div>
        </Link>

        <Link href="/docs/quick-start" className="p-8 rounded-[2rem] bg-card-bg border border-card-border hover:border-purple-600/50 dark:hover:border-[#8e2de2]/50 transition-colors duration-300 group relative overflow-hidden shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-600/20 dark:border-[#8e2de2]/20 flex items-center justify-center mb-6 relative z-10">
            <Zap className="w-7 h-7 text-purple-700 dark:text-purple-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">Quick Start</h3>
          <p className="text-text-muted text-sm relative z-10">Get your AI assistant running in under 5 minutes</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
        </Link>

        <Link href="/docs/configuration" className="p-8 rounded-[2rem] bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors duration-300 group relative overflow-hidden shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-600/20 dark:border-[#fbbf24]/20 flex items-center justify-center mb-6 relative z-10">
            <Shield className="w-7 h-7 text-amber-700 dark:text-amber-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">Configuration</h3>
          <p className="text-text-muted text-sm relative z-10">Set up API keys, models, and customize settings</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors"></div>
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-foreground">Getting Started</h2>
      <div className="space-y-3 not-prose">
        <Link href="/docs/installation" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group">
          <div className="flex items-center gap-3"><Book className="w-5 h-5 text-teal-700 dark:text-[#0df2c9]" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors">Installation Guide</span><span className="text-text-muted text-sm hidden sm:inline">- Install MalikClaw on your platform</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/quick-start" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group">
          <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-teal-700 dark:text-[#0df2c9]" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors">Quick Start</span><span className="text-text-muted text-sm hidden sm:inline">- Configure and run your first agent</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/configuration" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group">
          <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-teal-700 dark:text-[#0df2c9]" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors">Configuration</span><span className="text-text-muted text-sm hidden sm:inline">- Set up API keys and models</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/deployment/docker" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-teal-600/50 dark:hover:border-[#0df2c9]/50 transition-colors group">
          <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-teal-700 dark:text-[#0df2c9]" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors">Docker Deployment</span><span className="text-text-muted text-sm hidden sm:inline">- Run containerized MalikClaw with Compose or GHCR</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-teal-700 dark:group-hover:text-[#0df2c9] transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-foreground">Core Concepts</h2>
      <div className="space-y-3 not-prose">
        <Link href="/docs/architecture" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-purple-600/50 dark:hover:border-[#8e2de2]/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Architecture</span><span className="text-text-muted text-sm hidden sm:inline">- Understand how MalikClaw works</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/providers" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-purple-600/50 dark:hover:border-[#8e2de2]/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Providers &amp; Models</span><span className="text-text-muted text-sm hidden sm:inline">- Configure LLM providers &amp; Ollama cost routing</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/routing" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-purple-600/50 dark:hover:border-[#8e2de2]/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Smart Model Routing</span><span className="text-text-muted text-sm hidden sm:inline">- 3-tier fast / balanced / reasoning cost router</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/security" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-purple-600/50 dark:hover:border-[#8e2de2]/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Security</span><span className="text-text-muted text-sm hidden sm:inline">- SSRF firewall, prompt-injection guard &amp; sandbox</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-4 tracking-tight text-foreground">Channels &amp; Integrations</h2>
      <p className="text-text-muted mb-6">Connect MalikClaw to your favorite messaging platforms:</p>
      <div className="space-y-3 not-prose">
        <Link href="/docs/channels/whatsapp" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">WhatsApp</span><span className="text-text-muted text-sm hidden sm:inline">- Native WhatsApp support via whatsmeow</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/telegram" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Telegram</span><span className="text-text-muted text-sm hidden sm:inline">- Easy setup with just a bot token</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/discord" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Discord</span><span className="text-text-muted text-sm hidden sm:inline">- Integrate with your Discord server</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/slack" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Slack</span><span className="text-text-muted text-sm hidden sm:inline">- Workspace bot integration &amp; Socket Mode</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/matrix" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Matrix</span><span className="text-text-muted text-sm hidden sm:inline">- Federated encrypted messaging</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/feishu" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Feishu</span><span className="text-text-muted text-sm hidden sm:inline">- Enterprise team messaging webhook &amp; bot</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/dingtalk" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-600/50 dark:hover:border-[#fbbf24]/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">DingTalk</span><span className="text-text-muted text-sm hidden sm:inline">- DingTalk stream client integration</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-16 p-8 md:p-10 rounded-[2rem] bg-card-bg border border-card-border relative overflow-hidden group not-prose">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">Need Help?</h3>
        <p className="text-text-muted mb-6 text-lg">
          If you can&apos;t find what you&apos;re looking for, check out these resources:
        </p>
        <div className="flex flex-wrap gap-4">
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-1 text-foreground font-semibold hover:border-amber-500/60 transition-colors border border-card-border shadow-sm"
          >
            GitHub Repository
          </a>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw/issues" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors shadow-sm"
          >
            Report an Issue
          </a>
        </div>
      </div>
    </div>
  );
}
