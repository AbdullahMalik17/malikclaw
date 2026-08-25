"use client";

import { Cpu, Globe, Smartphone, Terminal, Download as DownloadIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { useGitHubStats } from "@/hooks/use-github-stats";

interface DownloadProps {
  language: Language;
}

export default function Download({ language }: DownloadProps) {
  const t = translations[language];
  const { stars, latestRelease, isLoading } = useGitHubStats();

  const platforms = [
    {
      name: t.download.windows,
      desc: t.download.windowsDesc,
      icon: Globe,
      color: "text-cyan-400",
      border: "hover:border-cyan-500/40",
      btnText: t.download.downloadExe,
      href: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip",
      tag: "x86_64 / ARM64",
    },
    {
      name: t.download.linux,
      desc: t.download.linuxDesc,
      icon: Cpu,
      color: "text-amber-400",
      border: "hover:border-amber-500/40",
      btnText: t.download.downloadBinary,
      href: "https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz",
      tag: "ARM64 / RISC-V",
    },
    {
      name: t.download.android,
      desc: t.download.androidDesc,
      icon: Smartphone,
      color: "text-purple-400",
      border: "hover:border-purple-500/40",
      btnText: t.nav.setupGuide,
      href: "/docs/installation/android",
      tag: "Termux / Proot",
      isRoute: true,
    },
    {
      name: t.download.docker,
      desc: t.download.dockerDesc,
      icon: Terminal,
      color: "text-emerald-400",
      border: "hover:border-emerald-500/40",
      btnText: "docker pull malikclaw/gateway",
      href: "/docs/deployment/docker",
      tag: "Container Image",
      isCode: true,
    },
  ];

  return (
    <section id="download" className="w-full py-24 max-w-6xl mx-auto font-mono scroll-mt-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <DownloadIcon className="w-3.5 h-3.5" />
          <span>BINARY DISTRIBUTIONS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          {t.download.title}
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans">
          {t.download.subtitle}
        </p>
        
        {/* GitHub Live Version & Stars Badge */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950/80 border border-white/10 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>GitHub Stars: <strong className="text-amber-400">{stars.toLocaleString()} ★</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950/80 border border-white/10 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Latest Release: <strong className="text-emerald-400">{latestRelease}</strong></span>
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
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass-card p-6 sm:p-7 rounded-2xl border border-white/[0.08] ${platform.border} flex flex-col justify-between transition-all duration-300 group shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center ${platform.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {platform.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5 font-sans">
                  {platform.name}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans mb-6">
                  {platform.desc}
                </p>
              </div>

              <div>
                {platform.isCode ? (
                  <code className="block p-2.5 rounded-xl bg-black/60 text-[11px] text-amber-300 font-mono border border-white/10 overflow-x-auto text-center select-all">
                    {platform.btnText}
                  </code>
                ) : platform.isRoute ? (
                  <Link
                    href={platform.href}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-500/40 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span>{platform.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a
                    href={platform.href}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
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
