"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { ArrowRight, Github, Zap, Shield, Cpu, Sparkles, HardDrive, MessageCircle, Terminal, BookOpen } from "lucide-react";
import QuickInstall from "./QuickInstall";

interface HeroSectionProps {
  language: Language;
}

export default function HeroSection({ language }: HeroSectionProps) {
  const t = translations[language];
  const isRTL = language === "ur";

  const statStyles = [
    {
      icon: Cpu,
      accent: "text-amber-700 dark:text-amber-400",
      border: "hover:border-amber-500/50",
      glow: "group-hover:shadow-[0_0_24px_rgba(245,158,11,0.14)]",
      badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    },
    {
      icon: Zap,
      accent: "text-emerald-700 dark:text-emerald-400",
      border: "hover:border-emerald-500/50",
      glow: "group-hover:shadow-[0_0_24px_rgba(16,185,129,0.14)]",
      badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    },
    {
      icon: Shield,
      accent: "text-emerald-700 dark:text-emerald-400",
      border: "hover:border-emerald-500/50",
      glow: "group-hover:shadow-[0_0_24px_rgba(16,185,129,0.14)]",
      badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    },
    {
      icon: HardDrive,
      accent: "text-amber-700 dark:text-amber-400",
      border: "hover:border-amber-500/50",
      glow: "group-hover:shadow-[0_0_24px_rgba(245,158,11,0.14)]",
      badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative flex flex-col items-center text-center mt-6 sm:mt-10 mb-20 max-w-6xl mx-auto px-4 sm:px-6 w-full font-mono"
    >
      {/* Ambient Cyber Beams and Radial Background Gradients */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 amber-ambient-glow pointer-events-none"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="flex flex-col items-center gap-6 w-full relative z-10"
      >
        {/* Animated Version and Live State Badges */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-1"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600 dark:bg-amber-500" />
            </span>
            <span className="tracking-wider uppercase tabular-nums">{t.hero.badgeVersion}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-1 border border-card-border backdrop-blur-xl text-xs font-medium text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
            <span className="uppercase tracking-wider">{t.hero.badgeEveryday}</span>
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className={`text-[clamp(2.5rem,5vw+1rem,4.75rem)] font-extrabold text-balance text-foreground max-w-4xl font-display ${isRTL ? "font-urdu leading-[1.65]" : "leading-[1.05] tracking-[-0.03em]"}`}
        >
          <span className="text-gold-gradient block sm:inline">
            {t.hero.titlePart1}
          </span>{" "}
          <span className="text-foreground block sm:inline">
            {t.hero.titlePart2}
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className={`text-base sm:text-xl text-text-muted max-w-2xl leading-relaxed font-sans font-normal ${isRTL ? "font-urdu" : ""}`}
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Dual-Track Quick-Jump Strip */}
        <motion.nav
          aria-label="Audience quick navigation"
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full max-w-3xl"
        >
          <a
            href="#agentic-era"
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-1/90 border border-card-border hover:border-amber-500/50 text-xs text-foreground transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <span className="font-bold">{t.hero.tracks.everydayLabel}</span>
            <span className="hidden sm:inline text-text-muted">· {t.hero.tracks.everydayDesc}</span>
            <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
          </a>

          <a
            href="#benchmarks"
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-1/90 border border-card-border hover:border-amber-500/50 text-xs text-foreground transition-colors shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <span className="font-bold">{t.hero.tracks.devLabel}</span>
            <span className="hidden sm:inline text-text-muted">· {t.hero.tracks.devDesc}</span>
            <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
          </a>

          <Link
            href="/docs/architecture"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-2/80 border border-card-border hover:border-emerald-500/50 text-xs font-semibold text-text-muted hover:text-foreground transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{t.hero.tracks.archLink}</span>
          </Link>
        </motion.nav>

        {/* Interactive Quick Install Snippet */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="w-full mt-2"
        >
          <QuickInstall language={language} />
        </motion.div>

        {/* High-Conversion CTA Buttons */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto"
        >
          <Link
            href="/docs/installation"
            className="group relative flex items-center justify-center gap-2.5 h-12 px-8 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md dark:shadow-[0_0_25px_rgba(245,158,11,0.35)] w-full sm:w-auto"
          >
            <span>{t.nav.launchMalikClaw}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
          <a
            href="https://github.com/AbdullahMalik17/malikclaw"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 h-12 px-7 bg-surface-1 border border-card-border hover:border-amber-500/50 text-foreground font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 backdrop-blur-xl hover:bg-surface-2 active:scale-[0.98] w-full sm:w-auto"
          >
            <Github className="w-4 h-4 text-amber-700 dark:text-amber-400" aria-hidden="true" />
            <span>{t.nav.exploreSource}</span>
          </a>
        </motion.div>

        {/* Metrics Bento Strip */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-8 w-full max-w-5xl"
        >
          {t.hero.stats.map((stat, idx) => {
            const style = statStyles[idx % statStyles.length];
            const Icon = style.icon;
            return (
              <div
                key={stat.label}
                className={`glass-card p-4 sm:p-5 rounded-2xl ${style.border} ${style.glow} transition-all duration-200 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-default`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${style.badgeBg}`}>
                    <Icon className={`w-4 h-4 ${style.accent}`} aria-hidden="true" />
                  </div>
                  <span className={`text-lg sm:text-xl font-black tracking-tight tabular-nums ${style.accent}`}>
                    {stat.value}
                  </span>
                </div>
                <div className="text-xs font-bold text-foreground tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-text-muted mt-0.5 hidden sm:block">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
