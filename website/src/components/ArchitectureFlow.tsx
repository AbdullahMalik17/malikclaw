"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, CheckCircle2, Terminal, Cpu, Database, RefreshCw, Layers } from "lucide-react";

export interface PipelineNode {
  id: string;
  step: string;
  name: string;
  desc: string;
  icon: typeof Zap;
  color: string;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
  payload: string;
  meta: string;
}

const pipelineNodes: PipelineNode[] = [
  {
    id: "plan",
    step: "01",
    name: "PLAN",
    desc: "Deconstruct goal into executable tool DAGs",
    icon: Layers,
    color: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    borderColor: "border-amber-500/50",
    glowColor: "rgba(245, 158, 11, 0.3)",
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
    meta: "Complexity: O(V+E) • DAG Verified • Latency: 12ms",
  },
  {
    id: "act",
    step: "02",
    name: "ACT",
    desc: "Dispatch Go routines & execute OS shell commands",
    icon: Terminal,
    color: "text-cyan-400",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    borderColor: "border-cyan-500/50",
    glowColor: "rgba(6, 182, 212, 0.3)",
    payload: `// Step 2: Native Go Dispatcher
go func(ctx context.Context) {
  cmd := exec.CommandContext(ctx, "pg_dump", "-Fc", "production_db")
  cmd.Stdout = &backupBuffer
  if err := cmd.Run(); err != nil {
    agent.ReflectError(err)
    return
  }
  agent.EmitEvent("BACKUP_CREATED", backupBuffer.Len())
}(ctx)`,
    meta: "Engine: Go 1.24 Native • Heap Alloc: 8.4MB • Zero VM Overhead",
  },
  {
    id: "observe",
    step: "03",
    name: "OBSERVE",
    desc: "Stream stdout, inspect state & evaluate exit code",
    icon: Database,
    color: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/50",
    glowColor: "rgba(16, 185, 129, 0.3)",
    payload: `// Step 3: Event Stream Evaluator
[OBSERVATION_EVENT]
• exit_code: 0 (SUCCESS)
• payload_size: 14.2 MB (compressed)
• sha256: 9f8a3c8e4d210b4a7...
• network_telemetry: HTTP 200 via Telegram Bot API (38ms)
• state_consistency: 100% verified`,
    meta: "Telemetry: Real-time Stream • Checksum Match: Valid",
  },
  {
    id: "reflect",
    step: "04",
    name: "REFLECT",
    desc: "Evaluate objective completion & update episodic memory",
    icon: RefreshCw,
    color: "text-purple-400",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    borderColor: "border-purple-500/50",
    glowColor: "rgba(168, 85, 247, 0.3)",
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
    meta: "Vector Store: Local SQLite • Memory Retention: Permanent",
  },
];

export default function ArchitectureFlow() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeNode = pipelineNodes[activeStepIndex];

  return (
    <div className="w-full rounded-2xl bg-zinc-950/80 border border-white/10 p-5 sm:p-7 backdrop-blur-xl relative overflow-hidden font-mono shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Autonomous Loop Visualizer</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            Deterministic 4-Step Agent Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Phase:</span>
          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${activeNode.badgeColor}`}>
            STEP {activeNode.step} • {activeNode.name}
          </span>
        </div>
      </div>

      {/* Interactive 4-Node Pipeline Flow Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 my-6">
        {pipelineNodes.map((node, idx) => {
          const Icon = node.icon;
          const isActive = activeStepIndex === idx;
          return (
            <button
              key={node.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden ${
                isActive
                  ? `bg-zinc-900/90 ${node.borderColor} shadow-[0_0_25px_var(--glow)]`
                  : "bg-zinc-950/60 border-white/[0.07] hover:border-white/20 hover:bg-zinc-900/40"
              }`}
              style={{ "--glow": node.glowColor } as React.CSSProperties}
            >
              {/* Active top line beam */}
              {isActive && (
                <motion.div
                  layoutId="activePipelineBeam"
                  className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-500">STEP {node.step}</span>
                <Icon className={`w-4 h-4 ${node.color}`} />
              </div>
              <div className={`text-sm font-bold tracking-wide ${isActive ? "text-white" : "text-zinc-300"}`}>
                {node.name}
              </div>
              <div className="text-[11px] text-zinc-400 line-clamp-1 mt-1">
                {node.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Node Payload & Code Inspection Box */}
      <div className="rounded-xl bg-black/60 border border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border-b border-white/[0.06] text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-200">{activeNode.name} Payload Inspector</span>
          </div>
          <span className="text-zinc-500 text-[11px]">{activeNode.meta}</span>
        </div>

        <div className="p-4 overflow-x-auto text-xs leading-relaxed">
          <AnimatePresence mode="wait">
            <motion.pre
              key={activeNode.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-amber-200/95 font-mono"
            >
              <code>{activeNode.payload}</code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Runtime Latency Overhead • Pure Go Concurrency</span>
        </div>
        <span className="text-amber-400 font-bold">100% Deterministic Execution</span>
      </div>
    </div>
  );
}
