"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Cpu, Activity, Lock } from "lucide-react";
import { Language, translations } from "@/i18n/translations";

interface BenchmarkTableProps {
  language: Language;
}

type BenchmarkView = "edge-sla" | "x86-measured" | "architecture";

const X86_MEASURED_ROWS = [
  {
    metric: "Idle Memory (RSS Heap)",
    metricUr: "آئیڈل میموری (RSS Heap)",
    result: "~14.2 MB",
    context: "x86_64 Linux binary (vs <10MB Edge/SBC Core SLA)",
    contextUr: "x86_64 لینکس بائنری (بمقابلہ <10MB ایج کور SLA)",
    peer: "350 MB – 1.2 GB (OpenClaw)",
  },
  {
    metric: "Active Peak Memory (Multi-Tool)",
    metricUr: "فعال پیک میموری (ملٹی ٹول)",
    result: "~28.5 MB",
    context: "During active concurrent tool-calling turns",
    contextUr: "بیک وقت ٹول کالنگ کے دوران",
    peer: "500 MB – 2.0 GB+",
  },
  {
    metric: "Framework Internal Overhead",
    metricUr: "فریم ورک اندرونی لیٹنسی",
    result: "< 1.2 ms",
    context: "Message bus parse + context assembly (excl. LLM RTT)",
    contextUr: "میسج بس پارس اور سیاق اسمبلی (بغیر LLM نیٹ ورک)",
    peer: "45 ms – 280 ms",
  },
  {
    metric: "100 Concurrent Active Agents",
    metricUr: "100 بیک وقت فعال ایجنٹس",
    result: "~185 MB total RAM",
    context: "Lightweight Go goroutine event loop",
    contextUr: "ہلکا پھلکا Go گو روٹین ایونٹ لوپ",
    peer: "Multi-GB container cluster",
  },
  {
    metric: "Local Go Tool Invocation",
    metricUr: "مقامی Go ٹول ایگزیکیوشن",
    result: "< 0.05 ms",
    context: "Direct reflectionless Go function dispatch",
    contextUr: "براہِ راست Go فنکشن کال اوورہیڈ",
    peer: "5 ms – 40 ms",
  },
  {
    metric: "Provider TTFT (Ollama / Cloud)",
    metricUr: "پرووائیڈر TTFT (اولاما / کلاؤڈ)",
    result: "45 ms Ollama · 210–310 ms Cloud",
    context: "llama3:8b (45ms), claude-3-5-haiku (210ms), gpt-4o-mini (240ms)",
    contextUr: "مقامی llama3:8b (45ms)، کلاؤڈ 99.4%–99.9% کامیابی",
    peer: "Single static provider queue",
  },
];

