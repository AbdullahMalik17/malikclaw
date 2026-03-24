"use client";

import Link from "next/link";
import { Github, Languages } from "lucide-react";
import { Language, translations } from "@/i18n/translations";

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

  const handleLanguageCycle = () => {
    const currentIndex = availableLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    onLanguageChange(availableLanguages[nextIndex]);
  };

  return (
    <nav className="fixed w-full sm:w-[95%] max-w-6xl z-50 top-4 left-1/2 -translate-x-1/2 transition-all duration-300 px-4 sm:px-0">
      <div className="mx-auto px-6 h-16 flex items-center justify-between rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-gryphon-gold/20 hover:bg-[#111111]/90 transition-all">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">MalikClaw 🦅</span>
          <span className="px-2 py-0.5 rounded-full bg-gryphon-gold/10 text-gryphon-gold text-xs font-bold border border-gryphon-gold/20">
            v0.2.1
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">{t.nav.features}</a>
          <a href="#download" className="hover:text-white transition-colors">{t.nav.download}</a>
          <Link href="/docs" className="hover:text-white transition-colors">{t.nav.docs}</Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLanguageCycle}
            className="flex items-center gap-2 text-sm font-medium text-gryphon-gold hover:text-white transition-colors border border-gryphon-gold/20 px-3 py-1.5 rounded-full bg-gryphon-gold/5"
            title={`Switch language (current: ${t.langSwitcher[language]})`}
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">{t.langSwitcher[language]}</span>
          </button>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-gryphon-gold transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline">{t.nav.starOnGitHub}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
