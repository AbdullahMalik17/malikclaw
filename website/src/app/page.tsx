"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Zap, Smartphone, Feather, ShieldCheck, Download, Terminal, Cpu, Globe, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [isUrdu, setIsUrdu] = useState(false);

  return (
    <div className={`min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-gryphon-gold/30 ${isUrdu ? 'rtl font-urdu' : ''}`}>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter text-white">MalikClaw 🦅</span>
            <span className="px-2 py-0.5 rounded-full bg-gryphon-gold/10 text-gryphon-gold text-xs font-medium border border-gryphon-gold/20">
              v0.1.1
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">{isUrdu ? "خصوصیات" : "Features"}</a>
            <a href="#download" className="hover:text-white transition-colors">{isUrdu ? "ڈاؤن لوڈ" : "Download"}</a>
            <Link href="/docs" className="hover:text-white transition-colors">{isUrdu ? "دستاویزات" : "Docs"}</Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUrdu(!isUrdu)}
              className="flex items-center gap-2 text-sm font-medium text-gryphon-gold hover:text-white transition-colors border border-gryphon-gold/20 px-3 py-1.5 rounded-full bg-gryphon-gold/5"
            >
              <Languages className="w-4 h-4" />
              <span>{isUrdu ? "English" : "اردو"}</span>
            </button>
            <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-white hover:text-gryphon-gold transition-colors">
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-12 mb-24 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
              <Zap className="w-4 h-4 text-gryphon-gold" />
              <span className="text-zinc-300 italic font-medium">
                {isUrdu ? "عقاب جیسی تیزی، شیر جیسی طاقت۔" : "Swift as an eagle, strong as a lion."}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
              {isUrdu ? (
                <>ایمرجنگ ہارڈ ویئر کا <span className="text-gradient">چیمپئن۔</span></>
              ) : (
                <>The Edge AI <span className="text-gradient">Champion.</span></>
              )}
              <br className="hidden sm:block" />
              <span className="text-gradient leading-relaxed italic">آگے بڑھو، ملک کلاؤ! 🦅</span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-2xl mt-4">
              {isUrdu ? (
                "$10 ہارڈ ویئر کے لیے الٹرا لائٹ ویٹ پرسنل AI انفراسٹرکچر۔"
              ) : (
                "Ultra-lightweight personal AI infrastructure for $10 hardware."
              )}
              <span className="text-white font-medium block mt-2"> 10MB RAM · 1s Boot · 100% Privacy.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <Link href="/docs/installation" className="flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-gryphon-gold text-black font-bold hover:bg-amber-500 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                {isUrdu ? "شروع کریں" : "Launch MalikClaw"} <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://github.com/AbdullahMalik17/malikclaw" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" /> {isUrdu ? "سورس کوڈ" : "Explorer Source"}
              </a>
            </div>
          </motion.div>
          
          {/* Terminal Snippet */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_-12px_rgba(234,179,8,0.2)]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40">
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <span className="ml-2 text-xs text-zinc-500 font-mono">malikclaw shell</span>
            </div>
            <div className="p-4 sm:p-6 text-left font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
              <div className="text-zinc-500 italic"># Initialize the Gryphon engine</div>
              <div className="flex">
                <span className="text-gryphon-gold mr-2">🦅</span>
                <span className="text-zinc-300">curl -sSfL https://malikclaw.io/install.sh | sh</span>
              </div>
              <div className="flex mt-2">
                <span className="text-gryphon-gold mr-2">🦅</span>
                <span className="text-zinc-300">malikclaw agent</span>
              </div>
              <div className="text-zinc-500 mt-2">[SYSTEM] Booting MalikClaw v0.1.1...</div>
              <div className="text-gryphon-gold mt-1">✓ Gryphon Engine Ready in 0.82s</div>
              <div className="text-gryphon-gold">✓ Memory Footprint: 8.7MB</div>
              <div className="text-zinc-400 mt-2 font-bold">"آگے بڑھو، ملک کلاؤ!"</div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">
              {isUrdu ? "کارکردگی کے لیے تیار" : "Built for Performance"}
            </h2>
            <p className="text-zinc-400 mt-2 text-lg">
              {isUrdu ? "کوئی سمجھوتہ نہیں۔ خالص Go کی طاقت۔" : "Zero compromises. Pure Go-powered efficiency."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
            {/* Feature 1: Large - Urdu First */}
            <div className="md:col-span-2 md:row-span-2 p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-gryphon-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {isUrdu ? "اردو فرسٹ حکمت عملی 🇵🇰" : "Urdu-First Strategy 🇵🇰"}
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                  {isUrdu ? (
                    "مقامی RTL سپورٹ اور دو لسانی آن بورڈنگ، خاص طور پر جنوبی ایشیائی ڈویلپرز کے لیے تیار کردہ۔"
                  ) : (
                    "Native RTL support and bilingual onboarding, specifically optimized for South Asian developers and edge hardware enthusiasts."
                  )}
                </p>
                <div className="mt-8 text-3xl font-bold text-white/20 font-urdu italic">
                  آگے بڑھو، ملک کلاؤ!
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gryphon-gold/5 rounded-full blur-3xl group-hover:bg-gryphon-gold/10 transition-colors"></div>
            </div>

            {/* Feature 2: Small - RAM */}
            <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gryphon-gold/10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 text-gryphon-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">
                {isUrdu ? "8.4MB میموری" : "8.4MB Footprint"}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isUrdu ? (
                  "عام AI گیٹ ویز سے 99% چھوٹا۔ غیر ضروری بوجھ پر کارکردگی کو ترجیح۔"
                ) : (
                  "99% smaller than typical AI gateways. Performance and efficiency over unnecessary bloat."
                )}
              </p>
            </div>

            {/* Feature 3: Small - Boot */}
            <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gryphon-gold/10 flex items-center justify-center mb-4 group-hover:-rotate-12 transition-transform">
                <ShieldCheck className="w-6 h-6 text-gryphon-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">
                {isUrdu ? "1 سیکنڈ اسٹارٹ" : "1s Cold Start"}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isUrdu ? (
                  "فوری اسٹارٹ اپ آرکیٹیکچر۔ بھاری رن ٹائمز کا کوئی انتظار نہیں۔"
                ) : (
                  "Instant-on architecture. No waiting for heavy runtimes or virtual machines."
                )}
              </p>
            </div>

            {/* Feature 4: Small - Android */}
            <div className="md:col-span-1 p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gryphon-gold/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-gryphon-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">
                {isUrdu ? "اینڈرائیڈ ریموٹ" : "Android Remote"}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isUrdu ? (
                  "ADB کے ذریعے اینڈرائیڈ ڈیوائسز کو کنٹرول کریں۔ پرانے ہارڈ ویئر پر آٹومیشن۔"
                ) : (
                  "Natively control Android devices via ADB. Screenshots, taps, and automation on old hardware."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="w-full py-24 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              {isUrdu ? "ایمرجنگ ہارڈ ویئر کا چیمپئن" : "The Edge Hardware Champion"}
            </h2>
            <p className="text-zinc-400 mt-2 text-lg">
              {isUrdu ? "ملک کلاؤ کا مقابلہ دوسروں سے۔" : "MalikClaw vs the competition."}
            </p>
          </div>
          
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-6 px-8 font-semibold text-zinc-400">{isUrdu ? "پیمائش" : "Metric"}</th>
                  <th className="py-6 px-8 font-semibold text-zinc-400">OpenClaw</th>
                  <th className="py-6 px-8 font-bold text-gryphon-gold bg-gryphon-gold/5 rounded-t-2xl">MalikClaw 🦅</th>
                </tr>
              </thead>
              <tbody className="text-sm sm:text-base">
                <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-8 font-medium text-white">{isUrdu ? "زبان" : "Language"}</td>
                  <td className="py-5 px-8 text-zinc-500 italic font-mono">TypeScript</td>
                  <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5 font-mono">Go (Native)</td>
                </tr>
                <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-8 font-medium text-white">{isUrdu ? "میموری کا استعمال" : "RAM Usage"}</td>
                  <td className="py-5 px-8 text-zinc-500">{'>'} 1GB</td>
                  <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5">{'<'} 10MB</td>
                </tr>
                <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-8 font-medium text-white">{isUrdu ? "اسٹارٹ اپ ٹائم" : "Startup Time"}</td>
                  <td className="py-5 px-8 text-zinc-500">{'>'} 500s</td>
                  <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5">{'<'} 1s</td>
                </tr>
                <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-8 font-medium text-white">{isUrdu ? "ہارڈ ویئر لاگت" : "Hardware Cost"}</td>
                  <td className="py-5 px-8 text-zinc-500">Mac Mini (~$599)</td>
                  <td className="py-5 px-8 text-gryphon-gold font-bold bg-gryphon-gold/5 rounded-b-2xl">{isUrdu ? "کوئی بھی بورڈ (~$10)" : "Any SBC (~$10)"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Download Section */}
        <section id="download" className="w-full py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">
              {isUrdu ? "ملک کلاؤ کو انسٹال کریں" : "Deploy the Gryphon"}
            </h2>
            <p className="text-zinc-400 mt-2 text-lg">
              {isUrdu ? "ہر فن تعمیر کے لیے ہلکی پھلکی بائنریز۔" : "Lightweight binaries for every architecture."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Windows */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-gryphon-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Windows</h3>
              <p className="text-zinc-500 text-sm mb-6">Windows 10/11 (x64)</p>
              <div className="space-y-3">
                <a 
                  href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Windows_x86_64.zip"
                  className="block w-full py-3 px-4 rounded-xl bg-gryphon-gold text-black font-bold text-center hover:bg-amber-500 transition-colors text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                  {isUrdu ? "ڈاؤن لوڈ .EXE" : "Download .EXE"}
                </a>
              </div>
            </motion.div>

            {/* Linux */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
                <Cpu className="w-7 h-7 text-gryphon-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Linux (SBC)</h3>
              <p className="text-zinc-500 text-sm mb-6">ARM64, x64, RISC-V</p>
              <div className="space-y-3">
                <a 
                  href="https://github.com/AbdullahMalik17/malikclaw/releases/latest/download/malikclaw_Linux_x86_64.tar.gz"
                  className="block w-full py-3 px-4 rounded-xl bg-gryphon-gold text-black font-bold text-center hover:bg-amber-500 transition-colors text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                  {isUrdu ? "بائنری حاصل کریں" : "Download Binary"}
                </a>
              </div>
            </motion.div>

            {/* Android */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-gryphon-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Android</h3>
              <p className="text-zinc-500 text-sm mb-6">Termux (ARM64)</p>
              <div className="space-y-3">
                <Link 
                  href="/docs/installation/android"
                  className="block w-full py-3 px-4 rounded-xl border border-white/10 text-white font-bold text-center hover:bg-white/5 transition-colors text-sm"
                >
                  {isUrdu ? "سیٹ اپ گائیڈ" : "Setup Guide"}
                </Link>
              </div>
            </motion.div>

            {/* Docker */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-gryphon-gold/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gryphon-gold/10 flex items-center justify-center mb-6">
                <Terminal className="w-7 h-7 text-gryphon-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Docker</h3>
              <p className="text-zinc-500 text-sm mb-6">Official Image</p>
              <div className="space-y-3">
                <code className="block p-3 rounded-xl bg-black/50 text-xs text-gryphon-gold font-mono border border-white/5">
                  docker pull malikclaw/gateway
                </code>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-zinc-500">
        <p>
          {isUrdu ? (
            "Next.js، Go اور ❤️ کے ساتھ MalikClaw کمیونٹی کی طرف سے تیار کردہ۔"
          ) : (
            "Built with Next.js, Go and ❤️ by the MalikClaw Community."
          )}
        </p>
        <p className="mt-2 text-xs">© 2026 Muhammad Abdullah Athar · 🦅 Swift. Strong. Secure.</p>
      </footer>
    </div>
  );
}
