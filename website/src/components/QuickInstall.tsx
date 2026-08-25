"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Copy, Check, Sparkles, Cpu, Smartphone, Box, ShieldCheck } from "lucide-react";

export type InstallMethod = "curl" | "docker" | "termux" | "go";

interface InstallOption {
  id: InstallMethod;
  label: string;
  command: string;
  icon: typeof Terminal;
  badge: string;
  accent: string;
}

const installOptions: InstallOption[] = [
  {
    id: "curl",
    label: "cURL / Bash",
    command: "curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash",
    icon: Terminal,
    badge: "Recommended",
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    id: "docker",
    label: "Docker",
    command: "docker run -d --name malikclaw -p 8080:8080 malikclaw/core:latest",
    icon: Box,
    badge: "Containerized",
    accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    id: "termux",
    label: "Android Termux",
    command: "pkg install golang && go install github.com/AbdullahMalik17/malikclaw@latest",
    icon: Smartphone,
    badge: "Edge / ARM",
    accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  {
    id: "go",
    label: "Go Install",
    command: "go install github.com/AbdullahMalik17/malikclaw/cmd/malikclaw@latest",
    icon: Cpu,
    badge: "Source Native",
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
];

export default function QuickInstall() {
  const [activeMethod, setActiveMethod] = useState<InstallMethod>("curl");
  const [copied, setCopied] = useState(false);

  const selected = installOptions.find((opt) => opt.id === activeMethod) || installOptions[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selected.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div id="quick-install" className="w-full max-w-3xl mx-auto font-mono scroll-mt-28">
      <div className="relative rounded-2xl bg-zinc-950/80 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]">
        
        {/* Subtle top ambient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {/* Tab Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-zinc-300">Quick Install</span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              {selected.badge}
            </span>
          </div>

          {/* Interactive Method Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/80 border border-white/5">
            {installOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = activeMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveMethod(opt.id)}
                  className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
                    isActive
                      ? "text-amber-300 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                  }`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeInstallTab"
                      className="absolute inset-0 rounded-lg bg-amber-500/15 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Command Body */}
        <div
          onClick={handleCopy}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCopy()}
          className="group relative p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer bg-zinc-950/40 hover:bg-zinc-900/30 transition-colors"
          title="Click to copy command"
        >
          <div className="flex items-center gap-3 overflow-x-auto min-w-0 font-mono text-xs sm:text-sm py-1">
            <span className="text-amber-400 font-bold select-none text-base shrink-0">$</span>
            <AnimatePresence mode="wait">
              <motion.code
                key={selected.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-zinc-200 break-all select-all font-mono whitespace-nowrap sm:whitespace-normal"
              >
                {selected.command}
              </motion.code>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              copied
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-amber-500/40 hover:text-amber-300 hover:bg-zinc-800 shadow-sm"
            }`}
            aria-label="Copy installation command"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Meta Strip */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-black/30 flex flex-wrap items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero dependencies • Go binary ~12MB • ed25519 signed</span>
          </div>
          <span className="text-zinc-500 font-medium">Auto-detects architecture</span>
        </div>
      </div>
    </div>
  );
}
