"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { Check, Copy, ArrowRight, Github, Zap } from "lucide-react";
import TerminalDemo from "./terminal-demo";
import NeuralLoop from "./neural-loop";

interface HeroProps {
  language: Language;
}

export default function Hero({ language }: HeroProps) {
  const t = translations[language];
  const isRTL = language === 'ur';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("curl -sSL https://malikclaw.sh | bash");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative flex flex-col items-center text-center mt-12 mb-24 max-w-5xl mx-auto px-6">
      {/* Immersive Aurora Background */}
      <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none">
        <div className="absolute top-0 md:top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-gryphon-gold/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-0 left-1/3 w-72 md:w-96 h-72 md:h-96 bg-purple-500/15 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: "4s" }}></div>
      </div>
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

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40">
            {t.hero.title}
          </span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mt-4 leading-relaxed">
          {t.hero.subtitle}
          <span className="text-gryphon-gold font-medium block mt-2 opacity-80">{t.hero.specs}</span>
        </p>

        <div className="mt-16 w-full max-w-2xl relative">
          <div className="absolute inset-0 bg-gryphon-gold/5 blur-3xl rounded-full" />
          <NeuralLoop />
        </div>

        <div className="mt-12 w-full max-w-lg bg-[#111111]/80 backdrop-blur-md rounded-xl border border-white/10 p-2 flex items-center justify-between group/code transform transition hover:border-gryphon-gold/30">
          <div className="flex items-center gap-3 px-3">
            <span className="text-gryphon-gold font-mono font-bold select-none cursor-default">$</span>
            <code className="text-zinc-300 font-mono text-sm sm:text-base selection:bg-gryphon-gold/30">
              curl -sSL https://malikclaw.sh | bash
            </code>
          </div>
          <button 
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95 border border-white/5 group-hover/code:border-white/10"
            aria-label="Copy install command"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 mt-12 w-full sm:w-auto relative z-10">
          <Link 
            href="/docs/installation" 
            className="group relative flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-gradient-to-r from-gryphon-gold to-yellow-400 text-black font-extrabold transition-all hover:scale-[1.03] active:scale-95 shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_0_60px_rgba(234,179,8,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            <span className="relative z-10 flex items-center gap-2">
              {t.nav.launchMalikClaw} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-[#111111]/80 backdrop-blur-md border border-white/10 text-white font-semibold transition-all hover:scale-[1.03] active:scale-95 hover:border-blue-500/50 hover:bg-blue-500/5 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
          >
            <Github className="w-5 h-5 group-hover:text-blue-400 transition-colors" /> {t.nav.exploreSource}
          </a>
        </div>
      </motion.div>

      {/* Interactive Terminal Demo */}
      <TerminalDemo language={language} />
    </section>
  );
}
