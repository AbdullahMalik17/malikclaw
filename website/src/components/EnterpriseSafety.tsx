"use client";

import { motion } from "framer-motion";
import { Shield, Lock, UserCheck, Key, ArrowRight, CheckCircle2, FileCheck } from "lucide-react";
import Link from "next/link";
import { Language } from "@/i18n/translations";

interface EnterpriseSafetyProps {
  language: Language;
}

export default function EnterpriseSafety({ language }: EnterpriseSafetyProps) {
  const isRTL = language === "ur";

  const cards = [
    {
      title: "Cryptographic Action Signing",
      description: "Every tool invocation and privileged OS call is cryptographically signed using local ed25519 keypairs. Untrusted payloads are rejected at runtime.",
      icon: Key,
      tag: "ED25519 VERIFIED",
      accent: "text-violet-400",
      border: "hover:border-purple-500/40",
      glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
      badge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    },
    {
      title: "Human-in-the-Loop Approval Gates",
      description: "Unlike reckless autonomous agents, MalikClaw pauses and dispatches approval webhooks (Telegram, CLI, or Slack) before executing financial, ERP, or destructive shell operations.",
      icon: UserCheck,
      tag: "APPROVAL GATES",
      accent: "text-amber-400",
      border: "hover:border-amber-500/40",
      glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    },
    {
      title: "Isolated Edge Sandbox",
      description: "All vector embeddings, episodic memories, and session contexts remain on your physical hardware. Zero unauthorized cloud egress or telemetry leakage.",
      icon: Lock,
      tag: "ZERO CLOUD EGRESS",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/40",
      glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    },
  ];

  return (
    <section className="w-full py-24 relative max-w-6xl mx-auto px-4 sm:px-6 font-mono">
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-4 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>ZERO-TRUST GUARDRAILS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          Zero-Trust Security & Enterprise Guardrails
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans">
          Designed from the ground up for strict enterprise isolation, deterministic control, and verified cryptographic auditability.
        </p>
      </motion.div>

      {/* 3-Card Security Showcase */}
      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`glass-card-interactive p-6 sm:p-8 rounded-2xl border border-white/[0.08] ${card.border} ${card.glow} flex flex-col justify-between group relative overflow-hidden`}
            >
              {/* Subtle top shimmer beam */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center ${card.accent} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${card.badge}`}>
                    {card.tag}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight font-sans">
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Hardware Enforced
                </span>
                <Link href="/trust" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  Details <ArrowRight className="w-3 h-3" />
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
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-zinc-200 block text-sm font-sans">Immutable Audit Logging Engine</strong>
            <span>Every tool parameter, timestamp, and signature hash recorded to local SQLite ledger.</span>
          </div>
        </div>

        <Link
          href="/trust"
          className="shrink-0 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-500/40 text-zinc-200 hover:text-amber-300 font-bold transition-all flex items-center gap-2"
        >
          <span>Read Security Architecture</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </section>
  );
}
