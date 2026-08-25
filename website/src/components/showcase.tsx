"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { Sparkles, Cpu, Smartphone, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

interface ShowcaseProps {
  language: Language;
}

const hardwareSetups = [
  {
    id: "licheepi",
    name: "LicheePi Nano RISC-V",
    desc: "$10 RISC-V edge board running MalikClaw with 32MB RAM effortlessly.",
    image: "/assets/licheervnano.png",
    tag: "RISC-V • 32MB RAM • $10",
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    id: "raspberry-pi",
    name: "Raspberry Pi Zero 2 W",
    desc: "Autonomous local smart-home agent running 24/7 on $15 low-power ARM64 board.",
    image: "/assets/nano_bana_pro.jpg",
    tag: "ARM64 • Quad-Core • $15",
    accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    id: "termux",
    name: "Android Phone & Termux",
    desc: "Transform discarded Android phones into high-performance autonomous edge assistants.",
    image: "/assets/termux.jpg",
    tag: "ARM64 • Proot • Zero Cost",
    accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
];

export default function Showcase({ language }: ShowcaseProps) {
  const t = translations[language];

  return (
    <section className="w-full py-24 max-w-6xl mx-auto font-mono px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Cpu className="w-3.5 h-3.5" />
          <span>PROVEN HARDWARE DEPLOYMENTS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          {t.showcase.title}
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans">
          {t.showcase.subtitle}
        </p>
      </motion.div>

      {/* Hardware Deployments Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {hardwareSetups.map((setup, idx) => (
          <motion.div
            key={setup.id}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl shadow-2xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="relative h-52 w-full overflow-hidden bg-black">
              <Image
                src={setup.image}
                alt={setup.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            </div>

            <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border mb-3 inline-block ${setup.accent}`}>
                  {setup.tag}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 font-sans">
                  {setup.name}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  {setup.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified in production</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Agent Capabilities Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mt-28 mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTONOMOUS SKILLSET</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          {language === "ur" ? "ایجنٹ کی صلاحیتیں" : "Agent Core Capabilities"}
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans">
          {language === "ur" 
            ? "خودکار کام، کوڈ جنریشن، اور میموری کا انتظام۔" 
            : "Automated execution, localized code synthesis, deep research, and long-term memory."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: language === "ur" ? "انٹیلیجنٹ کوڈنگ" : "Autonomous Code Synthesis",
            desc: language === "ur" ? "کسی بھی زبان میں اعلیٰ معیار کا کوڈ لکھیں اور ڈیبگ کریں۔" : "Write, compile, and debug scripts with sub-second feedback loops.",
            image: "/assets/malikclaw_code.png",
          },
          {
            title: language === "ur" ? "ٹاسک شیڈولنگ" : "Deterministic Task Scheduling",
            desc: language === "ur" ? "اپنے روزمرہ کے کاموں کو ایجنٹ کے ذریعے خودکار بنائیں۔" : "Automate crons, event-triggered routines, and multi-step background workflows.",
            image: "/assets/malikclaw_scedule.png",
          },
          {
            title: language === "ur" ? "ویب سرچ اور ریسرچ" : "Deep Web & System Research",
            desc: language === "ur" ? "انٹرنیٹ سے معلومات تلاش کریں اور خلاصہ تیار کریں۔" : "Extract clean markdown, filter noise, and generate structured summaries.",
            image: "/assets/malikclaw_search.png",
          },
          {
            title: language === "ur" ? "طویل مدتی میموری" : "Contextual Episodic Memory",
            desc: language === "ur" ? "ایجنٹ آپ کی ترجیحات اور ماضی کی گفتگو کو یاد رکھتا ہے۔" : "Retain contextual state across reboots in an encrypted local vector database.",
            image: "/assets/malikclaw_memory.png",
          },
        ].map((cap, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl shadow-xl hover:border-amber-500/40 transition-all"
          >
            <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-black/60">
              <Image
                src={cap.image}
                alt={cap.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
            </div>
            <div className="p-6 relative z-10">
              <h3 className="text-xl font-bold text-white mb-2 font-sans">
                {cap.title}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                {cap.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
