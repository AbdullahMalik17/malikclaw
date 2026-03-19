"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Language, translations } from "@/i18n/translations";

interface TerminalDemoProps {
  language: Language;
}

interface TerminalLine {
  type: 'comment' | 'command' | 'output' | 'success' | 'slogan';
  content: string;
  delay: number;
}

export default function TerminalDemo({ language }: TerminalDemoProps) {
  const t = translations[language];
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const terminalLines: TerminalLine[] = [
    { type: 'comment', content: t.terminal.comment, delay: 0 },
    { type: 'command', content: t.terminal.command1, delay: 500 },
    { type: 'command', content: t.terminal.command2, delay: 1500 },
    { type: 'output', content: t.terminal.booting, delay: 2000 },
    { type: 'success', content: t.terminal.ready, delay: 2800 },
    { type: 'success', content: t.terminal.memory, delay: 3200 },
    { type: 'slogan', content: t.terminal.slogan, delay: 4000 },
  ];

  useEffect(() => {
    setVisibleLines([]);
    setCurrentIndex(0);

    const timers = terminalLines.map((line, index) => {
      return setTimeout(() => {
        setCurrentIndex(index + 1);
        setVisibleLines(prev => [...prev, line]);
      }, line.delay);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [language]);

  const getLineStyle = (type: TerminalLine['type']) => {
    switch (type) {
      case 'comment':
        return 'text-zinc-500 italic';
      case 'command':
        return 'text-zinc-300';
      case 'output':
        return 'text-zinc-500';
      case 'success':
        return 'text-gryphon-gold';
      case 'slogan':
        return 'text-zinc-400 mt-2 font-bold';
      default:
        return 'text-zinc-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-16 w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_-12px_rgba(234,179,8,0.2)]"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40">
        <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
        <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
        <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
        <span className="ml-2 text-xs text-zinc-500 font-mono">malikclaw shell</span>
      </div>
      <div className="p-4 sm:p-6 text-left font-mono text-sm sm:text-base leading-relaxed min-h-[280px]">
        {visibleLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${line.type === 'command' ? '' : ''}`}
          >
            {line.type === 'command' && (
              <span className="text-gryphon-gold mr-2">🦅</span>
            )}
            <span className={getLineStyle(line.type)}>
              {line.content}
            </span>
          </motion.div>
        ))}
        {currentIndex < terminalLines.length && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-5 bg-gryphon-gold ml-1"
          />
        )}
      </div>
    </motion.div>
  );
}
