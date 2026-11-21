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
  const isUrdu = language === "ur";

  const scrollToInstall = () => {
    const el = document.getElementById("quick-install");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <footer dir={isUrdu ? "rtl" : "ltr"} className="w-full font-mono relative mt-20">
      {/* High-Conversion CTA Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-card-bg border border-amber-500/30 p-8 sm:p-12 text-center shadow-xl dark:shadow-[0_0_60px_rgba(245,158,11,0.12)] backdrop-blur-2xl">

          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/15 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col items-center gap-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.footer.ctaBadge}</span>
            </div>

            <h3 className={`text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight font-sans ${isUrdu ? "font-urdu" : ""}`}>
              {t.footer.ctaTitle}
            </h3>

            <p className={`text-text-muted text-sm sm:text-base font-sans ${isUrdu ? "font-urdu" : ""}`}>
              {t.footer.ctaSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={scrollToInstall}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold uppercase tracking-wider text-xs shadow-md transition-all"
              >
                <Terminal className="w-4 h-4" aria-hidden="true" />
                <span>{t.footer.quickInstall}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
              </button>

              <Link
                href="/docs"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-surface-2 border border-card-border hover:border-amber-500/50 text-foreground font-bold uppercase tracking-wider text-xs transition-colors active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span>{t.footer.exploreDocs}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Developer Footer Links & Certifications */}
      <div className="border-t border-card-border bg-surface-1/85 pt-12 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

            {/* Column 1: Brand & Bio */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl" aria-hidden="true">🦅</span>
                <span className="text-lg font-bold text-foreground tracking-tight font-sans">MalikClaw</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold tabular-nums">
                  {MALIKCLAW_VERSION}
                </span>
              </div>
              <p className={`text-xs text-text-muted leading-relaxed font-sans mb-4 ${isUrdu ? "font-urdu" : ""}`}>
                {t.footer.brandBio}
              </p>
              <div dir="rtl" className="text-urdu-gold font-urdu text-base font-bold">
                &ldquo;آگے بڑھو، ملک کلاؤ!&rdquo;
              </div>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">{t.footer.resourcesTitle}</h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <Link href="/docs" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">{t.footer.docLink}</Link>
                </li>
                <li>
                  <Link href="/docs/quick-start" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">{t.footer.quickStartLink}</Link>
                </li>
                <li>
                  <Link href="/docs/architecture" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">{t.footer.archLink}</Link>
                </li>
                <li>
                  <Link href="/trust" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">{t.footer.trustLink}</Link>
                </li>
                <li>
                  <Link href="/download" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">{t.footer.downloadLink}</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Community & Ecosystem */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">{t.footer.communityTitle}</h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.footer.githubRepo}</span>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/AbdullahMalik17/malikclaw/discussions" target="_blank" rel="noreferrer" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.footer.discussions}</span>
                  </a>
                </li>
                <li>
                  <a href="https://mcpmarket.com/server/malikclaw" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                    <span>{t.footer.mcpMarket}</span>
                  </a>
                </li>
                <li>
                  <a href="https://a2as.org/certified/agents/abdullahmalik17/deep-research-age" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    <span>{t.footer.a2as}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Standards & Compliance */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">{t.footer.integrityTitle}</h4>
              <p className={`text-xs text-text-muted leading-relaxed font-sans mb-3 ${isUrdu ? "font-urdu" : ""}`}>
                {t.footer.integrityDesc}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-card-border text-[11px] text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{t.footer.goEngine}</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 border-t border-card-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-3 text-center sm:text-start">
            <div>
              {t.footer.copyright}
            </div>
            <div className="flex items-center gap-1">
              <span>{t.footer.builtWith}</span>
              <Heart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 fill-amber-500" aria-hidden="true" />
              <span>MalikClaw Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
