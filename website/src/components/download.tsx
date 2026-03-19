"use client";

import { Cpu, Globe, Smartphone, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Language, translations } from "@/i18n/translations";
import { useGitHubStats } from "@/hooks/use-github-stats";

interface DownloadProps {
  language: Language;
}

export default function Download({ language }: DownloadProps) {
  const t = translations[language];
  const { stars, latestRelease, isLoading } = useGitHubStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section id="download" className="w-full py-24 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tight">{t.download.title}</h2>
        <p className="text-zinc-400 mt-2 text-lg">{t.download.subtitle}</p>
        
        {/* GitHub Stats */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-gryphon-gold animate-pulse"></div>
              <span>{stars.toLocaleString()} ⭐ {language === 'ur' ? 'ستارے' : 'Stars'}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{language === 'ur' ? 'تازہ ترین' : 'Latest:'} {latestRelease}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Windows */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
            <Globe className="w-7 h-7 text-gryphon-gold" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{t.download.windows}</h3>
          <p className="text-zinc-500 text-sm mb-6">{t.download.windowsDesc}</p>
          <div className="space-y-3">
            <a
              href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip"
              className="block w-full py-3 px-4 rounded-xl bg-gryphon-gold text-black font-bold text-center hover:bg-amber-500 transition-colors text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
              {t.download.downloadExe}
            </a>
          </div>
        </motion.div>

        {/* Linux */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
            <Cpu className="w-7 h-7 text-gryphon-gold" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{t.download.linux}</h3>
          <p className="text-zinc-500 text-sm mb-6">{t.download.linuxDesc}</p>
          <div className="space-y-3">
            <a
              href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz"
              className="block w-full py-3 px-4 rounded-xl bg-gryphon-gold text-black font-bold text-center hover:bg-amber-500 transition-colors text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
              {t.download.downloadBinary}
            </a>
          </div>
        </motion.div>

        {/* Android */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
            <Smartphone className="w-7 h-7 text-gryphon-gold" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{t.download.android}</h3>
          <p className="text-zinc-500 text-sm mb-6">{t.download.androidDesc}</p>
          <div className="space-y-3">
            <Link
              href="/docs/installation/android"
              className="block w-full py-3 px-4 rounded-xl border border-white/10 text-white font-bold text-center hover:bg-white/5 transition-colors text-sm"
            >
              {t.nav.setupGuide}
            </Link>
          </div>
        </motion.div>

        {/* Docker */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
            <Terminal className="w-7 h-7 text-gryphon-gold" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{t.download.docker}</h3>
          <p className="text-zinc-500 text-sm mb-6">{t.download.dockerDesc}</p>
          <div className="space-y-3">
            <code className="block p-3 rounded-xl bg-black/50 text-xs text-gryphon-gold font-mono border border-white/5">
              docker pull malikclaw/gateway
            </code>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
