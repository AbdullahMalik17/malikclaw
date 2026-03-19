"use client";

import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";

interface ComparisonProps {
  language: Language;
}

export default function Comparison({ language }: ComparisonProps) {
  const t = translations[language];

  return (
    <section className="w-full py-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tight text-white">
          {t.comparison.title}
        </h2>
        <p className="text-zinc-400 mt-2 text-lg">
          {t.comparison.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-1"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-6 px-8 font-semibold text-zinc-400">{t.comparison.metric}</th>
              <th className="py-6 px-8 font-semibold text-zinc-400">OpenClaw</th>
              <th className="py-6 px-8 font-bold text-gryphon-gold bg-gryphon-gold/5 rounded-t-2xl">MalikClaw 🦅</th>
            </tr>
          </thead>
          <tbody className="text-sm sm:text-base">
            <motion.tr 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border-t border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-5 px-8 font-medium text-white">{t.comparison.language}</td>
              <td className="py-5 px-8 text-zinc-500 italic font-mono">{t.comparison.typescript}</td>
              <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5 font-mono">{t.comparison.go}</td>
            </motion.tr>
            <motion.tr 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="border-t border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-5 px-8 font-medium text-white">{t.comparison.ram}</td>
              <td className="py-5 px-8 text-zinc-500">{t.comparison.ram1GB}</td>
              <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5">{t.comparison.ram10MB}</td>
            </motion.tr>
            <motion.tr 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="border-t border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-5 px-8 font-medium text-white">{t.comparison.startup}</td>
              <td className="py-5 px-8 text-zinc-500">{t.comparison.startup500s}</td>
              <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5">{t.comparison.startup1s}</td>
            </motion.tr>
            <motion.tr 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="border-t border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-5 px-8 font-medium text-white">{t.comparison.cost}</td>
              <td className="py-5 px-8 text-zinc-500">{t.comparison.costMac}</td>
              <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5 rounded-b-2xl">{t.comparison.costSBC}</td>
            </motion.tr>
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
