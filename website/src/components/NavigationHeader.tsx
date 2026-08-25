"use client";

import Link from "next/link";
import { Github, Languages, Sun, Moon, Menu, X, Terminal, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { MALIKCLAW_VERSION } from "@/lib/version";
import { useGitHubStats } from "@/hooks/use-github-stats";

export interface NavigationProps {
  isUrdu: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  availableLanguages?: Language[];
}

export default function NavigationHeader({ 
  isUrdu, 
  language, 
  onLanguageChange,
  availableLanguages = ["en", "ur", "fr", "ja", "pt", "vi"] as Language[]
}: NavigationProps) {
  const t = translations[language];
  const { theme, setTheme } = useTheme();
  const { stars, isLoading: isGitHubLoading } = useGitHubStats();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("features");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageCycle = () => {
    const currentIndex = availableLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    onLanguageChange(availableLanguages[nextIndex]);
  };

  const navLinks = [
    { label: t.nav.features, href: "#features", id: "features" },
    { label: "Architecture", href: "#features", id: "architecture" },
    { label: "Benchmarks", href: "#benchmarks", id: "benchmarks" },
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 pointer-events-none font-mono">
      <nav className="w-full max-w-6xl rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] px-4 sm:px-6 h-15 flex items-center justify-between pointer-events-auto transition-all duration-300 hover:border-white/20">
        
        {/* Left: Brand Logo & Live Version Badge */}
        <Link href="/" className="flex items-center gap-2.5 font-mono group">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
            <span className="text-base select-none">🦅</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tighter text-white group-hover:text-amber-400 transition-colors font-sans">
              MalikClaw
            </span>
            <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
              {MALIKCLAW_VERSION}
            </span>
          </div>
        </Link>
        
        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 font-mono text-xs font-medium text-zinc-400 bg-black/40 px-2 py-1 rounded-xl border border-white/5">
          {navLinks.map((link) => {
            return link.isRoute ? (
              <Link
                key={link.id}
                href={link.href}
                className="px-3 py-1.5 rounded-lg hover:text-white transition-colors relative"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                className="px-3 py-1.5 rounded-lg hover:text-white transition-colors relative"
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Interactive Language Switcher */}
          <button
            onClick={handleLanguageCycle}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 hover:border-amber-500/40 rounded-lg px-2.5 py-1.5 bg-black/40 hover:bg-zinc-900 transition-all"
            title={`Switch language (current: ${t.langSwitcher[language]})`}
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{t.langSwitcher[language]}</span>
          </button>
          
          {/* GitHub Star Live Counter Badge */}
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer" 
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-black/40 hover:bg-zinc-900 border border-white/10 hover:border-amber-500/40 rounded-lg px-3 py-1.5 transition-all group"
            title="Star MalikClaw on GitHub"
          >
            <Github className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
            <span>Star</span>
            <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-300 rounded border border-amber-500/30 text-[10px]">
              {isGitHubLoading ? "★" : `${stars.toLocaleString()} ★`}
            </span>
          </a>

          {/* Quick Install High-Contrast Button */}
          <button
            onClick={scrollToInstall}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 rounded-lg px-3.5 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.02]"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Quick Install</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white md:hidden rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 bg-zinc-950/95 border border-white/10 rounded-2xl p-5 font-mono shadow-2xl backdrop-blur-2xl md:hidden pointer-events-auto flex flex-col gap-3"
          >
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-white/[0.06] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-white/[0.06] transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={(e) => {
                  scrollToInstall(e);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 py-2.5 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                <Terminal className="w-4 h-4" />
                <span>Quick Install</span>
              </button>
              <a 
                href="https://github.com/AbdullahMalik17/malikclaw" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-200 bg-zinc-900 border border-white/10 py-2.5 rounded-xl hover:border-amber-500/40 transition-colors"
              >
                <Github className="w-4 h-4 text-amber-400" />
                <span>Star on GitHub ({stars.toLocaleString()} ★)</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
