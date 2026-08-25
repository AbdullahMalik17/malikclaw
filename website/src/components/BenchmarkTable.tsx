"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Shield, Cpu, Layers } from "lucide-react";
import { Language, translations } from "@/i18n/translations";

interface BenchmarkTableProps {
  language: Language;
}

interface BenchmarkRow {
  criterion: string;
  category: string;
  malikclaw: string;
  malikclawSub?: string;
  openclaw: string;
  cloudGateways: string;
  highlight?: boolean;
}

const benchmarkData: BenchmarkRow[] = [
  {
    criterion: "Runtime & Compilation",
    category: "Architecture",
    malikclaw: "Go Compiled Native Binary",
    malikclawSub: "Single zero-dependency binary",
    openclaw: "Node.js / TypeScript Runtime",
    cloudGateways: "Python / Hosted Cloud Container",
    highlight: true,
  },
  {
    criterion: "RAM Footprint",
    category: "Efficiency",
    malikclaw: "8.4 MB",
    malikclawSub: "99% memory savings",
    openclaw: "> 1.2 GB",
    cloudGateways: "2.0 GB - 4.0 GB",
    highlight: true,
  },
  {
    criterion: "Startup Latency",
    category: "Speed",
    malikclaw: "< 1s Cold Boot",
    malikclawSub: "Instant execution",
    openclaw: "> 500s (Node/Python boot)",
    cloudGateways: "5s - 30s (Cold lambda/VM)",
    highlight: true,
  },
  {
    criterion: "Minimum Hardware Cost",
    category: "Economics",
    malikclaw: "$10 SBC / Old Phone",
    malikclawSub: "RISC-V / Pi Zero compatible",
    openclaw: "$599 (Mac Mini recommended)",
    cloudGateways: "$50+ / month SaaS bill",
    highlight: true,
  },
  {
    criterion: "Native Edge & Android Support",
    category: "Portability",
    malikclaw: "Native (ARM, RISC-V, Termux, ADB)",
    malikclawSub: "Built-in hardware hooks",
    openclaw: "Limited (x86_64 Linux)",
    cloudGateways: "None (Webhook proxy only)",
  },
  {
    criterion: "Security & Privacy Model",
    category: "Trust",
    malikclaw: "Zero-Trust ed25519 Local Sandbox",
    malikclawSub: "100% on-device data sovereignty",
    openclaw: "Basic in-memory execution",
    cloudGateways: "Multi-tenant cloud logs",
  },
];

export default function BenchmarkTable({ language }: BenchmarkTableProps) {
  const t = translations[language];

  return (
    <section id="benchmarks" className="w-full py-24 max-w-6xl mx-auto font-mono scroll-mt-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Cpu className="w-3.5 h-3.5" />
          <span>COMPETITIVE BENCHMARKS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          The Edge Hardware Champion
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans">
          See how MalikClaw's pure Go engine outperforms traditional heavy AI gateways across cost, latency, and footprint.
        </p>
      </motion.div>

      {/* Comparison Matrix Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
      >
        {/* Subtle Top Ambient Beam */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-xs sm:text-sm">
                <th className="py-5 px-4 sm:px-6 font-bold text-zinc-400 uppercase tracking-wider w-[28%]">
                  Criterion
                </th>
                <th className="py-5 px-4 sm:px-6 font-bold text-zinc-400 uppercase tracking-wider w-[24%]">
                  OpenClaw
                </th>
                <th className="py-5 px-4 sm:px-6 font-bold text-zinc-400 uppercase tracking-wider w-[24%]">
                  Cloud Gateways
                </th>
                <th className="py-5 px-4 sm:px-6 font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 uppercase tracking-wider w-[24%] shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <div className="flex items-center gap-1.5 justify-start">
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>MalikClaw 🦅</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-white/[0.06]">
              {benchmarkData.map((row, idx) => (
                <motion.tr
                  key={row.criterion}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Criterion Title */}
                  <td className="py-4 px-4 sm:px-6 font-semibold text-zinc-200">
                    <div>{row.criterion}</div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mt-0.5">
                      {row.category}
                    </span>
                  </td>

                  {/* OpenClaw Column */}
                  <td className="py-4 px-4 sm:px-6 text-zinc-400">
                    {row.openclaw}
                  </td>

                  {/* Traditional Cloud Gateways Column */}
                  <td className="py-4 px-4 sm:px-6 text-zinc-400">
                    {row.cloudGateways}
                  </td>

                  {/* MalikClaw Gryphon Highlighted Column */}
                  <td className="py-4 px-4 sm:px-6 bg-amber-500/[0.07] border-l border-r border-amber-500/20 text-amber-300 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{row.malikclaw}</span>
                    </div>
                    {row.malikclawSub && (
                      <span className="text-[10px] text-amber-400/70 block mt-0.5 font-normal">
                        {row.malikclawSub}
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Banner */}
        <div className="px-6 py-4 bg-black/50 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Audited on ARM64 Linux, Raspberry Pi Zero 2W, and RISC-V LicheePi.</span>
          </div>
          <span className="text-amber-400 font-semibold">100% Open Source (Apache 2.0 / MIT)</span>
        </div>
      </motion.div>
    </section>
  );
}
