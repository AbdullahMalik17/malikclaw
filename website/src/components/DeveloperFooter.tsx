"use client";

import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { ShieldCheck, Server, Github, Terminal, ArrowRight, BookOpen, MessageSquare, Sparkles, Heart } from "lucide-react";
import { MALIKCLAW_VERSION } from "@/lib/version";

export interface FooterProps {
  language: Language;
}

export default function DeveloperFooter({ language }: FooterProps) {
  const t = translations[language];

  const scrollToInstall = () => {
    const el = document.getElementById("quick-install");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <footer className="w-full font-mono relative mt-20">
      {/* High-Conversion CTA Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-500/15 via-zinc-950/90 to-zinc-950 border border-amber-500/30 p-8 sm:p-12 text-center shadow-[0_0_60px_rgba(245,158,11,0.15)] backdrop-blur-2xl">
          
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/20 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col items-center gap-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>START BUILDING IN SECONDS</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Deploy MalikClaw on your Raspberry Pi or Server in 60 seconds.
            </h3>

            <p className="text-zinc-400 text-sm sm:text-base font-sans">
              Experience the power of a Go-native autonomous agent running with &lt;10MB RAM on local hardware.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-4 w-full sm:w-auto">
              <button
                onClick={scrollToInstall}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold uppercase tracking-wider text-xs shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02]"
              >
                <Terminal className="w-4 h-4" />
                <span>Quick Install</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/docs"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-amber-500/40 text-zinc-200 hover:text-white font-bold uppercase tracking-wider text-xs transition-all hover:bg-zinc-800"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Explore Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Developer Footer Links & Certifications */}
      <div className="border-t border-white/[0.08] bg-black/60 pt-12 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Brand & Bio */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🦅</span>
                <span className="text-lg font-bold text-white tracking-tight font-sans">MalikClaw</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  {MALIKCLAW_VERSION}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                The ultra-lightweight autonomous AI agent engine built in pure Go for high-performance servers down to $10 edge SBCs.
              </p>
              <div className="text-urdu-gold font-urdu text-base font-bold">
                "آگے بڑھو، ملک کلاؤ!"
              </div>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Resources</h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li>
                  <Link href="/docs" className="hover:text-amber-400 transition-colors">Documentation</Link>
                </li>
                <li>
                  <Link href="/docs/quickstart" className="hover:text-amber-400 transition-colors">Quick Start</Link>
                </li>
                <li>
                  <Link href="/docs/architecture" className="hover:text-amber-400 transition-colors">Architecture Flow</Link>
                </li>
                <li>
                  <Link href="/trust" className="hover:text-amber-400 transition-colors">Security & Trust</Link>
                </li>
                <li>
                  <Link href="/download" className="hover:text-amber-400 transition-colors">Binary Downloads</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Community & Ecosystem */}
            <div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Community</h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li>
                  <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Repository</span>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/AbdullahMalik17/malikclaw/discussions" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discussions</span>
                  </a>
                </li>
                <li>
                  <a href="https://mcpmarket.com/ko/server/malikclaw" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>MCP Market Listing</span>
                  </a>
                </li>
                <li>
                  <a href="https://a2as.org/certified/agents/abdullahmalik17/deep-research-age" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>A2AS Certified</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Standards & Compliance */}
            <div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Integrity</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-3">
                Zero-Trust local sandboxing, ed25519 signing, and Apache 2.0 / MIT open source licensing.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[11px] text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Go 1.24 Native Engine</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3 text-center sm:text-left">
            <div>
              © 2026 Muhammad Abdullah Athar. All rights reserved. 🦅 Swift. Strong. Secure.
            </div>
            <div className="flex items-center gap-1">
              <span>Crafted with Go, Next.js &</span>
              <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>by the MalikClaw Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
