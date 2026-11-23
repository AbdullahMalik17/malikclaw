import { ReactNode } from "react";
import Link from "next/link";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { name: "Introduction", href: "/docs" },
      { name: "Installation", href: "/docs/installation" },
      { name: "Quick Start", href: "/docs/quick-start" },
      { name: "Build from Source", href: "/docs/installation/source" },
      { name: "Docker Deployment", href: "/docs/deployment/docker" },
      { name: "Mobile Operation", href: "/docs/mobile-operation" },
      { name: "Troubleshooting", href: "/docs/troubleshooting" },
      { name: "Debug Guide", href: "/docs/debug" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { name: "Architecture", href: "/docs/architecture" },
      { name: "Configuration", href: "/docs/configuration" },
      { name: "Provider & Models", href: "/docs/providers" },
      { name: "Smart Model Routing", href: "/docs/routing" },
      { name: "Security Sandbox", href: "/docs/security" },
    ],
  },
  {
    title: "Channels",
    items: [
      { name: "WhatsApp", href: "/docs/channels/whatsapp" },
      { name: "Telegram", href: "/docs/channels/telegram" },
      { name: "Discord", href: "/docs/channels/discord" },
      { name: "Slack", href: "/docs/channels/slack" },
      { name: "Feishu", href: "/docs/channels/feishu" },
      { name: "DingTalk", href: "/docs/channels/dingtalk" },
      { name: "Matrix", href: "/docs/channels/matrix" },
      { name: "Line", href: "/docs/channels/line" },
      { name: "QQ", href: "/docs/channels/qq" },
      { name: "WeCom", href: "/docs/channels/wecom" },
      { name: "OneBot", href: "/docs/channels/onebot" },
      { name: "MaixCam", href: "/docs/channels/maixcam" },
    ],
  },
  {
    title: "AntiGravity",
    items: [
      { name: "Authentication", href: "/docs/antigravity/auth" },
      { name: "Usage Guide", href: "/docs/antigravity/usage" },
    ],
  },
];

function sectionId(title: string) {
  return `docs-nav-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-amber-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-card-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter text-foreground">MalikClaw</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 text-xs font-medium border border-amber-500/25">
              Docs
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-text-muted hover:text-foreground transition-colors">Back to Site</Link>
            <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="text-sm font-medium text-text-muted hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-24 flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-e border-card-border pe-8 h-[calc(100vh-6rem)] overflow-y-auto sticky top-24 
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-border-strong
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-amber-500/60">
          <nav aria-label="Documentation sections" className="space-y-8 pb-12">
            {sidebarItems.map((section) => (
              <div key={section.title} className="space-y-3">
                <p id={sectionId(section.title)} className="text-xs font-bold uppercase tracking-widest text-text-muted">{section.title}</p>
                <ul className="space-y-2" aria-labelledby={sectionId(section.title)}>
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-text-muted hover:text-amber-700 dark:hover:text-gryphon-gold transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl pb-24 min-w-0">
          <details className="lg:hidden mb-8 rounded-2xl bg-card-bg border border-card-border">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              Browse documentation sections
              <span className="text-amber-700 dark:text-amber-400 text-xs font-mono group-open:rotate-180" aria-hidden="true">▾</span>
            </summary>
            <nav aria-label="Documentation sections" className="px-5 pb-5 pt-1 space-y-6 border-t border-card-border">
              {sidebarItems.map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted mt-4 mb-2">{section.title}</p>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="block text-sm text-text-muted hover:text-amber-700 dark:hover:text-gryphon-gold transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </details>

          {children}
        </main>
      </div>
    </div>
  );
}
