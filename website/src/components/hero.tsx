"use client";

import { ArrowRight, Github, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import TerminalDemo from "./terminal-demo";

interface HeroProps {
  language: Language;
}

export default function Hero({ language }: HeroProps) {
  const t = translations[language];
  const isRTL = language === 'ur';

  return (
    <section className="flex flex-col items-center text-center mt-12 mb-24 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
          <Zap className="w-4 h-4 text-gryphon-gold" />
          <span className="text-zinc-300 italic font-medium">
            {t.hero.tagline}
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            {t.hero.title}
          </span>
          <br className="hidden sm:block" />
          <span className="text-gradient leading-relaxed italic animate-shimmer inline-block">
            آگے بڑھو، ملک کلاؤ! 🦅
          </span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mt-4 leading-relaxed">
          {t.hero.subtitle}
          <span className="text-gryphon-gold font-medium block mt-2 opacity-80">{t.hero.specs}</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
          <Link 
            href="/docs/installation" 
            className="group relative flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-gryphon-gold text-black font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(234,179,8,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 italic"></div>
            <span className="relative z-10 flex items-center gap-2">
              {t.nav.launchMalikClaw} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <Github className="w-5 h-5" /> {t.nav.exploreSource}
          </a>
        </div>
      </motion.div>

      {/* Interactive Terminal Demo */}
      <TerminalDemo language={language} />
    </section>
  );
}
