"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, Terminal, Database, RefreshCw, Layers } from "lucide-react";
import { Language, translations } from "@/i18n/translations";

export interface PipelineNode {
  id: "plan" | "act" | "observe" | "reflect";
  step: string;
  icon: typeof Zap;
  color: string;
  badgeColor: string;
  borderColor: string;
  payload: string;
}

const pipelineNodes: PipelineNode[] = [
  {
    id: "plan",
    step: "01",
    icon: Layers,
    color: "text-amber-700 dark:text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    borderColor: "border-amber-500/60",
    payload: `// Step 1: Deterministic Planner
{
  "goal": "backup_db_and_notify",
  "nodes": [
    { "id": "task_1", "tool": "sys_backup", "deps": [] },
    { "id": "task_2", "tool": "pg_dump", "deps": ["task_1"] },
    { "id": "task_3", "tool": "telegram_send", "deps": ["task_2"] }
  ],
  "security_sign": "ed25519_verified"
}`,
  },
  {
    id: "act",
    step: "02",
    icon: Terminal,
    color: "text-emerald-700 dark:text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/60",
    payload: `// Step 2: Native Go 1.25+ Dispatcher
go func(ctx context.Context) {
  cmd := exec.CommandContext(ctx, "pg_dump", "-Fc", "production_db")
  cmd.Stdout = &backupBuffer
  if err := cmd.Run(); err != nil {
    agent.ReflectError(err)
    return
  }
  agent.EmitEvent("BACKUP_CREATED", backupBuffer.Len())
}(ctx)`,
  },
  {
    id: "observe",
    step: "03",
    icon: Database,
    color: "text-amber-700 dark:text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    borderColor: "border-amber-500/60",
    payload: `// Step 3: Event Stream Evaluator
[OBSERVATION_EVENT]
• exit_code: 0 (SUCCESS)
• payload_size: 14.2 MB (compressed)
• sha256: 9f8a3c8e4d210b4a7...
• network_telemetry: HTTP 200 via Telegram Bot API (38ms)
• state_consistency: 100% verified`,
  },
  {
    id: "reflect",
    step: "04",
    icon: RefreshCw,
    color: "text-emerald-700 dark:text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/60",
    payload: `// Step 4: Episodic Reflection & Memory Write
{
  "reflection_score": 0.998,
  "action_success": true,
  "memory_entry": {
    "key": "last_db_backup",
    "timestamp": 1787689200,
    "target": "Telegram #dev-alerts"
  },
  "next_state": "STANDBY_IDLE"
}`,
  },
];

interface ArchitectureFlowProps {
  language?: Language;
}

export default function ArchitectureFlow({ language = "en" }: ArchitectureFlowProps) {
  const t = translations[language] || translations.en;
  const isUrdu = language === "ur";
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeNode = pipelineNodes[activeStepIndex];
  const activeStepCopy = t.architectureFlow.steps[activeNode.id];

  return (
    <div className="w-full rounded-2xl bg-card-bg border border-card-border p-5 sm:p-7 backdrop-blur-xl relative overflow-hidden font-mono shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-card-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" aria-hidden="true" />
            <span>{t.architectureFlow.eyebrow}</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans ${isUrdu ? "font-urdu" : ""}`}>
            {t.architectureFlow.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">{t.architectureFlow.phase}</span>
          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border tabular-nums ${activeNode.badgeColor}`}>
            {t.architectureFlow.stepPrefix} {activeNode.step} • {activeStepCopy.name}
          </span>
        </div>
      </div>

      {/* Interactive 4-Node Pipeline Flow Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 my-6">
        {pipelineNodes.map((node, idx) => {
          const Icon = node.icon;
          const isActive = activeStepIndex === idx;
          const stepCopy = t.architectureFlow.steps[node.id];
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3.5 rounded-xl border text-start transition-colors duration-200 relative group overflow-hidden ${
                isActive
                  ? `bg-surface-2 ${node.borderColor} shadow-md`
                  : "bg-surface-1/60 border-card-border hover:border-border-strong hover:bg-surface-2/60"
              }`}
            >
              {/* Active top line beam */}
              {isActive && (
                <motion.div
                  layoutId="activePipelineBeam"
                  className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-text-muted tabular-nums">
                  {t.architectureFlow.stepPrefix} {node.step}
                </span>
                <Icon className={`w-4 h-4 ${node.color}`} aria-hidden="true" />
              </div>
              <div className="text-sm font-bold tracking-wide text-foreground">
                {stepCopy.name}
              </div>
              <div className="text-[11px] text-text-muted line-clamp-1 mt-1 font-sans">
                {stepCopy.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Node Payload & Code Inspection Box (intentional dark terminal panel) */}
      <div dir="ltr" className="rounded-xl bg-[#0B0C10] text-zinc-100 border border-zinc-800 overflow-hidden text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-zinc-900/80 border-b border-white/[0.08] text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-200">
              {activeStepCopy.name} {t.architectureFlow.inspectorSuffix}
            </span>
          </div>
          <span className="text-zinc-400 text-[11px]">{activeStepCopy.meta}</span>
        </div>

        <div className="p-4 overflow-x-auto text-xs leading-relaxed">
          <AnimatePresence mode="wait">
            <motion.pre
              key={activeNode.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-amber-200 font-mono"
            >
              <code>{activeNode.payload}</code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="mt-4 pt-3 border-t border-card-border flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          <span>{t.architectureFlow.footerLeft}</span>
        </div>
        <span className="text-amber-700 dark:text-amber-400 font-bold">{t.architectureFlow.footerRight}</span>
      </div>
    </div>
  );
}
