"use client";

import { Language, translations } from "@/i18n/translations";
import { ShieldCheck, Server } from "lucide-react";

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const t = translations[language];

  return (
    <footer className="border-t border-white/10 py-12 text-center text-sm text-zinc-500">
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <a href="https://a2as.org/certified/agents/abdullahmalik17/deep-research-age" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gryphon-gold transition-colors">
          <ShieldCheck className="w-4 h-4" />
          <span>A2AS Certified</span>
        </a>
        <a href="https://mcpmarket.com/ko/server/malikclaw" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gryphon-gold transition-colors">
          <Server className="w-4 h-4" />
          <span>Project MCP</span>
        </a>
      </div>
      <p>
        {t.footer.builtWith}
      </p>
      <p className="mt-2 text-xs">
        {t.footer.copyright}
      </p>
    </footer>
  );
}
