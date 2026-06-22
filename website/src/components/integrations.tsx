"use client";

import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { MessageSquare, Mail, Briefcase, Hash, Slack, Send, Plus, Twitter, Linkedin, Video, MessageCircle } from "lucide-react";

interface IntegrationsProps {
  language: Language;
}

const integrationItems = [
  { name: "whatsapp", icon: MessageSquare, color: "#25D366" },
  { name: "twitter", icon: Twitter, color: "#1DA1F2" },
  { name: "linkedin", icon: Linkedin, color: "#0A66C2" },
  { name: "tiktok", icon: Video, color: "#FF0050" },
  { name: "reddit", icon: MessageCircle, color: "#FF4500" },
  { name: "discord", icon: Hash, color: "#5865F2" },
  { name: "slack", icon: Slack, color: "#4A154B" },
  { name: "telegram", icon: Send, color: "#0088CC" },
  { name: "gmail", icon: Mail, color: "#EA4335" },
  { name: "odoo", icon: Briefcase, color: "#875A7B" },
];

export default function Integrations({ language }: IntegrationsProps) {
  const t = translations[language];

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Animated glowing mesh behind integrations */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center items-center">
        <div className="w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-zinc-300 font-medium">Over 10+ Native Channels</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">
          {t.integrations.title}
        </h2>
        <p className="text-zinc-400 mt-4 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          {t.integrations.subtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-6 max-w-7xl mx-auto relative z-10">
        {integrationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05, 
                type: "spring", 
                stiffness: 100 
              }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: `${item.color}80`,
                boxShadow: `0 15px 35px -5px ${item.color}30, 0 0 15px ${item.color}20`
              }}
              className="flex flex-col items-center justify-center p-8 rounded-[2rem] border border-white/5 bg-[#111]/40 backdrop-blur-md transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${item.color})` }}></div>
              
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-lg relative z-10"
                style={{ backgroundColor: `${item.color}15`, color: item.color, boxShadow: `0 0 20px ${item.color}20` }}
              >
                <Icon size={32} />
              </div>
              <span className="text-zinc-400 font-bold group-hover:text-white transition-colors tracking-wide relative z-10">
                {t.integrations[item.name as keyof typeof t.integrations]}
              </span>
            </motion.div>
          );
        })}

        {/* More item */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: integrationItems.length * 0.05 }}
          whileHover={{ 
            y: -10, 
            scale: 1.05,
            borderColor: "rgba(234, 179, 8, 0.5)",
            boxShadow: "0 15px 35px -5px rgba(234,179,8,0.2)"
          }}
          className="flex flex-col items-center justify-center p-8 rounded-[2rem] border border-dashed border-white/20 bg-transparent transition-all duration-300 group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-white/5 text-zinc-500 group-hover:text-gryphon-gold group-hover:bg-gryphon-gold/15 transition-all duration-300">
            <Plus size={32} />
          </div>
          <span className="text-zinc-500 font-bold group-hover:text-gryphon-gold transition-colors tracking-wide">
            {t.integrations.more}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
