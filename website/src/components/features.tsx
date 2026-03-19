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
          className="md:col-span-2 md:row-span-2 p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group overflow-hidden relative"
        >
          <div className="relative z-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6"
            >
              <Globe className="w-8 h-8 text-gryphon-gold" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              {t.features.urduFirst}
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              {t.features.urduFirstDesc}
            </p>
            <div className="mt-8 text-3xl font-bold text-white/20 font-urdu italic">
              آگے بڑھو، ملک کلاؤ!
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gryphon-gold/5 rounded-full blur-3xl group-hover:bg-gryphon-gold/10 transition-colors"></div>
        </motion.div>

        {/* Feature 2: Small - RAM */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
        >
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-12 h-12 rounded-xl bg-gryphon-gold/10 flex items-center justify-center mb-4"
          >
            <Zap className="w-6 h-6 text-gryphon-gold" />
          </motion.div>
          <h3 className="text-lg font-bold mb-2 text-white">
            {t.features.memory}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t.features.memoryDesc}
          </p>
        </motion.div>

        {/* Feature 3: Small - Boot */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
        >
          <motion.div 
            whileHover={{ rotate: -12, scale: 1.1 }}
            className="w-12 h-12 rounded-xl bg-gryphon-gold/10 flex items-center justify-center mb-4"
          >
            <ShieldCheck className="w-6 h-6 text-gryphon-gold" />
          </motion.div>
          <h3 className="text-lg font-bold mb-2 text-white">
            {t.features.boot}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t.features.bootDesc}
          </p>
        </motion.div>

        {/* Feature 4: Small - Android */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="md:col-span-1 p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
        >
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-xl bg-gryphon-gold/10 flex items-center justify-center mb-4"
          >
            <Smartphone className="w-6 h-6 text-gryphon-gold" />
          </motion.div>
          <h3 className="text-lg font-bold mb-2 text-white">
            {t.features.android}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t.features.androidDesc}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
