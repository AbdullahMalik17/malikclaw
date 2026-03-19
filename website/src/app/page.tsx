"use client";

import { useState } from "react";
import { Language } from "@/i18n/translations";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Comparison from "@/components/comparison";
import Download from "@/components/download";
import Showcase from "@/components/showcase";
import Integrations from "@/components/integrations";
import Footer from "@/components/footer";

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const isRTL = language === 'ur';

  return (
    <div className={`min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-gryphon-gold/30 ${isRTL ? 'rtl font-urdu' : ''}`}>
      <Navigation 
        isUrdu={isRTL} 
        language={language} 
        onLanguageChange={setLanguage} 
      />
      
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <Hero language={language} />
        <Features language={language} />
        <Comparison language={language} />
        <Showcase language={language} />
        <Integrations language={language} />
        <Download language={language} />
      </main>
      
      <Footer language={language} />
    </div>
  );
}
