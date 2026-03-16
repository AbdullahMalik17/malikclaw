import { ReactNode } from "react";
import Link from "next/link";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { name: "Introduction", href: "/docs" },
      { name: "Installation", href: "/docs/installation" },
      { name: "Windows", href: "/docs/installation/windows" },
      { name: "macOS", href: "/docs/installation/macos" },
      { name: "Linux", href: "/docs/installation/linux" },
      { name: "Android", href: "/docs/installation/android" },
      { name: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { name: "Architecture", href: "/docs/architecture" },
      { name: "Provider & Models", href: "/docs/providers" },
      { name: "Security Sandbox", href: "/docs/security" },
    ],
  },
  {
    title: "Channels",
    items: [
      { name: "WhatsApp", href: "/docs/channels/whatsapp" },
      { name: "Telegram", href: "/docs/channels/telegram" },
      { name: "Discord", href: "/docs/channels/discord" },
    ],
  },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-[#0df2c9]/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter text-white">MalikClaw</span>
            <span className="px-2 py-0.5 rounded-full bg-[#0df2c9]/10 text-[#0df2c9] text-xs font-medium border border-[#0df2c9]/20">
              Docs
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Back to Site</Link>
            <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-24 flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-white/5 pr-8 h-[calc(100vh-6rem)] overflow-y-auto sticky top-24">
          <div className="space-y-8 pb-12">
            {sidebarItems.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-zinc-400 hover:text-[#0df2c9] transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl pb-24 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
