"use client";

import { motion } from "framer-motion";
import { Shield, Lock, UserCheck, Key, ArrowRight, CheckCircle2, FileCheck } from "lucide-react";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";

interface EnterpriseSafetyProps {
  language: Language;
}

export default function EnterpriseSafety({ language }: EnterpriseSafetyProps) {
  const t = translations[language];
  const isRTL = language === "ur";

  const cardStyles = [
    {
      icon: Key,
      accent: "text-purple-700 dark:text-violet-400",
      border: "hover:border-purple-500/45",
      glow: "hover:shadow-[0_0_24px_rgba(139,92,246,0.14)]",
      badge: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/30",
    },
    {
      icon: UserCheck,
      accent: "text-amber-700 dark:text-amber-400",
      border: "hover:border-amber-500/45",
      glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.14)]",
      badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
    },
    {
      icon: Lock,
      accent: "text-emerald-700 dark:text-emerald-400",
      border: "hover:border-emerald-500/45",
      glow: "hover:shadow-[0_0_24px_rgba(16,185,129,0.14)]",
      badge: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-24 relative max-w-6xl mx-auto px-4 sm:px-6 font-mono"
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-500/5 blur-[140px] pointer-events-none rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-800 dark:text-purple-300 mb-4 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" aria-hidden="true" />
          <span>{t.enterpriseSafety.badge}</span>
        </div>
        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isRTL ? "font-urdu" : "uppercase"}`}>
          {t.enterpriseSafety.title}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isRTL ? "font-urdu" : ""}`}>
          {t.enterpriseSafety.subtitle}
        </p>
      </motion.div>

      {/* 3-Card Security Showcase */}
      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        {t.enterpriseSafety.cards.map((card, idx) => {
          const style = cardStyles[idx % cardStyles.length];
          const Icon = style.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className={`glass-card-interactive p-6 sm:p-8 rounded-2xl ${style.border} ${style.glow} flex flex-col justify-between group relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-surface-2 border border-card-border flex items-center justify-center ${style.accent} transition-colors shadow-sm`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${style.badge}`}>
                    {card.tag}
                  </span>
                </div>

                <h3 className={`text-xl font-bold text-foreground mb-3 tracking-tight font-sans ${isRTL ? "font-urdu" : "uppercase"}`}>
                  {card.title}
                </h3>
                <p className={`text-text-muted text-xs sm:text-sm leading-relaxed font-sans mb-6 ${isRTL ? "font-urdu" : ""}`}>
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-card-border flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1.5 text-foreground/85">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  {t.enterpriseSafety.hardwareEnforced}
                </span>
                <Link href="/trust" className="text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1">
                  {t.enterpriseSafety.details} <ArrowRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Verification & Trust Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-8 p-5 sm:p-6 rounded-2xl bg-card-bg border border-card-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted relative z-10 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 shrink-0">
            <FileCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <strong className="text-foreground block text-sm font-sans">{t.enterpriseSafety.auditTitle}</strong>
            <span>{t.enterpriseSafety.auditDesc}</span>
          </div>
        </div>

        <Link
          href="/trust"
          className="shrink-0 px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-1 border border-card-border hover:border-amber-500/50 text-foreground font-bold transition-colors flex items-center gap-2 active:scale-[0.98]"
        >
          <span>{t.enterpriseSafety.readArch}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
