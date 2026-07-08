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


      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-16 relative z-10 font-mono"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background border border-card-border text-sm mb-6">
          <span className="w-2 h-2 bg-green-500"></span>
          <span className="text-text-muted font-bold uppercase tracking-wider">Over 10+ Native Channels</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
          {t.integrations.title}
        </h2>
        <p className="text-text-muted mt-4 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          {t.integrations.subtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[1px] bg-card-border border border-card-border max-w-7xl mx-auto relative z-10">
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
                backgroundColor: "rgba(128, 128, 128, 0.05)"
              }}
              className="flex flex-col items-center justify-center p-8 bg-card-bg transition-all duration-300 group cursor-pointer relative hover:z-20"
            >
              <div 
                className="w-16 h-16 bg-background border border-card-border flex items-center justify-center mb-4 transition-all duration-300 relative z-10"
                style={{ color: item.color }}
              >
                <Icon size={32} />
              </div>
              <span className="text-text-muted font-bold group-hover:text-foreground transition-colors tracking-wide relative z-10">
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
            backgroundColor: "rgba(128, 128, 128, 0.05)"
          }}
          className="flex flex-col items-center justify-center p-8 bg-card-bg transition-all duration-300 group cursor-pointer hover:z-20"
        >
          <div className="w-16 h-16 bg-background border border-card-border flex items-center justify-center mb-4 text-text-muted group-hover:text-gryphon-gold transition-all duration-300">
            <Plus size={32} />
          </div>
          <span className="text-text-muted font-bold group-hover:text-gryphon-gold transition-colors tracking-wide">
            {t.integrations.more}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
