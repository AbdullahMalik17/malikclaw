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
            <div className="flex items-center gap-3 text-zinc-300 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-gryphon-gold animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
              <span className="font-semibold">{stars.toLocaleString()} ⭐ <span className="text-zinc-500 font-normal">{language === 'ur' ? 'ستارے' : 'Stars'}</span></span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              <span className="font-semibold"><span className="text-zinc-500 font-normal">{language === 'ur' ? 'تازہ ترین' : 'Latest:'}</span> {latestRelease}</span>
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
          className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-[#0df2c9]/30 transition-all duration-300 group relative overflow-hidden shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#0df2c9]/10 border border-[#0df2c9]/20 flex items-center justify-center mb-6 relative z-10">
            <Globe className="w-7 h-7 text-[#0df2c9]" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white relative z-10">{t.download.windows}</h3>
          <p className="text-zinc-500 text-sm mb-6 relative z-10">{t.download.windowsDesc}</p>
          <div className="space-y-3 relative z-10">
            <a
              href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip"
              className="block w-full py-3 px-4 rounded-xl bg-[#0df2c9] text-black font-bold text-center hover:bg-[#0bc2a1] transition-colors text-sm shadow-[0_0_15px_rgba(13,242,201,0.2)]"
            >
              {t.download.downloadExe}
            </a>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0df2c9]/10 rounded-full blur-3xl group-hover:bg-[#0df2c9]/20 transition-colors"></div>
        </motion.div>

        {/* Linux */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-[#0df2c9]/30 transition-all duration-300 group relative overflow-hidden shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#0df2c9]/10 border border-[#0df2c9]/20 flex items-center justify-center mb-6 relative z-10">
            <Cpu className="w-7 h-7 text-[#0df2c9]" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white relative z-10">{t.download.linux}</h3>
          <p className="text-zinc-500 text-sm mb-6 relative z-10">{t.download.linuxDesc}</p>
          <div className="space-y-3 relative z-10">
            <a
              href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz"
              className="block w-full py-3 px-4 rounded-xl bg-[#0df2c9] text-black font-bold text-center hover:bg-[#0bc2a1] transition-colors text-sm shadow-[0_0_15px_rgba(13,242,201,0.2)]"
            >
              {t.download.downloadBinary}
            </a>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0df2c9]/10 rounded-full blur-3xl group-hover:bg-[#0df2c9]/20 transition-colors"></div>
        </motion.div>

        {/* Android */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-[#8e2de2]/30 transition-all duration-300 group relative overflow-hidden shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#8e2de2]/10 border border-[#8e2de2]/20 flex items-center justify-center mb-6 relative z-10">
            <Smartphone className="w-7 h-7 text-[#8e2de2]" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white relative z-10">{t.download.android}</h3>
          <p className="text-zinc-500 text-sm mb-6 relative z-10">{t.download.androidDesc}</p>
          <div className="space-y-3 relative z-10">
            <Link
              href="/docs/installation/android"
              className="block w-full py-3 px-4 rounded-xl border border-white/10 text-white font-bold text-center hover:bg-white/5 transition-colors text-sm"
            >
              {t.nav.setupGuide}
            </Link>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8e2de2]/10 rounded-full blur-3xl group-hover:bg-[#8e2de2]/20 transition-colors"></div>
        </motion.div>

        {/* Docker */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 rounded-[2rem] bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 relative z-10">
            <Terminal className="w-7 h-7 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white relative z-10">{t.download.docker}</h3>
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
