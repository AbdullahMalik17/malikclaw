"use client";

import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { MessageSquare, Mail, Briefcase, Hash, Slack, Send, Plus, Twitter, Linkedin, Video, MessageCircle, Layers } from "lucide-react";

interface IntegrationsProps {
  language: Language;
}

const integrationItems = [
  { name: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "#25D366", bg: "rgba(37, 211, 102, 0.1)" },
  { name: "telegram", label: "Telegram", icon: Send, color: "#0088CC", bg: "rgba(0, 136, 204, 0.1)" },
  { name: "discord", label: "Discord", icon: Hash, color: "#5865F2", bg: "rgba(88, 101, 242, 0.1)" },
  { name: "slack", label: "Slack", icon: Slack, color: "#ECB22E", bg: "rgba(236, 178, 46, 0.1)" },
  { name: "gmail", label: "Gmail", icon: Mail, color: "#EA4335", bg: "rgba(234, 67, 53, 0.1)" },
  { name: "odoo", label: "Odoo ERP", icon: Briefcase, color: "#875A7B", bg: "rgba(135, 90, 123, 0.1)" },
  { name: "twitter", label: "Twitter / X", icon: Twitter, color: "#1DA1F2", bg: "rgba(29, 161, 242, 0.1)" },
  { name: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2", bg: "rgba(10, 102, 194, 0.1)" },
  { name: "reddit", label: "Reddit", icon: MessageCircle, color: "#FF4500", bg: "rgba(255, 69, 0, 0.1)" },
  { name: "tiktok", label: "TikTok", icon: Video, color: "#FF0050", bg: "rgba(255, 0, 80, 0.1)" },
];

export default function Integrations({ language }: IntegrationsProps) {
  const t = translations[language];

  return (
    <section className="w-full py-24 relative overflow-hidden font-mono px-4 sm:px-6 max-w-6xl mx-auto">
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Layers className="w-3.5 h-3.5" />
          <span>EXTENSIBLE MCP & APIS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          {t.integrations.title}
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans">
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
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] group cursor-default"
            >
              <div 
                className="w-13 h-13 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 border border-white/5"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <Icon size={26} />
              </div>
              <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors tracking-wide text-center font-sans">
                {item.label}
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
          whileHover={{ y: -4, scale: 1.02 }}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] group cursor-default"
        >
          <div className="w-13 h-13 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400 group-hover:scale-110 transition-transform">
            <Plus size={26} />
          </div>
          <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors tracking-wide text-center font-sans">
            Custom MCP Skills
          </span>
        </motion.div>
      </div>
    </section>
  );
}