const ARCHITECTURE_SECURITY_ROWS = [
  {
    pillar: "SSRF Network Firewall",
    pillarUr: "SSRF نیٹ ورک فائر وال",
    impl: "pkg/security/ssrf.go (ValidateURL / IsBlockedIP)",
    guarantee: "Blocks RFC1918, loopback, link-local, GCP/AWS metadata & IPv4-mapped IPv6 bypasses",
    guaranteeUr: "نجی IP، لوپ بیک، لنک لوکل اور کلاؤڈ میٹا ڈیٹا رینجز کو بلاک کرتا ہے",
  },
  {
    pillar: "Prompt-Injection Structural Guard",
    pillarUr: "پرامپٹ انجیکشن اسٹرکچرل گارڈ",
    impl: "pkg/security/prompt_guard.go (WrapUntrusted / ScanPromptInjection)",
    guarantee: "Fences untrusted tool outputs in <untrusted_data> & scans 4 injection categories",
    guaranteeUr: "غیر مصدقہ ٹول آؤٹ پٹ کو <untrusted_data> میں بند کر کے اسکین کرتا ہے",
  },
  {
    pillar: "Smart Multi-Model Cost Router",
    pillarUr: "اسمارٹ ملٹی ماڈل کاسٹ روٹر",
    impl: "pkg/routing/cost_router.go (SmartCostRouter)",
    guarantee: "TierFast (Ollama/Flash) -> TierBalanced -> TierReasoning with 429/5xx fallback",
    guaranteeUr: "سادہ کام مقامی ماڈلز پر اور پیچیدہ کام فرنٹیئر ماڈلز پر روٹ کرتا ہے",
  },
  {
    pillar: "Universal SKILL.md + MCP Host",
    pillarUr: "یونیورسل SKILL.md + MCP ہوسٹ",
    impl: "pkg/skills/loader.go & pkg/mcp/manager.go",
    guarantee: "Progressive YAML/Markdown skill loader + MCP Client over stdio, SSE & HTTP",
    guaranteeUr: "SKILL.md ماڈیولز اور stdio/SSE/HTTP کے ذریعے MCP سرور کنکشن",
  },
  {
    pillar: "Non-Root Container & Binary Signing",
    pillarUr: "نان روٹ کنٹینر اور بائنری سائننگ",
    impl: "Dockerfile (alpine:3.23, USER malikclaw) & ed25519",
    guarantee: "Unprivileged UID 1000 container + signed actions & workspace directory jailing",
    guaranteeUr: "غیر مراعات یافتہ صارف کنٹینر + ed25519 دستخط اور ورک اسپیس جیلنگ",
  },
];

