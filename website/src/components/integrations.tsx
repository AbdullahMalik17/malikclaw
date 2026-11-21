"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { MessageSquare, Mail, Briefcase, Hash, Slack, Send, Plus, Twitter, Linkedin, Video, MessageCircle, Layers } from "lucide-react";

interface IntegrationsProps {
  language: Language;
}

const integrationItems = [
  { name: "whatsapp" as const, icon: MessageSquare, color: "#15803D", darkColor: "#25D366", bg: "rgba(37, 211, 102, 0.12)" },
  { name: "telegram" as const, icon: Send, color: "#0369A1", darkColor: "#38BDF8", bg: "rgba(0, 136, 204, 0.12)" },
  { name: "discord" as const, icon: Hash, color: "#4338CA", darkColor: "#818CF8", bg: "rgba(88, 101, 242, 0.12)" },
  { name: "slack" as const, icon: Slack, color: "#B45309", darkColor: "#ECB22E", bg: "rgba(236, 178, 46, 0.14)" },
  { name: "gmail" as const, icon: Mail, color: "#B91C1C", darkColor: "#F87171", bg: "rgba(234, 67, 53, 0.12)" },
  { name: "odoo" as const, icon: Briefcase, color: "#7E22CE", darkColor: "#C084FC", bg: "rgba(135, 90, 123, 0.14)" },
  { name: "twitter" as const, icon: Twitter, color: "#0369A1", darkColor: "#38BDF8", bg: "rgba(29, 161, 242, 0.12)" },
  { name: "linkedin" as const, icon: Linkedin, color: "#1D4ED8", darkColor: "#60A5FA", bg: "rgba(10, 102, 194, 0.12)" },
  { name: "reddit" as const, icon: MessageCircle, color: "#C2410C", darkColor: "#FB923C", bg: "rgba(255, 69, 0, 0.12)" },
  { name: "tiktok" as const, icon: Video, color: "#BE123C", darkColor: "#FB7185", bg: "rgba(255, 0, 80, 0.12)" },
];

export default function Integrations({ language }: IntegrationsProps) {
  const t = translations[language];
  const isUrdu = language === "ur";

  return (
    <section
      aria-labelledby="integrations-heading"
      dir={isUrdu ? "rtl" : "ltr"}
      className="w-full py-24 relative overflow-hidden font-mono px-4 sm:px-6 max-w-6xl mx-auto"
    >
      {/* Subtle Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-800 dark:text-cyan-400 mb-4 shadow-sm">
          <Layers className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.integrations.badge}</span>
        </div>
        <h2
          id="integrations-heading"
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isUrdu ? "font-urdu" : "uppercase"}`}
        >
          {t.integrations.title}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isUrdu ? "font-urdu" : ""}`}>
          {t.integrations.subtitle}
        </p>
      </motion.div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 relative z-10">
        {integrationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card-bg border border-card-border backdrop-blur-xl transition-colors duration-200 hover:border-amber-500/45 group cursor-default"
            >
              <div
                className="w-13 h-13 rounded-xl flex items-center justify-center mb-3 border border-card-border [color:var(--icon-light)] dark:[color:var(--icon-dark)]"
                style={
                  {
                    backgroundColor: item.bg,
                    "--icon-light": item.color,
                    "--icon-dark": item.darkColor,
                  } as CSSProperties
                }
              >
                <Icon size={26} aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-foreground transition-colors tracking-wide text-center font-sans">
                {t.integrations[item.name]}
              </span>
            </motion.div>
          );
        })}

        {/* More item / MCP support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: integrationItems.length * 0.04 }}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card-bg border border-card-border backdrop-blur-xl transition-colors duration-200 hover:border-amber-500/45 group cursor-default"
        >
          <div className="w-13 h-13 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-700 dark:text-amber-400">
            <Plus size={26} aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 transition-colors tracking-wide text-center font-sans">
            {t.integrations.customMcp}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
