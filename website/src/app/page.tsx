"use client";

import { useState } from "react";
import { Language } from "@/i18n/translations";
import NavigationHeader from "@/components/NavigationHeader";
import HeroSection from "@/components/HeroSection";
import TerminalSimulator from "@/components/TerminalSimulator";
import FeaturesBento from "@/components/FeaturesBento";
import BenchmarkTable from "@/components/BenchmarkTable";
import EnterpriseSafety from "@/components/EnterpriseSafety";
import Showcase from "@/components/showcase";
import Integrations from "@/components/integrations";
import Download from "@/components/download";
import SocialProofMarquee from "@/components/social-proof-marquee";
import DeveloperFooter from "@/components/DeveloperFooter";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const isRTL = language === "ur";

  return (
    <div className={`min-h-screen bg-transparent text-zinc-100 font-sans selection:bg-amber-500 selection:text-black relative overflow-hidden ${isRTL ? "rtl font-urdu" : ""}`}>
      {/* Floating Command Header */}
      <NavigationHeader 
        isUrdu={isRTL} 
        language={language} 
        onLanguageChange={setLanguage} 
      />
      
      {/* Main Landing Page Stream */}
      <main className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* 1. Hero Section + QuickInstall + Metrics Strip */}
        <HeroSection language={language} />

        {/* 2. Interactive Terminal Simulator Component */}
        <section className="w-full flex flex-col items-center justify-center my-6 max-w-5xl">
          <TerminalSimulator language={language} />
        </section>

        {/* 3. Features Bento Grid 2.0 & Architecture DAG Flow */}
        <FeaturesBento language={language} />

        {/* 4. Competitive Benchmarks & Hardware Matrix */}
        <BenchmarkTable language={language} />

        {/* 5. Zero-Trust Security & Enterprise Guardrails */}
        <EnterpriseSafety language={language} />

        {/* 6. Real-World Deployments & Agent Skills Showcase */}
        <Showcase language={language} />

        {/* 7. Extensible Native Integrations & MCP Support */}
        <Integrations language={language} />

        {/* 8. Binary Downloads for Windows, Linux, Android, Docker */}
        <Download language={language} />
      </main>
      
      {/* 9. Social Proof Testimonials Marquee */}
      <SocialProofMarquee language={language} />

      {/* 10. High-Conversion CTA & Developer Footer */}
      <DeveloperFooter language={language} />
    </div>
  );
}
