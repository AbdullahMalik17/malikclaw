"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Language } from "@/i18n/translations";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Comparison from "@/components/comparison";
import Download from "@/components/download";
import Showcase from "@/components/showcase";
import Integrations from "@/components/integrations";
import EnterpriseSafety from "@/components/enterprise-safety";
import SocialProofMarquee from "@/components/social-proof-marquee";
import Footer from "@/components/footer";

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isRTL = language === 'ur';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-gryphon-gold/30 relative overflow-hidden ${isRTL ? 'rtl font-urdu' : ''}`}>
      {/* Global Mouse Spotlight */}
      <motion.div
        className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full pointer-events-none blur-[100px] z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />
      <Navigation 
        isUrdu={isRTL} 
        language={language} 
        onLanguageChange={setLanguage} 
      />
      
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <Hero language={language} />
        <Features language={language} />
        <Comparison language={language} />
        <EnterpriseSafety language={language} />
        <Showcase language={language} />
        <Integrations language={language} />
        <Download language={language} />
      </main>
      
      <SocialProofMarquee language={language} />
      <Footer language={language} />
    </div>
  );
}
