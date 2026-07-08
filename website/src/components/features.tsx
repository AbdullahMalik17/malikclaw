"use client";

import { Globe, Zap, ShieldCheck, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";

interface FeaturesProps {
  language: Language;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export default function Features({ language }: FeaturesProps) {
  const t = translations[language];

  return (
    <section id="features" className="w-full py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 font-mono"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground uppercase">{t.features.title}</h2>
        <p className="text-text-muted mt-2 text-lg">{t.features.subtitle}</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-card-border border border-card-border auto-rows-[240px]"
      >
        {/* Feature 1: Large - Agentic Loop */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 md:row-span-2 p-10 bg-card-bg transition-colors group relative cursor-default"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-16 h-16 bg-background border border-card-border flex items-center justify-center mb-8">
                <Zap className="w-8 h-8 text-gryphon-gold" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-foreground font-mono uppercase">
                Production-Grade Agent Loop
              </h3>
              <p className="text-text-muted text-lg leading-relaxed max-w-md">
                MalikClaw executes a full PLAN → ACT → OBSERVE → REFLECT cycle, enabling truly autonomous task completion on any device.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-card-border" />
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Autonomous Intelligence</span>
            </div>
          </div>
        </motion.div>

        {/* Feature 2: Small - RAM */}
        <motion.div 
          variants={itemVariants}
          className="p-8 bg-card-bg transition-colors group relative"
        >
          <div className="w-14 h-14 bg-background border border-card-border flex items-center justify-center mb-6">
            <Globe className="w-7 h-7 text-text-muted group-hover:text-gryphon-gold transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground font-mono uppercase">
            {t.features.memory}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {t.features.memoryDesc}
          </p>
        </motion.div>

        {/* Feature 3: Small - Boot */}
        <motion.div 
          variants={itemVariants}
          className="p-8 bg-card-bg transition-colors group relative"
        >
          <div className="w-14 h-14 bg-background border border-card-border flex items-center justify-center mb-6">
            <ShieldCheck className="w-7 h-7 text-text-muted group-hover:text-gryphon-gold transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground font-mono uppercase">
            {t.features.boot}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {t.features.bootDesc}
          </p>
        </motion.div>

        {/* Feature 4: Wide - Android */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-3 p-8 md:p-10 bg-card-bg transition-colors group relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
        >
          <div className="w-20 h-20 shrink-0 bg-background border border-card-border flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-gryphon-gold" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground font-mono uppercase">
              {t.features.android}
            </h3>
            <p className="text-text-muted text-lg leading-relaxed max-w-2xl">
              {t.features.androidDesc}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