export default function BenchmarkTable({ language }: BenchmarkTableProps) {
  const t = translations[language];
  const isUrdu = language === "ur";
  const [activeView, setActiveView] = useState<BenchmarkView>("edge-sla");

  const tabs: Array<{ id: BenchmarkView; label: string; icon: typeof Cpu }> = [
    {
      id: "edge-sla",
      label: isUrdu ? "ایج ہارڈ ویئر SLA" : "Edge Hardware SLA",
      icon: Cpu,
    },
    {
      id: "x86-measured",
      label: isUrdu ? "x86_64 پیمائش شدہ RSS" : "x86_64 Measured RSS",
      icon: Activity,
    },
    {
      id: "architecture",
      label: isUrdu ? "آرکیٹیکچر اور سیکیورٹی" : "Architecture & Security",
      icon: Lock,
    },
  ];

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveView(nextTab.id);
    document.getElementById(`benchmark-tab-${nextTab.id}`)?.focus();
  };

  return (
    <section
      id="benchmarks"
      aria-labelledby="benchmarks-heading"
      dir={isUrdu ? "rtl" : "ltr"}
      className="w-full py-24 max-w-6xl mx-auto font-mono scroll-mt-24 px-4 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-4 shadow-sm">
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.comparison.badge}</span>
        </div>
        <h2
          id="benchmarks-heading"
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isUrdu ? "font-urdu" : "uppercase"}`}
        >
          {t.comparison.title}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isUrdu ? "font-urdu" : ""}`}>
          {t.comparison.subtitle}
        </p>

        {/* Interactive View Toggle Tabs */}
        <div className="mt-8 flex justify-center">
          <div
            role="tablist"
            aria-label={isUrdu ? "بینچ مارک منظر منتخب کریں" : "Select benchmark view"}
            className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-surface-2/90 border border-card-border shadow-sm"
          >
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isSelected = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`benchmark-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`benchmark-panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveView(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isSelected
                      ? "bg-amber-500 text-black shadow-sm"
                      : "text-text-muted hover:text-foreground hover:bg-surface-1/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Comparison Matrix Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-xl backdrop-blur-2xl"
      >
        {/* Subtle Top Ambient Beam */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {activeView === "edge-sla" && (
          <div
            id="benchmark-panel-edge-sla"
            role="tabpanel"
            aria-labelledby="benchmark-tab-edge-sla"
            className="overflow-x-auto"
          >
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
                {t.comparison.rows.map((row) => (
                  <tr
                    key={row.criterion}
                    className="hover:bg-surface-2/40 transition-colors group"
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold text-foreground">
                      <div>{row.criterion}</div>
                      <span className="text-[10px] text-text-muted uppercase tracking-widest block mt-0.5">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-text-muted tabular-nums">
                      {row.openclaw}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-text-muted tabular-nums">
                      {row.cloudGateways}
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === "x86-measured" && (
          <div
            id="benchmark-panel-x86-measured"
            role="tabpanel"
            aria-labelledby="benchmark-tab-x86-measured"
            className="overflow-x-auto"
          >
            <table className="w-full text-start border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-card-border bg-surface-2/80 text-xs sm:text-sm">
                  <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[28%]">
                    {isUrdu ? "پیمائش (x86_64 لینکس)" : "Metric (x86_64 Linux)"}
                  </th>
                  <th className="py-5 px-4 sm:px-6 font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 uppercase tracking-wider w-[26%]">
                    {isUrdu ? "MalikClaw پیمائش" : "MalikClaw Measured"}
                  </th>
                  <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[28%]">
                    {isUrdu ? "ہارڈ ویئر اور نوٹس" : "Condition & Notes"}
                  </th>
                  <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[18%]">
                    {isUrdu ? "مقابلہ" : "Typical Peer"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-card-border">
                {X86_MEASURED_ROWS.map((row) => (
                  <tr key={row.metric} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-foreground">
                      {isUrdu ? row.metricUr : row.metric}
                    </td>
                    <td className="py-4 px-4 sm:px-6 bg-amber-500/[0.08] border-s border-e border-amber-500/20 text-amber-800 dark:text-amber-300 font-bold tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                        <span>{row.result}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-text-muted">
                      {isUrdu ? row.contextUr : row.context}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-text-muted tabular-nums">
                      {row.peer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === "architecture" && (
          <div
            id="benchmark-panel-architecture"
            role="tabpanel"
            aria-labelledby="benchmark-tab-architecture"
            className="overflow-x-auto"
          >
            <table className="w-full text-start border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-card-border bg-surface-2/80 text-xs sm:text-sm">
                  <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[26%]">
                    {isUrdu ? "v2.0.0 ستون" : "v2.0.0 Pillar"}
                  </th>
                  <th className="py-5 px-4 sm:px-6 font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 uppercase tracking-wider w-[32%]">
                    {isUrdu ? "تصدیق شدہ نفاذ" : "Verified Implementation"}
                  </th>
                  <th className="py-5 px-4 sm:px-6 font-bold text-text-muted uppercase tracking-wider w-[42%]">
                    {isUrdu ? "سیکیورٹی اور کارکردگی کی ضمانت" : "Runtime Guarantee"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-card-border">
                {ARCHITECTURE_SECURITY_ROWS.map((row) => (
                  <tr key={row.pillar} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-foreground">
                      {isUrdu ? row.pillarUr : row.pillar}
                    </td>
                    <td className="py-4 px-4 sm:px-6 bg-amber-500/[0.08] border-s border-e border-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                      {row.impl}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-text-muted">
                      {isUrdu ? row.guaranteeUr : row.guarantee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer Banner */}
        <div className="px-6 py-4 bg-surface-2/80 border-t border-card-border flex flex-wrap items-center justify-between text-xs text-text-muted gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <span>
              {activeView === "x86-measured"
                ? isUrdu
                  ? "Intel i7, 16GB RAM, x86_64 لینکس (docs/benchmark/results.md) • <10MB کور SLA بمقابلہ ~14.2 MB x86_64 RSS"
                  : "Measured on Intel i7, 16GB RAM, x86_64 Linux (docs/benchmark/results.md) • <10MB Core SLA vs ~14.2 MB x86_64 RSS"
                : t.comparison.footerAudit}
            </span>
          </div>
          <span className="text-amber-800 dark:text-amber-400 font-semibold">{t.comparison.footerLicense}</span>
        </div>
      </motion.div>
    </section>
  );
}
