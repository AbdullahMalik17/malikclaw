"use client";

import Link from "next/link";
import { Github, Languages, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Language, translations } from "@/i18n/translations";
import { MALIKCLAW_VERSION } from "@/lib/version";

interface NavigationProps {
  isUrdu: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  availableLanguages?: Language[];
}

export default function Navigation({ 
  isUrdu, 
  language, 
  onLanguageChange,
  availableLanguages = ['en', 'ur', 'fr', 'ja', 'pt', 'vi'] as Language[]
}: NavigationProps) {
  const t = translations[language];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageCycle = () => {
    const currentIndex = availableLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    onLanguageChange(availableLanguages[nextIndex]);
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-black/90 backdrop-blur-md border-b border-zinc-800 transition-all duration-300">
      <div className="mx-auto px-4 sm:px-6 h-16 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-xl font-bold tracking-tighter text-white">MalikClaw</span>
          <span className="px-2 py-0.5 bg-gryphon-gold text-black text-xs font-bold uppercase tracking-wider">
            {MALIKCLAW_VERSION}
          </span>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 text-sm font-mono font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">{t.nav.features}</a>
          <a href="#download" className="hover:text-white transition-colors">{t.nav.download}</a>
          <Link href="/docs" className="hover:text-white transition-colors">{t.nav.docs}</Link>
        </div>

        {/* Desktop & Mobile Actions */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={handleLanguageCycle}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700 px-2.5 sm:px-3 py-1.5 bg-transparent"
            title={`Switch language (current: ${t.langSwitcher[language]})`}
          >
            <Languages className="w-4 h-4" />
            <span>{t.langSwitcher[language]}</span>
          </button>
          
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer" 
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-black bg-gryphon-gold hover:bg-white transition-colors px-4 py-2"
          >
            <Github className="w-4 h-4" />
            <span>{t.nav.starOnGitHub}</span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-gryphon-gold" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-zinc-800 px-6 py-6 font-mono flex flex-col gap-5 animate-in slide-in-from-top-4 duration-200">
          <a 
            href="#features" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base text-zinc-300 hover:text-gryphon-gold py-1 border-b border-zinc-800/50"
          >
            {t.nav.features}
          </a>
          <a 
            href="#download" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base text-zinc-300 hover:text-gryphon-gold py-1 border-b border-zinc-800/50"
          >
            {t.nav.download}
          </a>
          <Link 
            href="/docs" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base text-zinc-300 hover:text-gryphon-gold py-1 border-b border-zinc-800/50"
          >
            {t.nav.docs}
          </Link>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center gap-2 text-sm font-bold text-black bg-gryphon-gold hover:bg-white transition-colors px-4 py-3 mt-2"
          >
            <Github className="w-4 h-4" />
            <span>{t.nav.starOnGitHub}</span>
          </a>
        </div>
      )}
    </nav>
  );
}
