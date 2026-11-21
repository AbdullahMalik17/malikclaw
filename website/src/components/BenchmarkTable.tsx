"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Cpu } from "lucide-react";
import { Language, translations } from "@/i18n/translations";

interface BenchmarkTableProps {
  language: Language;
}

export default function BenchmarkTable({ language }: BenchmarkTableProps) {
  const t = translations[language];
  const isUrdu = language === "ur";

  return (
    <section
      id="benchmarks"
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
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.comparison.badge}</span>
        </div>
        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isUrdu ? "font-urdu" : "uppercase"}`}>
          {t.comparison.title}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isUrdu ? "font-urdu" : ""}`}>
          {t.comparison.subtitle}
        </p>
      </motion.div>

      {/* Comparison Matrix Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-xl backdrop-blur-2xl"
      >
        {/* Subtle Top Ambient Beam */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-card-border bg-surface-2/80 text-xs sm:text-sm">
                <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[26%]">
                  {t.comparison.criterionHeader}
                </th>
                <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[23%]">
                  {t.comparison.openclawHeader}
                </th>
                <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[23%]">
                  {t.comparison.cloudHeader}
                </th>
                <th className="py-5 px-4 sm:px-6 font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 uppercase tracking-wider w-[28%]">
                  <div className="flex items-center gap-1.5 justify-start">
                    <Sparkles className="w-4 h-4 text-black" aria-hidden="true" />
                    <span>{t.comparison.malikclawHeader} 🦅</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-card-border">
              {t.comparison.rows.map((row, idx) => (
                <motion.tr
                  key={row.criterion}
                  initial={{ opacity: 0, x: isUrdu ? 10 : -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="hover:bg-surface-2/40 transition-colors group"
                >
                  {/* Criterion Title */}
                  <td className="py-4 px-4 sm:px-6 font-semibold text-foreground">
                    <div>{row.criterion}</div>
                    <span className="text-[10px] text-text-muted uppercase tracking-widest block mt-0.5">
                      {row.category}
                    </span>
                  </td>

                  {/* OpenClaw Column */}
                  <td className="py-4 px-4 sm:px-6 text-text-muted tabular-nums">
                    {row.openclaw}
                  </td>

                  {/* Traditional Cloud Gateways Column */}
                  <td className="py-4 px-4 sm:px-6 text-text-muted tabular-nums">
                    {row.cloudGateways}
                  </td>

                  {/* MalikClaw Gryphon Highlighted Column */}
                  <td className="py-4 px-4 sm:px-6 bg-amber-500/[0.08] border-s border-e border-amber-500/20 text-amber-800 dark:text-amber-300 font-bold tabular-nums">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                      <span>{row.malikclaw}</span>
                    </div>
                    {row.malikclawSub && (
                      <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80 block mt-0.5 font-normal">
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
        <div className="px-6 py-4 bg-surface-2/80 border-t border-card-border flex flex-wrap items-center justify-between text-xs text-text-muted gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <span>{t.comparison.footerAudit}</span>
          </div>
          <span className="text-amber-800 dark:text-amber-400 font-semibold">{t.comparison.footerLicense}</span>
        </div>
      </motion.div>
    </section>
  );
}
