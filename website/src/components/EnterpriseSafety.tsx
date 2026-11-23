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
      accent: "text-amber-700 dark:text-amber-400",
      border: "hover:border-amber-500/45",
      glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.14)]",
      badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
      span: "lg:col-span-5",
    },
    {
      icon: UserCheck,
      accent: "text-emerald-700 dark:text-emerald-400",
      border: "hover:border-emerald-500/45",
      glow: "hover:shadow-[0_0_24px_rgba(16,185,129,0.14)]",
      badge: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
      span: "lg:col-span-7",
    },
    {
      icon: Lock,
      accent: "text-amber-700 dark:text-amber-400",
      border: "hover:border-amber-500/45",
      glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.14)]",
      badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
      span: "lg:col-span-12",
    },
  ];

  const artifacts = [
    <div
      key="signing"
      dir="ltr"
      aria-hidden="true"
      className="rounded-xl border border-zinc-800 bg-[#0B0C10] p-3 text-[11px] text-zinc-400 text-left space-y-1.5"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
        <span className="text-zinc-300 font-semibold">action_signature.json</span>
        <span className="text-emerald-400">verified</span>
      </div>
      <div className="text-amber-300">tool: telegram_send</div>
      <div className="truncate text-zinc-500">ed25519: 9f8a3c8e4d21…b7f4</div>
    </div>,
    <div
      key="approval"
      dir="ltr"
      aria-hidden="true"
      className="rounded-xl border border-zinc-800 bg-[#0B0C10] p-3 text-[11px] text-left text-zinc-400 space-y-2.5"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
        <span className="text-zinc-300 font-semibold">Approval gate</span>
        <span className="text-amber-300">awaiting human</span>
      </div>
      <div className="text-zinc-300">
        <span className="text-zinc-500">$ </span>rm -rf /var/data/ledger-cache
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 font-bold text-emerald-300">
          Approve
        </span>
        <span className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 font-semibold text-zinc-300">
          Deny
        </span>
        <span className="ms-auto text-zinc-500">via Telegram</span>
      </div>
    </div>,
    <div
      key="firewall"
      dir="ltr"
      aria-hidden="true"
      className="rounded-xl border border-zinc-800 bg-[#0B0C10] p-3 text-[11px] text-left text-zinc-400 space-y-1.5"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
        <span className="text-zinc-300 font-semibold">Egress policy</span>
        <span className="text-amber-300">2 requests blocked</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-zinc-500">GET 169.254.169.254/latest/meta-data</span>
        <span className="shrink-0 text-red-400">SSRF_BLOCK</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-zinc-500">&ldquo;ignore previous instructions&rdquo; payload</span>
        <span className="shrink-0 text-amber-300">FENCED</span>
      </div>
    </div>,
  ];

  return (
    <section
      aria-labelledby="security-heading"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-24 relative max-w-6xl mx-auto px-4 sm:px-6 font-mono"
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 amber-ambient-glow pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
          <span>{t.enterpriseSafety.badge}</span>
        </div>
        <h2
          id="security-heading"
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isRTL ? "font-urdu" : "uppercase"}`}
        >
          {t.enterpriseSafety.title}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isRTL ? "font-urdu" : ""}`}>
          {t.enterpriseSafety.subtitle}
        </p>
      </motion.div>

      {/* Asymmetric Security Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {t.enterpriseSafety.cards.map((card, idx) => {
          const styleIndex = idx % cardStyles.length;
          const style = cardStyles[styleIndex];
          const Icon = style.icon;
          const artifact = artifacts[styleIndex];
          const isFullRow = style.span === "lg:col-span-12";
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className={`${style.span} glass-card-interactive p-6 sm:p-8 rounded-2xl ${style.border} ${style.glow} flex flex-col group relative overflow-hidden`}
            >
              <div className={isFullRow ? "flex flex-col lg:flex-row lg:items-start gap-6" : undefined}>
                <div className={isFullRow ? "lg:flex-1" : undefined}>
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
                  <p className={`text-text-muted text-xs sm:text-sm leading-relaxed font-sans ${isRTL ? "font-urdu" : ""}`}>
                    {card.description}
                  </p>
                </div>

                <div className={isFullRow ? "lg:w-[380px] lg:shrink-0" : "mt-6"}>{artifact}</div>
              </div>

              <div className="mt-auto pt-6">
                <div className="pt-4 border-t border-card-border flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1.5 text-foreground/85">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    {t.enterpriseSafety.hardwareEnforced}
                  </span>
                  <Link href="/trust" className="text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1">
                    {t.enterpriseSafety.details} <ArrowRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
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
