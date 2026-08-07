"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Language, translations } from "@/i18n/translations";
import { Play, Pause, RotateCcw, Copy, Check, Terminal, Cpu, HardDrive, Shield, Zap, Sparkles } from "lucide-react";

interface TerminalDemoProps {
  language: Language;
}

type LogType = 'sys' | 'plan' | 'act' | 'observe' | 'reflect' | 'success' | 'urdu';

interface LogLine {
  type: LogType;
  tag: string;
  content: string;
  delay: number;
}

interface Scenario {
  id: string;
  name: string;
  icon: string;
  command: string;
  logs: LogLine[];
}

export default function TerminalDemo({ language }: TerminalDemoProps) {
  const t = translations[language];
  const [activeScenarioId, setActiveScenarioId] = useState<string>("task");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [visibleLogs, setVisibleLogs] = useState<LogLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scenarios: Scenario[] = [
    {
      id: "task",
      name: "Autonomous Task Loop",
      icon: "⚡",
      command: "malikclaw run --agent gryphon --goal 'Backup database & alert Telegram'",
      logs: [
        { type: 'sys', tag: 'INIT', content: 'MalikClaw v0.2.3 Gryphon Engine initializing on Linux ARM64...', delay: 200 },
        { type: 'sys', tag: 'SYS', content: 'Memory Allocated: 8.4MB | Goroutines: 12 | Cold Boot: 0.82s', delay: 600 },
        { type: 'plan', tag: 'PLAN', content: 'Deconstructed goal into 3 tool sub-tasks: [sys_backup, pg_dump, telegram_send]', delay: 1100 },
        { type: 'act', tag: 'ACT', content: 'Executing tool `pg_dump` -> /var/backups/db_2026_08_07.sql.gz', delay: 1800 },
        { type: 'observe', tag: 'OBSERVE', content: 'Backup created successfully (14.2 MB compressed, checksum: 9f8a3c)', delay: 2500 },
        { type: 'act', tag: 'ACT', content: 'Executing tool `telegram_send` -> ChatID: #dev-alerts', delay: 3100 },
        { type: 'observe', tag: 'OBSERVE', content: 'HTTP 200 OK | Message ID: 489102 | Response Time: 42ms', delay: 3800 },
        { type: 'reflect', tag: 'REFLECT', content: 'Objective complete. All constraints satisfied with zero memory leaks.', delay: 4400 },
        { type: 'success', tag: 'SUCCESS', content: '✓ Task execution finished in 4.22s. Returning to standby state.', delay: 5000 },
      ],
    },
    {
      id: "adb",
      name: "Android ADB Remote",
      icon: "📱",
      command: "malikclaw adb --device 192.168.1.104:5555 --action automate",
      logs: [
        { type: 'sys', tag: 'ADB', content: 'Connecting to ADB daemon at 192.168.1.104:5555 via TCP/IP...', delay: 200 },
        { type: 'sys', tag: 'CONNECTED', content: 'Device online: Galaxy Tab S9 Ultra (Android 15, API 35)', delay: 700 },
        { type: 'plan', tag: 'PLAN', content: 'Generating UI interaction pipeline based on live screenshot OCR matrix', delay: 1300 },
        { type: 'act', tag: 'ACT', content: 'adb shell input tap 540 1280 (Click "Confirm Transfer")', delay: 2000 },
        { type: 'observe', tag: 'OBSERVE', content: 'Frame captured via minicap: UI state changed to `Transfer Completed`', delay: 2800 },
        { type: 'reflect', tag: 'REFLECT', content: 'Confirmation verified via visual diffing (99.8% match rate)', delay: 3500 },
        { type: 'success', tag: 'SUCCESS', content: '✓ Remote Android automation loop completed successfully.', delay: 4200 },
      ],
    },
    {
      id: "urdu",
      name: "Urdu Voice & Agent AI",
      icon: "🇵🇰",
      command: "malikclaw chat --lang ur --prompt 'سسٹم کی کارکردگی کا جائزہ لو'",
      logs: [
        { type: 'sys', tag: 'LANG', content: 'Loading Urdu Natural Language Processor (RTL Engine Active)', delay: 200 },
        { type: 'plan', tag: 'PLAN', content: 'مقصود کو سمجھا گیا: "سسٹم مانیٹرنگ اور میٹرکس رپورٹ"', delay: 800 },
        { type: 'act', tag: 'ACT', content: 'Collecting metrics: CPU Load, Memory Footprint, SBC Temperature...', delay: 1500 },
        { type: 'observe', tag: 'OBSERVE', content: 'CPU: 1.4% | RAM: 8.4MB | Temp: 38°C (All parameters nominal)', delay: 2200 },
        { type: 'urdu', tag: 'RESPONSE', content: '"تمام سسٹمز بالکل ٹھیک کام کر رہے ہیں۔ میموری صرف 8.4MB ہے۔"', delay: 3000 },
        { type: 'success', tag: 'SUCCESS', content: t.terminal.slogan, delay: 3800 },
      ],
    },
  ];

  const currentScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  useEffect(() => {
    setVisibleLogs([]);
    setCurrentIndex(0);
    if (!isPlaying) return;

    const timers = currentScenario.logs.map((log, index) => {
      return setTimeout(() => {
        setCurrentIndex(index + 1);
        setVisibleLogs(prev => [...prev, log]);
      }, log.delay);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [activeScenarioId, isPlaying]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLogs]);

  const handleCopyLogs = () => {
    const text = visibleLogs.map(l => `[${l.tag}] ${l.content}`).join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRestart = () => {
    setVisibleLogs([]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const getTagBadgeStyle = (type: LogType) => {
    switch (type) {
      case 'sys':
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'plan':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'act':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'observe':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'reflect':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'urdu':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-urdu';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getContentStyle = (type: LogType) => {
    switch (type) {
      case 'sys':
        return 'text-zinc-400';
      case 'plan':
        return 'text-amber-200 font-medium';
      case 'act':
        return 'text-blue-300 font-mono';
      case 'observe':
        return 'text-cyan-300 font-mono';
      case 'reflect':
        return 'text-purple-300';
      case 'success':
        return 'text-emerald-400 font-bold';
      case 'urdu':
        return 'text-amber-300 font-urdu text-base font-bold';
      default:
        return 'text-zinc-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl glass-panel rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left font-mono relative"
    >
      {/* Terminal Window Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-950/90 gap-3">
        <div className="flex items-center gap-3">
          {/* macOS Style Window Controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/50 inline-block" />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800 text-xs text-zinc-400">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-zinc-300">malikclaw shell</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE SIMULATION
          </div>
        </div>

        {/* Controls: Scenario Switcher + Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          {/* Scenario Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  setIsPlaying(true);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeScenarioId === sc.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{sc.icon}</span>
                <span className="hidden sm:inline">{sc.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
              title="Replay Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
              title="Copy Output"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Command Input Prompt Header */}
      <div className="px-5 py-2.5 bg-zinc-950/60 border-b border-zinc-800/60 text-xs sm:text-sm text-zinc-300 flex items-center gap-2 overflow-x-auto">
        <span className="text-amber-400 font-bold select-none">🦅 gryphon@edge:~$</span>
        <span className="text-zinc-200 font-mono font-medium">{currentScenario.command}</span>
      </div>

      {/* Terminal Animated Logs Viewport */}
      <div className="p-5 text-left font-mono text-xs sm:text-sm leading-relaxed min-h-[290px] max-h-[360px] overflow-y-auto space-y-2.5 bg-black/40">
        <AnimatePresence>
          {visibleLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2.5"
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${getTagBadgeStyle(log.type)}`}>
                {log.tag}
              </span>
              <span className={`break-words ${getContentStyle(log.type)}`}>
                {log.content}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {currentIndex < currentScenario.logs.length && isPlaying && (
          <div className="flex items-center gap-2 text-zinc-500 pt-1">
            <span className="animate-spin text-amber-400 text-xs">⚡</span>
            <span className="text-xs italic text-zinc-500">Agent executing next step...</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-amber-400"
            />
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Telemetry Footer Bar */}
      <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-950/90 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-amber-400" />
            <span>CPU: <strong className="text-zinc-200">1.2%</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3 h-3 text-blue-400" />
            <span>RAM: <strong className="text-zinc-200">8.4 MB</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Go Threads: <strong className="text-zinc-200">14</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400">
          <Shield className="w-3 h-3 text-amber-400" />
          <span>Local Engine Active</span>
        </div>
      </div>
    </motion.div>
  );
}

