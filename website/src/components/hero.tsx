"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { Check, Copy, ArrowRight, Github, Zap, Shield, Cpu, Sparkles, Terminal, HardDrive } from "lucide-react";
import TerminalDemo from "./terminal-demo";

interface HeroProps {
  language: Language;
}

export default function Hero({ language }: HeroProps) {
  const t = translations[language];
  const isRTL = language === 'ur';
  const [activeTab, setActiveTab] = useState<'curl' | 'docker' | 'termux'>('curl');
  const [isCopied, setIsCopied] = useState(false);

  const commands = {
    curl: "curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash",
    docker: "docker run -d --name malikclaw -p 8080:8080 malikclaw/core:latest",
    termux: "pkg install golang && go install github.com/AbdullahMalik17/malikclaw@latest",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[activeTab]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  const stats = [
    {
      icon: Cpu,
      value: "< 10MB",
      label: "RAM Footprint",
      color: "text-amber-400",
      border: "border-amber-500/20",
    },
    {
      icon: Zap,
      value: "< 1s",
      label: "Cold Start Boot",
      color: "text-blue-400",
      border: "border-blue-500/20",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Privacy & Local AI",
      color: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      icon: HardDrive,
      value: "$10",
      label: "SBC / Edge Hardware",
      color: "text-purple-400",
      border: "border-purple-500/20",
    },
  ];

  return (
    <section className="relative flex flex-col items-center text-center mt-12 mb-20 max-w-6xl mx-auto px-4 sm:px-6 font-mono">
      {/* Dynamic Glow Spotlight */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-blue-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
          },
        }}
        className="flex flex-col items-center gap-6 w-full relative z-10"
      >
        {/* Animated Badges Header */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-wrap items-center justify-center gap-3 mb-2"
        >
          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="tracking-wide uppercase">v0.2.3 • Production Ready</span>
          </div>

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-xs font-medium text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase tracking-wider">{t.hero.tagline}</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground max-w-4xl"
        >
          <span>{t.hero.title}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          className="text-base sm:text-xl text-zinc-400 max-w-2.5xl mt-1 leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Quick Copyable Command Widget */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-6 w-full max-w-2xl relative"
        >
          <div className="glass-panel rounded-xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(234,179,8,0.12)]">
            {/* Command Widget Header Tabs */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-zinc-400 font-mono font-medium">Quick Install</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setActiveTab('curl')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'curl' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Bash / cURL
                </button>
                <button
                  onClick={() => setActiveTab('docker')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'docker' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Docker
                </button>
                <button
                  onClick={() => setActiveTab('termux')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'termux' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Android Termux
                </button>
              </div>
            </div>

            {/* Command Input Area */}
            <div 
              onClick={handleCopy}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer group bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-x-auto min-w-0 font-mono text-xs sm:text-sm">
                <span className="text-amber-400 font-bold select-none text-base shrink-0">$</span>
                <code className="text-zinc-200 break-all select-all font-mono">
                  {commands[activeTab]}
                </code>
              </div>
              <button
                type="button"
                className="shrink-0 p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 group-hover:text-amber-400 group-hover:border-amber-500/40 transition-all flex items-center gap-1.5"
                title="Copy command"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs font-medium hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto"
        >
          <Link
            href="/docs/installation"
            className="group relative flex items-center justify-center gap-2.5 h-13 px-8 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:shadow-[0_0_35px_rgba(234,179,8,0.5)]"
          >
            <span>{t.nav.launchMalikClaw}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://github.com/AbdullahMalik17/malikclaw"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 h-13 px-8 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-600 text-foreground font-bold uppercase tracking-wider rounded-xl transition-all duration-300 backdrop-blur-md hover:bg-zinc-800/80"
          >
            <Github className="w-5 h-5 text-amber-400" />
            <span>{t.nav.exploreSource}</span>
          </a>
        </motion.div>

        {/* Quick Stat Counters Bar */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-10 w-full max-w-4xl"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`glass-card p-4 rounded-xl border ${stat.border} flex flex-col items-center justify-center text-center relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className={`text-xl sm:text-2xl font-black tracking-tight ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-medium tracking-wide">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Interactive Terminal Demo Section */}
      <div className="mt-14 w-full flex justify-center">
        <TerminalDemo language={language} />
      </div>
    </section>
  );
}

