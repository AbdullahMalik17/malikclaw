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
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tight">{t.features.title}</h2>
        <p className="text-zinc-400 mt-2 text-lg">{t.features.subtitle}</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]"
      >
        {/* Feature 1: Large - Urdu First */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 md:row-span-2 p-10 rounded-[2rem] bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-white/5 hover:border-gryphon-gold/30 transition-all duration-500 group overflow-hidden relative shadow-2xl hover:shadow-[0_0_40px_rgba(234,179,8,0.1)]"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gryphon-gold/20 to-gryphon-gold/5 border border-gryphon-gold/20 flex items-center justify-center mb-8 shadow-inner"
              >
                <Globe className="w-8 h-8 text-gryphon-gold" />
              </motion.div>
            <h3 className="text-3xl font-black mb-4 text-white tracking-tight">
              {t.features.urduFirst}
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              {t.features.urduFirstDesc}
            </p>
            </div>
            <div className="mt-8 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gryphon-gold/30 to-white/10 font-urdu italic">
              آگے بڑھو، ملک کلاؤ!
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-gryphon-gold/10 rounded-full blur-[80px] group-hover:bg-gryphon-gold/20 group-hover:scale-110 transition-all duration-700"></div>
          <div className="absolute inset-0 rounded-[inherit] border border-white/5 pointer-events-none mix-blend-overlay"></div>
        </motion.div>

        {/* Feature 2: Small - RAM */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
        >
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner relative z-10"
          >
            <Zap className="w-7 h-7 text-zinc-300 group-hover:text-gryphon-gold transition-colors" />
          </motion.div>
          <h3 className="text-xl font-bold mb-3 text-white relative z-10">
            {t.features.memory}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed relative z-10">
            {t.features.memoryDesc}
          </p>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gryphon-gold/5 rounded-full blur-2xl group-hover:bg-gryphon-gold/10 transition-colors"></div>
        </motion.div>

        {/* Feature 3: Small - Boot */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
        >
          <motion.div 
            whileHover={{ rotate: -12, scale: 1.1 }}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner relative z-10"
          >
            <ShieldCheck className="w-7 h-7 text-zinc-300 group-hover:text-blue-400 transition-colors" />
          </motion.div>
          <h3 className="text-xl font-bold mb-3 text-white relative z-10">
            {t.features.boot}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed relative z-10">
            {t.features.bootDesc}
          </p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        </motion.div>

        {/* Feature 4: Wide - Android */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.01 }}
          className="md:col-span-3 p-8 md:p-10 rounded-[2rem] bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
        >
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 shrink-0 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner relative z-10"
          >
            <Smartphone className="w-10 h-10 text-blue-400" />
          </motion.div>
          <div className="text-center md:text-left relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              {t.features.android}
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
              {t.features.androidDesc}
            </p>
          </div>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-12 blur-3xl pointer-events-none"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
