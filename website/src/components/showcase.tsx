"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Language, translations } from "@/i18n/translations";
import { Sparkles, Cpu, CheckCircle2 } from "lucide-react";

interface ShowcaseProps {
  language: Language;
}

export default function Showcase({ language }: ShowcaseProps) {
  const t = translations[language];
  const isUrdu = language === "ur";

  const hardwareSetups = [
    {
      id: "licheepi",
      name: t.showcase.licheePi,
      desc: t.showcase.licheePiDesc,
      image: "/assets/licheervnano.png",
      tag: "RISC-V • 32MB RAM • $10",
      accent: "text-amber-800 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      id: "raspberry-pi",
      name: t.showcase.raspberryPi,
      desc: t.showcase.raspberryPiDesc,
      image: "/assets/nano_bana_pro.jpg",
      tag: "ARM64 • Quad-Core • $15",
      accent: "text-emerald-800 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      id: "termux",
      name: t.showcase.termux,
      desc: t.showcase.termuxDesc,
      image: "/assets/termux.jpg",
      tag: "ARM64 • Proot • Zero Cost",
      accent: "text-amber-800 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
  ];

  const capabilityImages = [
    "/assets/malikclaw_code.png",
    "/assets/malikclaw_scedule.png",
    "/assets/malikclaw_search.png",
    "/assets/malikclaw_memory.png",
  ];

  return (
    <section
      aria-labelledby="showcase-heading"
      dir={isUrdu ? "rtl" : "ltr"}
      className="w-full py-24 max-w-6xl mx-auto font-mono px-4 sm:px-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-4 shadow-sm">
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.showcase.hardwareBadge}</span>
        </div>
        <h2
          id="showcase-heading"
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isUrdu ? "font-urdu" : "uppercase"}`}
        >
          {t.showcase.title}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isUrdu ? "font-urdu" : ""}`}>
          {t.showcase.subtitle}
        </p>
      </motion.div>

      {/* Hardware Deployments Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {hardwareSetups.map((setup) => (
          <div
            key={setup.id}
            className="group relative overflow-hidden rounded-2xl border border-card-border bg-card-bg backdrop-blur-xl shadow-lg hover:border-amber-500/45 transition-colors flex flex-col justify-between"
          >
            <div className="relative h-52 w-full overflow-hidden bg-black">
              <Image
                src={setup.image}
                alt={setup.name}
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border mb-3 inline-block tabular-nums ${setup.accent}`}>
                  {setup.tag}
                </span>
                <h3 className={`text-lg font-bold text-foreground mb-2 font-sans ${isUrdu ? "font-urdu" : ""}`}>
                  {setup.name}
                </h3>
                <p className={`text-text-muted text-xs leading-relaxed font-sans ${isUrdu ? "font-urdu" : ""}`}>
                  {setup.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-card-border flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.showcase.verified}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Agent Capabilities Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mt-28 mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.showcase.skillsetBadge}</span>
        </div>
        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans ${isUrdu ? "font-urdu" : "uppercase"}`}>
          {t.showcase.capabilitiesTitle}
        </h2>
        <p className={`text-text-muted mt-3 text-base sm:text-lg max-w-2xl mx-auto font-sans ${isUrdu ? "font-urdu" : ""}`}>
          {t.showcase.capabilitiesSubtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {t.showcase.capabilities.map((cap, i) => (
          <div
            key={cap.title}
            className="group relative overflow-hidden rounded-2xl border border-card-border bg-card-bg backdrop-blur-xl shadow-lg hover:border-amber-500/45 transition-colors"
          >
            <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-black">
              <Image
                src={capabilityImages[i % capabilityImages.length]}
                alt={cap.title}
                fill
                className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
            <div className="p-6 relative z-10">
              <h3 className={`text-xl font-bold text-foreground mb-2 font-sans ${isUrdu ? "font-urdu" : ""}`}>
                {cap.title}
              </h3>
              <p className={`text-text-muted text-xs sm:text-sm leading-relaxed font-sans ${isUrdu ? "font-urdu" : ""}`}>
                {cap.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
