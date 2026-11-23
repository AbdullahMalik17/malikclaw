"use client";

import Link from "next/link";
import { Github, Languages, Sun, Moon, Menu, X, Terminal, Star } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { MALIKCLAW_VERSION } from "@/lib/version";
import { useGitHubStats } from "@/hooks/use-github-stats";
import BrandMark from "./BrandMark";

export interface NavigationProps {
  isUrdu: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  availableLanguages?: Language[];
}

const emptySubscribe = () => () => {};

export default function NavigationHeader({
  isUrdu,
  language,
  onLanguageChange,
  availableLanguages = ["en", "ur", "fr", "ja", "pt", "vi"] as Language[],
}: NavigationProps) {
  const t = translations[language];
  const { theme, setTheme } = useTheme();
  const { stars, isLoading: isGitHubLoading } = useGitHubStats();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageCycle = () => {
    const currentIndex = availableLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    onLanguageChange(availableLanguages[nextIndex]);
  };

  const navLinks = [
    { label: t.nav.era, href: "#agentic-era", id: "agentic-era" },
    { label: t.nav.features, href: "#features", id: "features" },
    { label: t.nav.benchmarks, href: "#benchmarks", id: "benchmarks" },
    { label: t.nav.docs, href: "/docs", id: "docs", isRoute: true },
    { label: t.nav.download, href: "#download", id: "download" },
  ];

  const scrollToInstall = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("quick-install");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <header dir={isUrdu ? "rtl" : "ltr"} className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 pointer-events-none font-mono">
      <nav className="w-full max-w-6xl rounded-2xl bg-surface-1/90 backdrop-blur-xl border border-card-border shadow-lg dark:shadow-[0_0_40px_rgba(0,0,0,0.8)] px-4 sm:px-6 h-15 flex items-center justify-between pointer-events-auto transition-colors duration-300 hover:border-border-strong">

        {/* Left: Brand Logo & Live Version Badge */}
        <Link href="/" className="flex items-center gap-2.5 font-mono group">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 transition-colors group-hover:border-amber-500/60">
            <BrandMark className="h-[18px] w-[18px]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tighter text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors font-sans">
              MalikClaw
            </span>
            <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded-md tabular-nums">
              {MALIKCLAW_VERSION}
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 font-mono text-xs font-medium text-text-muted bg-surface-2/80 px-2 py-1 rounded-xl border border-card-border">
          {navLinks.map((link) => {
            return link.isRoute ? (
              <Link
                key={link.id}
                href={link.href}
                className="px-3 py-1.5 rounded-lg hover:text-foreground transition-colors relative"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className="px-3 py-1.5 rounded-lg hover:text-foreground transition-colors relative"
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: Actions, Language Toggle, Stars Counter, Quick Install */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono">
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-text-muted hover:text-foreground rounded-lg hover:bg-surface-2 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" /> : <Moon className="w-4 h-4 text-foreground" aria-hidden="true" />}
            </button>
          )}

          {/* Interactive Language Switcher */}
          <button
            type="button"
            onClick={handleLanguageCycle}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-card-border hover:border-amber-500/50 rounded-lg px-2.5 py-1.5 bg-surface-2/80 hover:bg-surface-2 transition-colors"
            title={`Switch language (current: ${t.langSwitcher[language]})`}
            aria-label={`Switch language (current: ${t.langSwitcher[language]})`}
          >
            <Languages className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
            <span className="font-semibold">{t.langSwitcher[language]}</span>
          </button>

          {/* GitHub Star Live Counter Badge */}
          <a
            href="https://github.com/AbdullahMalik17/malikclaw"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-foreground bg-surface-2/80 hover:bg-surface-2 border border-card-border hover:border-amber-500/50 rounded-lg px-3 py-1.5 transition-colors group"
            title={t.nav.starOnGitHub}
          >
            <Github className="w-3.5 h-3.5 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors" aria-hidden="true" />
            <span>{t.nav.star}</span>
            <span className="px-1.5 py-0.2 bg-amber-500/15 text-amber-800 dark:text-amber-300 rounded border border-amber-500/30 text-[10px] tabular-nums inline-flex items-center gap-1">
              {isGitHubLoading ? (
                <>
                  <Star className="w-3 h-3 opacity-50 animate-pulse" aria-hidden="true" />
                  <span>—</span>
                </>
              ) : (
                <>
                  <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                  <span>{stars.toLocaleString()}</span>
                </>
              )}
            </span>
          </a>

          {/* Quick Install High-Contrast Button */}
          <button
            type="button"
            onClick={scrollToInstall}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 active:scale-[0.98] rounded-lg px-3.5 py-1.5 shadow-sm dark:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
          >
            <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.nav.quickInstall}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-text-muted hover:text-foreground md:hidden rounded-lg hover:bg-surface-2 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 bg-surface-1/95 border border-card-border rounded-2xl p-5 font-mono shadow-2xl backdrop-blur-2xl md:hidden pointer-events-auto flex flex-col gap-3"
          >
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-amber-700 dark:hover:text-amber-400 py-2 border-b border-card-border transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-amber-700 dark:hover:text-amber-400 py-2 border-b border-card-border transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  scrollToInstall(e);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 active:scale-[0.98] py-2.5 rounded-xl transition-all"
              >
                <Terminal className="w-4 h-4" aria-hidden="true" />
                <span>{t.nav.quickInstall}</span>
              </button>
              <a
                href="https://github.com/AbdullahMalik17/malikclaw"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-bold text-foreground bg-surface-2 border border-card-border py-2.5 rounded-xl hover:border-amber-500/40 transition-colors tabular-nums"
              >
                <Github className="w-4 h-4 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span className="inline-flex items-center gap-1">
                  <span>{t.nav.starOnGitHub}</span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    (<Star className="w-3 h-3 fill-current" aria-hidden="true" />
                    {stars.toLocaleString()})
                  </span>
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
