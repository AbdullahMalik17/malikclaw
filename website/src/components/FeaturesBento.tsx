"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Zap, Smartphone, Cpu, Layers, Terminal as TerminalIcon, Sparkles, Check, ArrowRight } from "lucide-react";
import { Language, translations } from "@/i18n/translations";
import ArchitectureFlow from "./ArchitectureFlow";

interface FeaturesBentoProps {
  language: Language;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function FeaturesBento({ language }: FeaturesBentoProps) {
  const t = translations[language];

  return (
    <section id="features" className="w-full py-20 relative font-mono scroll-mt-24">
      {/* Background Subtle Ambient Glows */}
      <div 
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Layers className="w-3.5 h-3.5" />
          <span>FEATURES BENTO 2.0</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          Built for Extreme Performance
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans">
          From &lt;10MB edge devices to enterprise AI clusters. Zero compromises with pure Go efficiency.
        </p>
      </motion.div>

      {/* Main Bento Grid 2.0 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-6xl mx-auto"
      >
        {/* Card 1: Autonomous Loop Visualizer (Wide 2-Column Card) */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-3 lg:col-span-2"
        >
          <ArchitectureFlow />
        </motion.div>

        {/* Card 2: Memory Footprint Benchmark (1-Column Card) */}
        <motion.div 
          variants={itemVariants}
          className="glass-card-interactive p-6 sm:p-7 rounded-2xl border border-white/[0.08] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                99% LESS RAM
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 text-white uppercase tracking-tight font-sans">
              8.4MB Memory Footprint
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              Unlike Python and Node.js AI frameworks that demand &gt;1.2GB RAM, MalikClaw is compiled to a lean, standalone Go binary.
            </p>

            {/* Visual RAM Comparison Bar */}
            <div className="space-y-3.5 bg-black/50 p-4 rounded-xl border border-white/[0.06]">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    MalikClaw (Go Native)
                  </span>
                  <span className="font-bold text-amber-400">8.4 MB</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "4%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5 text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
                    Python / LangChain / Node Gateway
                  </span>
                  <span>1.2 GB</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "96%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-zinc-700 rounded-full" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
            <span>Hardware Efficiency</span>
            <span className="text-amber-400 font-bold">Runs on $10 RISC-V SBC</span>
          </div>
        </motion.div>

        {/* Card 3: Android Remote & ADB Automation (Wide 2-Column Card) */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-3 lg:col-span-2 glass-card-interactive p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between group"
        >
          <div className="flex-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white uppercase tracking-tight font-sans">
              Android Remote & ADB Automation
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4 font-sans max-w-md">
              Automate taps, inspect UI elements with real-time OCR matrices, and orchestrate headless tasks across mobile devices and Termux.
            </p>
            <div className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Native ADB Daemon • Minicap Streaming • OCR Matrix Diffing</span>
            </div>
          </div>

          {/* Mini Mobile Mock Screen Simulation */}
          <div className="w-full sm:w-72 bg-zinc-950/90 p-4 rounded-xl border border-white/10 text-xs font-mono shrink-0 shadow-2xl">
            <div className="text-zinc-500 mb-3 border-b border-white/[0.06] pb-2 flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ADB: 192.168.1.104
              </span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                CONNECTED
              </span>
            </div>
            <div className="space-y-1.5 text-zinc-400 text-[11px]">
              <div className="text-cyan-300">$ adb shell input tap 450 1200</div>
              <div className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Tap event dispatched (14ms)
              </div>
              <div className="text-cyan-300">$ adb exec-out screencap -p</div>
              <div className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> OCR matrix match: 99.8%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Urdu-First Regional AI Card (1-Column Card) */}
        <motion.div 
          variants={itemVariants}
          className="glass-card-interactive p-6 sm:p-7 rounded-2xl border border-white/[0.08] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                REGIONAL AI 🇵🇰
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 text-white uppercase tracking-tight font-sans">
              Urdu-First Strategy
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              Native RTL interface parsing, Urdu prompt understanding, and deep optimization for South Asian developer ecosystems.
            </p>
          </div>

          <div className="bg-black/60 p-4 rounded-xl border border-white/[0.06] text-center">
            <span className="text-urdu-gold font-urdu text-2xl font-bold leading-relaxed block tracking-wide">
              "آگے بڑھو، ملک کلاؤ!"
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mt-2 font-mono">
              Bilingual Edge Intelligence Engine
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
