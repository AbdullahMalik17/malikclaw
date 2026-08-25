"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { ArrowRight, Github, Zap, Shield, Cpu, Sparkles, HardDrive, Terminal } from "lucide-react";
import QuickInstall from "./QuickInstall";

interface HeroSectionProps {
  language: Language;
}

export default function HeroSection({ language }: HeroSectionProps) {
  const t = translations[language];
  const isRTL = language === "ur";

  const stats = [
    {
      icon: Cpu,
      value: "< 10MB",
      label: "RAM Footprint",
      sublabel: "99% lighter than Node/Python",
      accent: "text-amber-400",
      border: "hover:border-amber-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
      badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    },
    {
      icon: Zap,
      value: "< 1s",
      label: "Cold Start Boot",
      sublabel: "Instant Go compiled binary",
      accent: "text-cyan-400",
      border: "hover:border-cyan-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
      badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Local Privacy",
      sublabel: "Zero telemetry data leaks",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
      badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    },
    {
      icon: HardDrive,
      value: "$10",
      label: "SBC / Edge Cost",
      sublabel: "Runs on RISC-V & Pi Zero",
      accent: "text-purple-400",
      border: "hover:border-purple-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
      badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    },
  ];

  return (
    <section className="relative flex flex-col items-center text-center mt-6 sm:mt-10 mb-20 max-w-6xl mx-auto px-4 sm:px-6 w-full font-mono">
      {/* Ambient Cyber Beams and Radial Background Gradients */}
      <div 
        aria-hidden="true"
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-b from-amber-500/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" 
      />
      <div 
        aria-hidden="true"
        className="absolute top-48 left-1/4 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] pointer-events-none rounded-full"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="flex flex-col items-center gap-6 w-full relative z-10"
      >
        {/* Animated Version and Live State Badges */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-1"
        >
          {/* Live Production Ready Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl text-xs font-semibold text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="tracking-wider uppercase">v0.2.3 • Production Ready</span>
          </div>

          {/* Autonomous Edge Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 backdrop-blur-xl text-xs font-medium text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider">The Edge AI Champion</span>
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.08] text-white max-w-4xl"
        >
          <span className="text-gold-gradient block sm:inline">
            Empower Every Device
          </span>{" "}
          <span className="text-white block sm:inline">
            with Intelligence.
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          className="text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-sans font-normal"
        >
          Run autonomous AI agents on <strong className="text-amber-300 font-semibold">$10 edge hardware</strong> with{" "}
          <strong className="text-amber-300 font-semibold">&lt;10MB RAM</strong>. Pure Go-powered speed with local-first zero-trust privacy.
        </motion.p>

        {/* Interactive Quick Install Snippet */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="w-full mt-2"
        >
          <QuickInstall />
        </motion.div>

        {/* High-Conversion CTA Buttons */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto"
        >
          <Link
            href="/docs/installation"
            className="group relative flex items-center justify-center gap-2.5 h-12 px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.02] w-full sm:w-auto"
          >
            <span>{t.nav.launchMalikClaw}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://github.com/AbdullahMalik17/malikclaw"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 h-12 px-7 bg-zinc-900/90 border border-white/10 hover:border-amber-500/40 text-zinc-100 font-bold uppercase tracking-wider rounded-xl transition-all duration-300 backdrop-blur-xl hover:bg-zinc-800/90 hover:text-white w-full sm:w-auto"
          >
            <Github className="w-4 h-4 text-amber-400" />
            <span>{t.nav.exploreSource}</span>
          </a>
        </motion.div>

        {/* Metrics Bento Strip */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-8 w-full max-w-5xl"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`glass-card p-4 sm:p-5 rounded-2xl border border-white/[0.08] ${stat.border} ${stat.glow} transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-default`}
              >
                {/* Hover top glow accent line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${stat.badgeBg}`}>
                    <Icon className={`w-4 h-4 ${stat.accent}`} />
                  </div>
                  <span className={`text-xl sm:text-2xl font-black tracking-tight ${stat.accent}`}>
                    {stat.value}
                  </span>
                </div>
                <div className="text-xs font-bold text-zinc-200 tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 hidden sm:block">
                  {stat.sublabel}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
