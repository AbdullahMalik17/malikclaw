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
        <div className="absolute top-0 md:top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-gryphon-gold/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-0 left-1/3 w-72 md:w-96 h-72 md:h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: "4s" }}></div>
      </div>
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
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <Zap className="w-4 h-4 text-gryphon-gold" />
          <span className="text-zinc-300 italic font-medium">
            {t.hero.tagline}
          </span>
        </motion.div>

        <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.1]">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-zinc-500">
            {t.hero.title}
          </span>
        </motion.h1>

        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="text-xl md:text-2xl text-zinc-400 max-w-3xl mt-2 leading-relaxed font-medium">
          {t.hero.subtitle}
          <span className="text-gryphon-gold font-bold block mt-3 opacity-90">{t.hero.specs}</span>
        </motion.p>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, delay: 0.2 } } }} className="mt-12 w-full max-w-3xl relative hidden md:block">
          <div className="absolute inset-0 bg-gryphon-gold/10 blur-[100px] rounded-full" />
          <NeuralLoop />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} 
          className="mt-12 w-full max-w-lg relative group/code cursor-pointer"
          onClick={handleCopy}
        >
          {/* Animated glowing border background */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gryphon-gold to-blue-500 rounded-2xl opacity-20 group-hover/code:opacity-60 group-hover/code:blur-md transition duration-500"></div>
          
          <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 p-3 flex items-center justify-between shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gryphon-gold/5 via-transparent to-blue-500/5 opacity-0 group-hover/code:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center gap-3 px-4 relative z-10">
              <span className="text-gryphon-gold font-mono font-bold select-none text-lg animate-pulse">$</span>
              <code className="text-zinc-200 font-mono text-sm sm:text-base">
                curl -sSL https://malikclaw.sh | bash
              </code>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-zinc-400 group-hover/code:text-white group-hover/code:bg-white/10 transition-all border border-transparent group-hover/code:border-white/10 relative z-10">
              {isCopied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="flex flex-col sm:flex-row gap-5 mt-10 w-full sm:w-auto relative z-10">
          <Link 
            href="/docs/installation" 
            className="group relative flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-gradient-to-r from-gryphon-gold to-yellow-400 text-black font-extrabold transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
            <span className="relative z-10 flex items-center gap-2 text-lg">
              {t.nav.launchMalikClaw} <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>
          <a 
            href="https://github.com/AbdullahMalik17/malikclaw" 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white font-bold transition-all hover:scale-[1.05] active:scale-95 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] text-lg"
          >
            <Github className="w-6 h-6 group-hover:text-blue-400 transition-colors" /> {t.nav.exploreSource}
          </a>
        </motion.div>
      </motion.div>

      {/* Interactive Terminal Demo */}
      <TerminalDemo language={language} />
    </section>
  );
}
