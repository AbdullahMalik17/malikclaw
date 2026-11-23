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
      <div className="mb-14 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none"></div>
        <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight text-foreground">
          MalikClaw <span className="text-gold-gradient">Docs</span>
        </h1>
        <p className="relative text-xl text-text-muted max-w-2xl">
          Welcome to the MalikClaw v2.0.0 documentation. Learn how to install, configure, and get the most out of your ultra-lightweight AI assistant.
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6 tracking-tight text-foreground">Browse by Topic</h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-10 not-prose">
        <Link
          href="/docs/installation"
          className="group md:col-span-7 flex flex-col justify-between gap-6 p-8 rounded-3xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors duration-300 overflow-hidden"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-5">
              <Book className="w-6 h-6 text-amber-700 dark:text-amber-400" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Installation</h3>
            <p className="text-text-muted text-sm mb-5 max-w-md">
              Step-by-step guides for Windows, macOS, Linux, and Android — plus npm, winget, DEB/RPM, Docker and Termux.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Windows", "macOS", "Linux", "Android", "npm", "Docker"].map((platform) => (
                <span key={platform} className="px-2.5 py-1 rounded-lg bg-surface-2 border border-card-border text-xs font-medium text-text-muted">
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#0B0C10] border border-zinc-800 overflow-x-auto">
            <code className="text-xs text-zinc-100 font-mono block whitespace-nowrap">
              curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
            </code>
          </div>
        </Link>

        <div className="md:col-span-5 flex flex-col gap-5">
          <Link
            href="/docs/quick-start"
            className="group flex-1 p-6 rounded-3xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors duration-300 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                ~5 min
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Quick Start</h3>
            <p className="text-text-muted text-sm">Get your AI assistant running in under 5 minutes.</p>
            <ol className="mt-4 space-y-1.5 text-xs text-text-muted font-mono">
              <li>1. malikclaw onboard</li>
              <li>2. Add an API key</li>
              <li>3. malikclaw agent -m &quot;hello&quot;</li>
            </ol>
          </Link>

          <Link
            href="/docs/configuration"
            className="group p-6 rounded-3xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors duration-300 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Configuration</h3>
                <p className="text-text-muted text-sm">API keys, models, routing tiers &amp; sandbox settings.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-foreground">Getting Started</h2>
      <div className="space-y-3 not-prose">
        <Link href="/docs/installation" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><Book className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Installation Guide</span><span className="text-text-muted text-sm hidden sm:inline">- Install MalikClaw on your platform</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/quick-start" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Quick Start</span><span className="text-text-muted text-sm hidden sm:inline">- Configure and run your first agent</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/configuration" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Configuration</span><span className="text-text-muted text-sm hidden sm:inline">- Set up API keys and models</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/deployment/docker" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Docker Deployment</span><span className="text-text-muted text-sm hidden sm:inline">- Run containerized MalikClaw with Compose or GHCR</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-foreground">Core Concepts</h2>
      <div className="space-y-3 not-prose">
        <Link href="/docs/architecture" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Architecture</span><span className="text-text-muted text-sm hidden sm:inline">- Understand how MalikClaw works</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/providers" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Providers &amp; Models</span><span className="text-text-muted text-sm hidden sm:inline">- Configure LLM providers &amp; Ollama cost routing</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/routing" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Smart Model Routing</span><span className="text-text-muted text-sm hidden sm:inline">- 3-tier fast / balanced / reasoning cost router</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/security" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Security</span><span className="text-text-muted text-sm hidden sm:inline">- SSRF firewall, prompt-injection guard &amp; sandbox</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-4 tracking-tight text-foreground">Channels &amp; Integrations</h2>
      <p className="text-text-muted mb-6">Connect MalikClaw to your favorite messaging platforms:</p>
      <div className="space-y-3 not-prose">
        <Link href="/docs/channels/whatsapp" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">WhatsApp</span><span className="text-text-muted text-sm hidden sm:inline">- Native WhatsApp support via whatsmeow</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/telegram" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Telegram</span><span className="text-text-muted text-sm hidden sm:inline">- Easy setup with just a bot token</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/discord" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Discord</span><span className="text-text-muted text-sm hidden sm:inline">- Integrate with your Discord server</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/slack" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Slack</span><span className="text-text-muted text-sm hidden sm:inline">- Workspace bot integration &amp; Socket Mode</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/matrix" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Matrix</span><span className="text-text-muted text-sm hidden sm:inline">- Federated encrypted messaging</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/feishu" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Feishu</span><span className="text-text-muted text-sm hidden sm:inline">- Enterprise team messaging webhook &amp; bot</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
        <Link href="/docs/channels/dingtalk" className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /><span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">DingTalk</span><span className="text-text-muted text-sm hidden sm:inline">- DingTalk stream client integration</span></div><ArrowRight className="w-5 h-5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-16 p-8 md:p-10 rounded-[2rem] bg-card-bg border border-card-border relative overflow-hidden group not-prose">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
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
