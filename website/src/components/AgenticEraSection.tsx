"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  ShieldAlert,
  GitBranch,
  Blocks,
  ArrowRight,
  Clock,
  Smartphone,
  Cpu,
  Lock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Language } from "@/i18n/translations";
import { MALIKCLAW_VERSION } from "@/lib/version";

interface AgenticEraSectionProps {
  language: Language;
}

interface PillarCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  footerLabel: string;
  footerValue: string;
  icon: LucideIcon;
  accentText: string;
  badgeClasses: string;
  iconBoxClasses: string;
  borderHover: string;
  glowHover: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AgenticEraSection({ language }: AgenticEraSectionProps) {
  const isUrdu = language === "ur";

  const copy = isUrdu
    ? {
        eyebrow: `${MALIKCLAW_VERSION} • ایجنٹک ایرا 2026`,
        headingPrefix: "ایجنٹک ایرا 2026 اور",
        headingHighlight: "روزمرہ زندگی کی آسانی",
        subtitle:
          "ملک کلاؤ v2.0.0 صرف ایک ڈویلپر ٹول نہیں — یہ آپ کا نجی، محفوظ اور سستا روزمرہ اے آئی ساتھی ہے جو کسی بھی لیپ ٹاپ، پرانے فون یا $10 کے بورڈ پر انگریزی اور اردو دونوں میں کام کرتا ہے۔",
        routineTitle: "روزمرہ آٹومیشن کی ایک جھلک",
        routineItems: [
          { time: "07:00 AM", label: "صبح کا خلاصہ (موسم + ایجنڈا)" },
          { time: "WhatsApp / TG", label: "اردو اور انگریزی میں فوری جواب" },
          { time: "Android ADB", label: "فون کے کام خودکار طریقے سے" },
          { time: "09:00 PM", label: "روزانہ یاددہانیاں اور اخراجات" },
        ],
        ctaLabel: "v2.0.0 انسٹالیشن گائیڈ دیکھیں",
        securityCta: "سیکیورٹی آرکیٹیکچر پڑھیں",
        pillars: [
          {
            id: "everyday-life",
            badge: "روزمرہ زندگی",
            title: "روزمرہ زندگی کی آسانی",
            description:
              "واٹس ایپ اور ٹیلی گرام کے جوابات، صبح کے بریفنگز، اینڈرائیڈ ADB فون ٹاسکس، اور روزانہ یاددہانیاں اردو یا انگریزی میں خودکار بنائیں — چاہے لیپ ٹاپ، پرانے فون یا $10 SBC پر۔",
            highlights: [
              "WhatsApp اور Telegram پر خودکار جوابات",
              "صبح کی بریفنگ اور روزانہ یاددہانیاں",
              "لیپ ٹاپ، Android فون یا $10 بورڈ پر <10MB RAM",
            ],
            footerLabel: "بائی لنگوئل سپورٹ",
            footerValue: "اردو + English",
            icon: MessageCircle,
            accentText: "text-amber-700 dark:text-amber-400",
            badgeClasses: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
            iconBoxClasses: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
            borderHover: "hover:border-amber-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(245,158,11,0.14)]",
          },
          {
            id: "defense-in-depth",
            badge: "زیرو ٹرسٹ 2.0",
            title: "تہہ در تہہ سیکیورٹی (Defense-in-Depth)",
            description:
              "بلٹ ان SSRF نیٹ ورک فائر وال اور Prompt-Injection اسٹرکچرل گارڈ ہر ٹول کال اور بیرونی ڈیٹا کو ایگزیکیوشن سے پہلے سختی سے جانچتا ہے۔",
            highlights: [
              "SSRF نیٹ ورک فائر وال (لوکل نیٹ ورک تحفظ)",
              "Prompt-Injection اسٹرکچرل گارڈ",
              "مقامی ہارڈویئر پر 100% پرائیویسی",
            ],
            footerLabel: "سیکیورٹی لیئر",
            footerValue: "SSRF + Injection Guard",
            icon: ShieldAlert,
            accentText: "text-emerald-700 dark:text-emerald-400",
            badgeClasses: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
            iconBoxClasses: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
            borderHover: "hover:border-emerald-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(16,185,129,0.14)]",
          },
          {
            id: "cost-router",
            badge: "اسمارٹ روٹر",
            title: "اسمارٹ ملٹی ماڈل کاسٹ روٹر",
            description:
              "آسان کاموں کو خودکار طور پر تیز لوکل Ollama ماڈلز پر چلاتا ہے اور گہری سوچ یا کوڈنگ کے لیے فرنٹیئر ماڈلز استعمال کر کے API لاگت بچاتا ہے۔",
            highlights: [
              "سادہ ٹاسکس کے لیے لوکل Ollama ماڈلز ($0)",
              "پیچیدہ ریزننگ کے لیے فرنٹیئر ماڈلز",
              "خودکار لاگت اور لیٹنسی آپٹیمائزیشن",
            ],
            footerLabel: "روٹنگ پالیسی",
            footerValue: "Ollama → Frontier",
            icon: GitBranch,
            accentText: "text-cyan-700 dark:text-cyan-400",
            badgeClasses: "bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
            iconBoxClasses: "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
            borderHover: "hover:border-cyan-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(6,182,212,0.14)]",
          },
          {
            id: "skill-mcp",
            badge: "یونیورسل ایکوسسٹم",
            title: "یونیورسل SKILL.md + MCP ایکوسسٹم",
            description:
              "ماڈیولر SKILL.md ورک فلوز اور Model Context Protocol (MCP) سرورز کو بغیر کسی پیچیدگی کے فوراً جوڑیں اور اپنے ایجنٹ کی صلاحیتیں بڑھائیں۔",
            highlights: [
              "ڈراپ ان SKILL.md ماڈیولر صلاحیتیں",
              "آؤٹ آف دی باکس MCP سرور سپورٹ",
              "کمیونٹی ٹولز اور کسٹم ورک فلوز",
            ],
            footerLabel: "پروٹوکول اسٹینڈرڈ",
            footerValue: "SKILL.md + MCP",
            icon: Blocks,
            accentText: "text-purple-700 dark:text-purple-400",
            badgeClasses: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/30",
            iconBoxClasses: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400",
            borderHover: "hover:border-purple-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(168,85,247,0.14)]",
          },
        ] as PillarCard[],
      }
    : {
        eyebrow: `${MALIKCLAW_VERSION} • AGENTIC ERA 2026`,
        headingPrefix: "Agentic Era 2026 &",
        headingHighlight: "Everyday Life Made Easy",
        subtitle:
          "MalikClaw v2.0.0 turns any laptop, $10 SBC, or spare phone into a hardened, cost-smart personal AI operator — automating daily routines in English or Urdu with enterprise-grade guardrails.",
        routineTitle: "Everyday Routine Preview",
        routineItems: [
          { time: "07:00 AM", label: "Morning Briefing & Weather" },
          { time: "WhatsApp / TG", label: "Bilingual Auto-Replies" },
          { time: "Android ADB", label: "Hands-Free Phone Tasks" },
          { time: "09:00 PM", label: "Daily Reminders & Recap" },
        ],
        ctaLabel: "Deploy v2.0.0 Now",
        securityCta: "Inspect Security Architecture",
        pillars: [
          {
            id: "everyday-life",
            badge: "EVERYDAY UX",
            title: "Everyday Life Made Easy",
            description:
              "Automate WhatsApp and Telegram replies, morning briefings, Android ADB phone tasks, and daily reminders in English or Urdu — on any laptop, spare phone, or $10 SBC.",
            highlights: [
              "WhatsApp & Telegram smart triage and replies",
              "Scheduled morning briefings & daily reminders",
              "Native English & Urdu (RTL) on <10MB RAM",
            ],
            footerLabel: "Hardware Target",
            footerValue: "Laptop, Phone or $10 SBC",
            icon: MessageCircle,
            accentText: "text-amber-700 dark:text-amber-400",
            badgeClasses: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
            iconBoxClasses: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
            borderHover: "hover:border-amber-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(245,158,11,0.14)]",
          },
          {
            id: "defense-in-depth",
            badge: "ZERO-TRUST 2.0",
            title: "Defense-in-Depth Security",
            description:
              "Built-in SSRF Network Firewall & Prompt-Injection Structural Guard block private-IP exfiltration, metadata probing, and untrusted instruction hijacking before tools ever run.",
            highlights: [
              "SSRF Network Firewall blocks private/link-local egress",
              "Prompt-Injection Structural Guard isolates untrusted inputs",
              "Pairs with ed25519 signing & human approval gates",
            ],
            footerLabel: "Runtime Protection",
            footerValue: "SSRF + Injection Guard",
            icon: ShieldAlert,
            accentText: "text-emerald-700 dark:text-emerald-400",
            badgeClasses: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
            iconBoxClasses: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
            borderHover: "hover:border-emerald-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(16,185,129,0.14)]",
          },
          {
            id: "cost-router",
            badge: "SMART ROUTER",
            title: "Smart Multi-Model Cost Router",
            description:
              "Automatically routes routine reminders, summaries, and chat to fast local Ollama models while escalating deep reasoning and complex coding to frontier models.",
            highlights: [
              "Zero-cost local Ollama inference for everyday tasks",
              "Automatic frontier escalation for complex reasoning",
              "Predictable budgets with latency-aware fallback",
            ],
            footerLabel: "Routing Pipeline",
            footerValue: "Local Ollama → Frontier",
            icon: GitBranch,
            accentText: "text-cyan-700 dark:text-cyan-400",
            badgeClasses: "bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
            iconBoxClasses: "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
            borderHover: "hover:border-cyan-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(6,182,212,0.14)]",
          },
          {
            id: "skill-mcp",
            badge: "UNIVERSAL ECOSYSTEM",
            title: "Universal SKILL.md + MCP Ecosystem",
            description:
              "Plug in modular SKILL.md playbooks and Model Context Protocol (MCP) servers out of the box — extending your edge agent with zero boilerplate.",
            highlights: [
              "Drop-in SKILL.md workflows for repeatable tasks",
              "First-class Model Context Protocol (MCP) client",
              "Works seamlessly with community & custom servers",
            ],
            footerLabel: "Open Standards",
            footerValue: "SKILL.md + MCP Native",
            icon: Blocks,
            accentText: "text-purple-700 dark:text-purple-400",
            badgeClasses: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/30",
            iconBoxClasses: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400",
            borderHover: "hover:border-purple-500/45",
            glowHover: "hover:shadow-[0_0_28px_rgba(168,85,247,0.14)]",
          },
        ] as PillarCard[],
      };

  return (
    <section
      id="agentic-era"
      dir={isUrdu ? "rtl" : "ltr"}
      aria-labelledby="agentic-era-heading"
      className="w-full py-20 relative max-w-6xl mx-auto px-4 sm:px-6 font-mono scroll-mt-24"
    >
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[420px] bg-gradient-to-r from-amber-500/8 via-cyan-500/6 to-purple-500/8 blur-[150px] pointer-events-none rounded-full"
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
          <span className="tracking-wider uppercase tabular-nums">{copy.eyebrow}</span>
        </div>

        <h2
          id="agentic-era-heading"
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight ${
            isUrdu ? "font-urdu" : "uppercase"
          }`}
        >
          <span>{copy.headingPrefix}</span>{" "}
          <span className="text-gold-gradient">{copy.headingHighlight}</span>
        </h2>

        <p
          className={`text-text-muted mt-4 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-sans ${
            isUrdu ? "font-urdu" : ""
          }`}
        >
          {copy.subtitle}
        </p>
      </motion.div>

      {/* Everyday Routine Strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45 }}
        aria-label={copy.routineTitle}
        className="relative z-10 mb-10 rounded-2xl bg-card-bg border border-card-border p-4 sm:p-5 backdrop-blur-xl shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-card-border">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{copy.routineTitle}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
              ADB + Termux
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Cpu className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              &lt;10MB RAM
            </span>
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              Zero-Trust
            </span>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {copy.routineItems.map((item) => (
            <li
              key={item.time}
              className="flex items-center gap-2.5 rounded-xl bg-surface-2 border border-card-border px-3.5 py-2.5"
            >
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 tabular-nums">
                {item.time}
              </span>
              <span className="text-xs text-foreground font-sans leading-snug">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 4 Core v2.0.0 Pillars Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
      >
        {copy.pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <motion.article
              key={pillar.id}
              variants={cardVariants}
              className={`glass-card-interactive p-6 sm:p-8 rounded-2xl ${pillar.borderHover} ${pillar.glowHover} flex flex-col justify-between group relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm transition-colors duration-200 ${pillar.iconBoxClasses}`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wider uppercase ${pillar.badgeClasses}`}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <h3
                  className={`text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight font-sans ${
                    isUrdu ? "font-urdu" : ""
                  }`}
                >
                  {pillar.title}
                </h3>

                <p
                  className={`text-text-muted text-sm leading-relaxed mb-5 font-sans ${
                    isUrdu ? "font-urdu" : ""
                  }`}
                >
                  {pillar.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {pillar.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 font-sans"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${pillar.accentText}`}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-card-border flex items-center justify-between gap-2 text-xs">
                <span className="text-text-muted">{pillar.footerLabel}</span>
                <span className={`font-bold ${pillar.accentText}`}>
                  {pillar.footerValue}
                </span>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Action Strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
      >
        <Link
          href="/docs/installation"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold text-xs uppercase tracking-wider shadow-md dark:shadow-[0_0_24px_rgba(245,158,11,0.3)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 w-full sm:w-auto"
        >
          <span>{copy.ctaLabel}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
        </Link>

        <Link
          href="/trust"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-1 border border-card-border hover:border-emerald-500/50 text-foreground font-bold text-xs uppercase tracking-wider transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 w-full sm:w-auto"
        >
          <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          <span>{copy.securityCta}</span>
        </Link>
      </motion.div>
    </section>
  );
}
