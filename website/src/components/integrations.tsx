"use client";

import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { MessageSquare, Mail, Briefcase, Hash, Slack, Send, Plus } from "lucide-react";

interface IntegrationsProps {
  language: Language;
}

const integrationItems = [
  { name: "whatsapp", icon: MessageSquare, color: "#25D366" },
  { name: "gmail", icon: Mail, color: "#EA4335" },
  { name: "odoo", icon: Briefcase, color: "#875A7B" },
  { name: "discord", icon: Hash, color: "#5865F2" },
  { name: "slack", icon: Slack, color: "#4A154B" },
  { name: "telegram", icon: Send, color: "#0088CC" },
];

export default function Integrations({ language }: IntegrationsProps) {
  const t = translations[language];

  return (
    <section className="w-full py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tight text-white">
          {t.integrations.title}
        </h2>
        <p className="text-zinc-400 mt-2 text-lg">
          {t.integrations.subtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {integrationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ 
                y: -10, 
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderColor: `${item.color}50`
              }}
              className="flex flex-col items-center justify-center p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] backdrop-blur-sm transition-all group"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                style={{ backgroundColor: `${item.color}15`, color: item.color, boxShadow: `0 0 20px ${item.color}10` }}
              >
                <Icon size={32} />
              </div>
              <span className="text-zinc-400 font-semibold group-hover:text-white transition-colors tracking-wide">
                {t.integrations[item.name as keyof typeof t.integrations]}
              </span>
            </motion.div>
          );
        })}

        {/* More item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 6 * 0.05 }}
          whileHover={{ y: -10, borderColor: "rgba(234, 179, 8, 0.5)" }}
          className="flex flex-col items-center justify-center p-8 rounded-[2rem] border border-dashed border-white/10 bg-transparent transition-all group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-white/5 text-zinc-500 group-hover:text-gryphon-gold group-hover:bg-gryphon-gold/10 transition-all">
            <Plus size={32} />
          </div>
          <span className="text-zinc-500 font-semibold group-hover:text-gryphon-gold transition-colors tracking-wide">
            {t.integrations.more}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
