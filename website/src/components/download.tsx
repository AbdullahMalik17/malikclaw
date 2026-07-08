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
        <h2 className="text-4xl font-bold tracking-tight text-foreground uppercase">{t.download.title}</h2>
        <p className="text-text-muted mt-2 text-lg">{t.download.subtitle}</p>
        
        {/* GitHub Stats */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-3 text-foreground px-4 py-2 bg-card-bg border border-card-border">
              <div className="w-2 h-2 bg-gryphon-gold animate-pulse"></div>
              <span className="font-semibold">{stars.toLocaleString()} ⭐ <span className="text-text-muted font-normal">{language === 'ur' ? 'ستارے' : 'Stars'}</span></span>
            </div>
            <div className="flex items-center gap-3 text-foreground px-4 py-2 bg-card-bg border border-card-border">
              <div className="w-2 h-2 bg-green-500"></div>
              <span className="font-semibold"><span className="text-text-muted font-normal">{language === 'ur' ? 'تازہ ترین' : 'Latest:'}</span> {latestRelease}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-card-border border border-card-border"
      >
        {/* Windows */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 bg-card-bg transition-all duration-300 group relative overflow-hidden z-10 hover:z-20"
        >
          <div className="w-14 h-14 bg-background border border-card-border flex items-center justify-center mb-6 relative z-10">
            <Globe className="w-7 h-7 text-[#0df2c9]" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground relative z-10">{t.download.windows}</h3>
          <p className="text-text-muted text-sm mb-6 relative z-10">{t.download.windowsDesc}</p>
          <div className="space-y-3 relative z-10">
            <a
              href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip"
              className="block w-full py-3 px-4 bg-foreground text-background font-bold text-center hover:opacity-90 transition-opacity text-sm uppercase tracking-wider font-mono"
            >
              {t.download.downloadExe}
            </a>
          </div>
        </motion.div>

        {/* Linux */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 bg-card-bg transition-all duration-300 group relative overflow-hidden z-10 hover:z-20"
        >
          <div className="w-14 h-14 bg-background border border-card-border flex items-center justify-center mb-6 relative z-10">
            <Cpu className="w-7 h-7 text-[#0df2c9]" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground relative z-10">{t.download.linux}</h3>
          <p className="text-text-muted text-sm mb-6 relative z-10">{t.download.linuxDesc}</p>
          <div className="space-y-3 relative z-10">
            <a
              href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz"
              className="block w-full py-3 px-4 bg-foreground text-background font-bold text-center hover:opacity-90 transition-opacity text-sm uppercase tracking-wider font-mono"
            >
              {t.download.downloadBinary}
            </a>
          </div>
        </motion.div>

        {/* Android */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 bg-card-bg transition-all duration-300 group relative overflow-hidden z-10 hover:z-20"
        >
          <div className="w-14 h-14 bg-background border border-card-border flex items-center justify-center mb-6 relative z-10">
            <Smartphone className="w-7 h-7 text-[#8e2de2]" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground relative z-10">{t.download.android}</h3>
          <p className="text-text-muted text-sm mb-6 relative z-10">{t.download.androidDesc}</p>
          <div className="space-y-3 relative z-10">
            <Link
              href="/docs/installation/android"
              className="block w-full py-3 px-4 bg-transparent border border-card-border text-foreground font-bold text-center hover:bg-foreground/5 transition-colors text-sm uppercase tracking-wider font-mono"
            >
              {t.nav.setupGuide}
            </Link>
          </div>
        </motion.div>

        {/* Docker */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-8 bg-card-bg transition-all duration-300 group relative overflow-hidden z-10 hover:z-20"
        >
          <div className="w-14 h-14 bg-background border border-card-border flex items-center justify-center mb-6 relative z-10">
            <Terminal className="w-7 h-7 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground relative z-10">{t.download.docker}</h3>
          <p className="text-text-muted text-sm mb-6">{t.download.dockerDesc}</p>
          <div className="space-y-3">
            <code className="block p-3 bg-background text-xs text-gryphon-gold font-mono border border-card-border">
              docker pull malikclaw/gateway
            </code>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
