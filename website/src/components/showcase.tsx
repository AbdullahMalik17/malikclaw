"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";

interface ShowcaseProps {
  language: Language;
}

const hardwareSetups = [
  {
    id: 'licheepi',
    image: '/assets/licheervnano.png',
    icon: '🔹',
  },
  {
    id: 'raspberry-pi',
    image: '/assets/nano_bana_pro.jpg',
    icon: '🥧',
  },
  {
    id: 'termux',
    image: '/assets/termux.jpg',
    icon: '📱',
  },
];

export default function Showcase({ language }: ShowcaseProps) {
  const t = translations[language];

  return (
    <section className="w-full py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tight text-white">
          {t.showcase.title}
        </h2>
        <p className="text-zinc-400 mt-2 text-lg">
          {t.showcase.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* LicheePi Nano */}
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
        >
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={hardwareSetups[0].image}
              alt="MalikClaw running on LicheePi Nano RISC-V board"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">{hardwareSetups[0].icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">
              {t.showcase.licheePi}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.showcase.licheePiDesc}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gryphon-gold">
              <div className="w-2 h-2 rounded-full bg-gryphon-gold animate-pulse"></div>
              <span>RISC-V · 32MB RAM · $10</span>
            </div>
          </div>
        </motion.div>

        {/* Raspberry Pi Zero 2 W */}
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
        >
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={hardwareSetups[1].image}
              alt="MalikClaw running on Raspberry Pi Zero 2 W edge hardware"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">{hardwareSetups[1].icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">
              {t.showcase.raspberryPi}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.showcase.raspberryPiDesc}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gryphon-gold">
              <div className="w-2 h-2 rounded-full bg-gryphon-gold animate-pulse"></div>
              <span>ARM64 · Quad-core · $15</span>
            </div>
          </div>
        </motion.div>

        {/* Android Termux */}
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
        >
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={hardwareSetups[2].image}
              alt="MalikClaw running on Android phone with Termux and Proot"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">{hardwareSetups[2].icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">
              {t.showcase.termux}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.showcase.termuxDesc}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gryphon-gold">
              <div className="w-2 h-2 rounded-full bg-gryphon-gold animate-pulse"></div>
              <span>ARM64 · Proot · Free</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Agent Capabilities Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mt-32 mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tight text-white">
          {language === 'ur' ? 'ایجنٹ کی صلاحیتیں' : 'Agent Capabilities'}
        </h2>
        <p className="text-zinc-400 mt-2 text-lg">
          {language === 'ur' 
            ? 'خودکار کام، کوڈ جنریشن، اور میموری کا انتظام۔' 
            : 'Automated tasks, code generation, and memory management.'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ y: -8 }}
          className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] transition-all hover:border-gryphon-gold/30 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)]"
        >
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src="/assets/malikclaw_code.png"
              alt="MalikClaw Code Generation"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
          </div>
          <div className="relative p-8 pt-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'ur' ? 'انٹیلیجنٹ کوڈنگ' : 'Intelligent Coding'}
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              {language === 'ur' 
                ? 'کسی بھی زبان میں اعلیٰ معیار کا کوڈ لکھیں اور ڈیبگ کریں۔' 
                : 'Write and debug high-quality code in any language with ease.'}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] transition-all hover:border-gryphon-gold/30 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)]"
        >
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src="/assets/malikclaw_scedule.png"
              alt="MalikClaw Task Scheduling"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
          </div>
          <div className="relative p-8 pt-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'ur' ? 'ٹاسک شیڈولنگ' : 'Advanced Scheduling'}
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              {language === 'ur' 
                ? 'اپنے روزمرہ کے کاموں کو ایجنٹ کے ذریعے خودکار بنائیں۔' 
                : 'Automate your daily workflows with powerful task scheduling.'}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] transition-all hover:border-gryphon-gold/30 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)]"
        >
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src="/assets/malikclaw_search.png"
              alt="MalikClaw Web Search"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
          </div>
          <div className="relative p-8 pt-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'ur' ? 'ویب سرچ اور ریسرچ' : 'Web Research'}
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              {language === 'ur' 
                ? 'انٹرنیٹ سے معلومات تلاش کریں اور خلاصہ تیار کریں۔' 
                : 'Browse and analyze live web data for deep research insights.'}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] transition-all hover:border-gryphon-gold/30 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)]"
        >
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src="/assets/malikclaw_memory.png"
              alt="MalikClaw Long-term Memory"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
          </div>
          <div className="relative p-8 pt-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'ur' ? 'طویل مدتی میموری' : 'Contextual Memory'}
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              {language === 'ur' 
                ? 'ایجنٹ آپ کی ترجیحات اور ماضی کی گفتگو کو یاد رکھتا ہے۔' 
                : 'Remember your preferences and past context across sessions.'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Additional Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-gryphon-gold/10 via-gryphon-gold/5 to-gryphon-gold/10 border border-gryphon-gold/20 text-center"
      >
        <p className="text-zinc-300 text-lg mb-4">
          {language === 'ur' 
            ? '✨ مزید تعیناتی کیسز انتظار میں ہیں! اپنا سیٹ اپ کمیونٹی کے ساتھ شیئر کریں۔'
            : '✨ More Deployment Cases Await! Share your setup with the community.'}
        </p>
        <a
          href="https://github.com/AbdullahMalik17/malikclaw/discussions"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-gryphon-gold font-medium hover:text-white transition-colors"
        >
          <span>{language === 'ur' ? 'کمیونٹی میں شامل ہوں' : 'Join Community Discussion'}</span>
          <span className="text-lg">→</span>
        </a>
      </motion.div>
    </section>
  );
}
