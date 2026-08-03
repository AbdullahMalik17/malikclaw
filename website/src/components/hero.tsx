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
    navigator.clipboard.writeText("curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative flex flex-col items-center text-center mt-24 mb-24 max-w-5xl mx-auto px-6 font-mono">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="flex flex-col items-center gap-6 w-full"
      >


        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-card-bg border border-card-border text-sm mb-2 text-text-muted">
          <Zap className="w-4 h-4 text-gryphon-gold" />
          <span className="font-medium uppercase tracking-wider">
            {t.hero.tagline}
          </span>
        </motion.div>

        <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-3.5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.15] text-white">
          <span>{t.hero.title}</span>
        </motion.h1>

        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mt-2 leading-relaxed">
          {t.hero.subtitle}
          <span className="text-gryphon-gold block mt-3 uppercase tracking-wider text-sm sm:text-base">{t.hero.specs}</span>
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-8 w-full max-w-lg relative group/code cursor-pointer"
          onClick={handleCopy}
        >
          <div className="relative bg-card-bg border border-card-border p-3.5 sm:p-4 flex items-center justify-between hover:border-gryphon-gold transition-colors overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto min-w-0 pr-2">
              <span className="text-gryphon-gold font-bold select-none text-base sm:text-lg shrink-0">$</span>
              <code className="text-foreground text-xs sm:text-base break-all">
                curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash
              </code>
            </div>
            <div className="text-text-muted group-hover/code:text-foreground transition-colors shrink-0">
              {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </div>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Link
            href="/docs/installation"
            className="flex items-center justify-center gap-2 h-14 px-10 bg-gryphon-gold text-black font-bold uppercase tracking-wider transition-colors hover:bg-white border border-transparent"
          >
            {t.nav.launchMalikClaw} <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com/AbdullahMalik17/malikclaw"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 h-14 px-10 bg-card-bg border border-card-border text-foreground font-bold uppercase tracking-wider transition-colors hover:border-foreground"
          >
            <Github className="w-5 h-5" /> {t.nav.exploreSource}
          </a>
        </motion.div>
      </motion.div>

      {/* Interactive Terminal Demo */}
      <div className="mt-16 w-full">
        <TerminalDemo language={language} />
      </div>
    </section>
  );
}
