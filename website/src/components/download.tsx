"use client";

import { Cpu, Globe, Smartphone, Terminal, Download as DownloadIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { useGitHubStats } from "@/hooks/use-github-stats";

interface DownloadProps {
  language: Language;
}

export default function Download({ language }: DownloadProps) {
  const t = translations[language];
  const isUrdu = language === "ur";
  const { stars, latestRelease, isLoading } = useGitHubStats();

  const platforms = [
    {
      name: t.download.windows,
      desc: t.download.windowsDesc,
      icon: Globe,
      color: "text-cyan-700 dark:text-cyan-400",
      border: "hover:border-cyan-500/45",
      btnText: t.download.downloadExe,
      href: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip",
      tag: "x86_64 / ARM64",
    },
    {
      name: t.download.linux,
      desc: t.download.linuxDesc,
      icon: Cpu,
      color: "text-amber-700 dark:text-amber-400",
      border: "hover:border-amber-500/45",
      btnText: t.download.downloadBinary,
      href: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz",
      tag: "ARM64 / RISC-V",
    },
    {
      name: t.download.android,
      desc: t.download.androidDesc,
      icon: Smartphone,
      color: "text-purple-700 dark:text-purple-400",
      border: "hover:border-purple-500/45",
      btnText: t.nav.setupGuide,
      href: "/docs/installation/android",
      tag: "Termux / Proot",
      isRoute: true,
    },
    {
      name: t.download.docker,
      desc: t.download.dockerDesc,
      icon: Terminal,
      color: "text-emerald-700 dark:text-emerald-400",
      border: "hover:border-emerald-500/45",
      btnText: "docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/home/malikclaw/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest",
      href: "/docs/deployment/docker",
      tag: t.download.containerTag,
      isCode: true,
    },
  ];

  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      dir={isUrdu ? "rtl" : "ltr"}
      className="w-full py-24 max-w-6xl mx-auto font-mono scroll-mt-24 px-4 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-4 shadow-sm">
          <DownloadIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.download.badge}</span>
        </div>
        <h2
          id="download-heading"
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isUrdu ? "font-urdu" : "uppercase"}`}
        >
          {t.download.title}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isUrdu ? "font-urdu" : ""}`}>
          {t.download.subtitle}
        </p>

        {/* GitHub Live Version & Stars Badge */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card-bg border border-card-border text-foreground">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{t.download.githubStars} <strong className="text-amber-700 dark:text-amber-400 tabular-nums">{stars.toLocaleString()} ★</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card-bg border border-card-border text-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t.download.latestRelease} <strong className="text-emerald-700 dark:text-emerald-400 tabular-nums">{latestRelease}</strong></span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform, idx) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`glass-card p-6 sm:p-7 rounded-2xl ${platform.border} flex flex-col justify-between transition-colors duration-200 group shadow-lg`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-surface-2 border border-card-border flex items-center justify-center ${platform.color}`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted bg-surface-2 px-2 py-0.5 rounded border border-card-border">
                    {platform.tag}
                  </span>
                </div>

                <h3 className={`text-xl font-bold text-foreground mb-1.5 font-sans ${isUrdu ? "font-urdu" : ""}`}>
                  {platform.name}
                </h3>
                <p className={`text-text-muted text-xs leading-relaxed font-sans mb-6 ${isUrdu ? "font-urdu" : ""}`}>
                  {platform.desc}
                </p>
              </div>

              <div>
                {platform.isCode ? (
                  <div className="space-y-2">
                    <code dir="ltr" className="block p-2.5 rounded-xl bg-[#0B0C10] text-[11px] text-amber-300 font-mono border border-zinc-800 overflow-x-auto text-left select-all whitespace-nowrap">
                      {platform.btnText}
                    </code>
                    <Link
                      href={platform.href}
                      className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-surface-2 hover:bg-surface-1 border border-card-border hover:border-amber-500/40 text-foreground font-bold text-[11px] uppercase tracking-wider transition-colors"
                    >
                      <span>{t.nav.docs}</span>
                      <ArrowRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  </div>
                ) : platform.isRoute ? (
                  <Link
                    href={platform.href}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-surface-2 hover:bg-surface-1 border border-card-border hover:border-amber-500/40 text-foreground font-bold text-xs uppercase tracking-wider transition-colors active:scale-[0.98]"
                  >
                    <span>{platform.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                ) : (
                  <a
                    href={platform.href}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    <DownloadIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{platform.btnText}</span>
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
