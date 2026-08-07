"use client";

import { useState } from "react";
import { Globe, Zap, ShieldCheck, Smartphone, Cpu, RefreshCw, ChevronRight, Layers, Terminal as TerminalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, translations } from "@/i18n/translations";

interface FeaturesProps {
  language: Language;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Features({ language }: FeaturesProps) {
  const t = translations[language];
  const [activeLoopStep, setActiveLoopStep] = useState<number>(0);

  const loopSteps = [
    { name: "PLAN", desc: "Deconstruct goal into executable tool DAGs", code: `{"goal": "deploy_agent", "steps": ["auth", "connect_adb", "spawn_process"]}` },
    { name: "ACT", desc: "Dispatch Go routines & execute OS shell commands", code: `exec.Command("malikclaw", "spawn", "--memory=8.4MB")` },
    { name: "OBSERVE", desc: "Stream stdout, inspect state & evaluate exit code", code: `[EVENT] process_pid=4892 status=RUNNING latency=0.82s` },
    { name: "REFLECT", desc: "Evaluate objective completion & optimize next loop", code: `[REFLECTION] Task completed with 99.4% efficiency score.` },
  ];

  return (
    <section id="features" className="w-full py-20 relative font-mono">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/5 blur-[140px] pointer-events-none rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>ENGINEERING EXCELLENCE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground uppercase">
          {t.features.title}
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-xl mx-auto">
          {t.features.subtitle}
        </p>
      </motion.div>

      {/* Feature Glass Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
      >
        {/* Feature 1: Hero Large Card - Production-Grade Agent Loop */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 glass-card-interactive p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-zinc-800/80 hover:border-amber-500/40"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-amber-500">
            <Zap className="w-64 h-64" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                AUTONOMOUS LOOPS
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground uppercase tracking-tight">
              Production-Grade Agent Loop
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
              MalikClaw executes a full deterministic <span className="text-amber-400 font-semibold">PLAN → ACT → OBSERVE → REFLECT</span> cycle with zero runtime latency overhead.
            </p>

            {/* Interactive Loop Step Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {loopSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLoopStep(idx)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    activeLoopStep === idx
                      ? "bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(234,179,8,0.15)]"
                      : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-60">STEP 0{idx + 1}</div>
                  <div className="text-xs font-bold font-mono">{step.name}</div>
                </button>
              ))}
            </div>

            {/* Code Output Box for Selected Step */}
            <div className="bg-zinc-950/80 rounded-xl p-3.5 border border-zinc-800/90 font-mono text-xs text-zinc-300 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] pb-1 border-b border-zinc-800/60">
                <span>Phase: {loopSteps[activeLoopStep].name}</span>
                <span className="text-amber-400">{loopSteps[activeLoopStep].desc}</span>
              </div>
              <code className="text-amber-300/90 overflow-x-auto py-1">
                {loopSteps[activeLoopStep].code}
              </code>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-800/60 pt-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              State Engine Online
            </span>
            <span className="uppercase tracking-wider">Go 1.24 Native Engine</span>
          </div>
        </motion.div>

        {/* Feature 2: Small Card - 8.4MB Footprint */}
        <motion.div 
          variants={itemVariants}
          className="glass-card-interactive p-6 sm:p-7 rounded-2xl border border-zinc-800/80 hover:border-blue-500/40 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground uppercase tracking-tight">
              {t.features.memory}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
              {t.features.memoryDesc}
            </p>

            {/* Memory Bar Comparison */}
            <div className="space-y-3 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span className="text-amber-400 font-bold">MalikClaw</span>
                  <span className="font-bold text-amber-400">8.4 MB</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[4%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                  <span>Python / Node AI Gateway</span>
                  <span>1.2 GB</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-600 rounded-full w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
            <span>Memory Efficiency</span>
            <span className="text-blue-400 font-bold">99% Less RAM</span>
          </div>
        </motion.div>

        {/* Feature 3: Small Card - 1s Cold Start */}
        <motion.div 
          variants={itemVariants}
          className="glass-card-interactive p-6 sm:p-7 rounded-2xl border border-zinc-800/80 hover:border-emerald-500/40 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground uppercase tracking-tight">
              {t.features.boot}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
              {t.features.bootDesc}
            </p>

            <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-xs text-zinc-300 font-medium">Boot Latency</span>
              </div>
              <span className="text-sm font-bold text-emerald-400 font-mono">0.82 sec</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
            <span>Runtime</span>
            <span className="text-emerald-400 font-bold">Zero VM Overhead</span>
          </div>
        </motion.div>

        {/* Feature 4: Wide Card - Android Remote ADB */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 glass-card-interactive p-6 sm:p-8 rounded-2xl border border-zinc-800/80 hover:border-purple-500/40 flex flex-col sm:flex-row items-start gap-6 justify-between"
        >
          <div className="flex-1">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground uppercase tracking-tight">
              {t.features.android}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-4">
              {t.features.androidDesc}
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Native ADB Shell • Termux Compatible • Low-Power ARM</span>
            </div>
          </div>

          <div className="w-full sm:w-64 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 text-xs font-mono shrink-0">
            <div className="text-zinc-500 mb-2 border-b border-zinc-800 pb-1 flex justify-between">
              <span>ADB Automation</span>
              <span className="text-purple-400">ACTIVE</span>
            </div>
            <div className="space-y-1 text-zinc-400">
              <div className="text-purple-300">$ adb shell input tap 450 1200</div>
              <div className="text-emerald-400">✓ Event dispatched</div>
              <div className="text-purple-300">$ adb exec-out screencap -p</div>
              <div className="text-emerald-400">✓ OCR Matrix analyzed</div>
            </div>
          </div>
        </motion.div>

        {/* Feature 5: Urdu-First Native Intelligence Card */}
        <motion.div 
          variants={itemVariants}
          className="glass-card-interactive p-6 sm:p-8 rounded-2xl border border-zinc-800/80 hover:border-amber-500/40 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground uppercase tracking-tight">
              {t.features.urduFirst}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
              {t.features.urduFirstDesc}
            </p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 text-center">
            <span className="font-urdu text-amber-300 text-xl font-bold leading-relaxed block">
              "آگے بڑھو، ملک کلاؤ!"
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mt-1">
              Bilingual Agent Engine
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

