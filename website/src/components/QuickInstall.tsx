"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Copy, Check, Cpu, Smartphone, Box, ShieldCheck } from "lucide-react";
import { Language, translations } from "@/i18n/translations";

export type InstallMethod = "curl" | "irm" | "docker" | "termux" | "go";

interface InstallOption {
  id: InstallMethod;
  label: string;
  command: string;
  icon: typeof Terminal;
}

const installOptions: InstallOption[] = [
  {
    id: "curl",
    label: "cURL / Bash",
    command: "curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash",
    icon: Terminal,
  },
  {
    id: "irm",
    label: "Windows (irm)",
    command: "irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex",
    icon: Terminal,
  },
  {
    id: "docker",
    label: "Docker",
    command: "docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/home/malikclaw/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest",
    icon: Box,
  },
  {
    id: "termux",
    label: "Android Termux",
    command: "pkg install golang && go install github.com/AbdullahMalik17/malikclaw/cmd/malikclaw@latest",
    icon: Smartphone,
  },
  {
    id: "go",
    label: "Go Install",
    command: "go install github.com/AbdullahMalik17/malikclaw/cmd/malikclaw@latest",
    icon: Cpu,
  },
];

interface QuickInstallProps {
  language?: Language;
}

export default function QuickInstall({ language = "en" }: QuickInstallProps) {
  const t = translations[language] || translations.en;
  const [activeMethod, setActiveMethod] = useState<InstallMethod>("curl");
  const [copied, setCopied] = useState(false);

  const selected = installOptions.find((opt) => opt.id === activeMethod) || installOptions[0];
  const badgeText = t.quickInstall.badges[selected.id];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selected.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div id="quick-install" className="w-full max-w-4xl mx-auto font-mono scroll-mt-28">
      <div className="relative rounded-2xl bg-[#0B0C10] text-zinc-100 border border-zinc-800 shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden transition-colors duration-300 hover:border-amber-500/40">

        {/* Subtle top ambient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {/* Tab Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.08] bg-black/50">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 me-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>
            <Terminal className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="font-semibold text-zinc-200">{t.quickInstall.title}</span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {badgeText}
            </span>
          </div>

          {/* Interactive Method Pills */}
          <div dir="ltr" className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-900/90 border border-white/10">
            {installOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = activeMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveMethod(opt.id)}
                  className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors duration-200 ${
                    isActive
                      ? "text-amber-300 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeInstallTab"
                      className="absolute inset-0 rounded-lg bg-amber-500/15 border border-amber-500/40"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" aria-hidden="true" />
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Command Body (non-interactive container; single Copy button for valid a11y) */}
        <div
          dir="ltr"
          className="relative p-4 sm:p-5 flex items-center justify-between gap-4 bg-zinc-950/60"
        >
          <div className="flex items-center gap-3 overflow-x-auto min-w-0 font-mono text-xs sm:text-sm py-1 text-left">
            <span className="text-amber-400 font-bold select-none text-base shrink-0">$</span>
            <AnimatePresence mode="wait">
              <motion.code
                key={selected.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-zinc-100 break-all select-all font-mono whitespace-nowrap sm:whitespace-normal"
              >
                {selected.command}
              </motion.code>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors duration-200 active:scale-[0.98] ${
              copied
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-amber-500/50 hover:text-amber-300 hover:bg-zinc-800"
            }`}
            aria-label="Copy installation command"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>{t.quickInstall.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t.quickInstall.copy}</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Meta Strip */}
        <div className="px-4 py-2.5 border-t border-white/[0.08] bg-black/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{t.quickInstall.footerMeta}</span>
          </div>
          <span className="text-zinc-400 font-medium">{t.quickInstall.autoDetect}</span>
        </div>
      </div>
    </div>
  );
}
