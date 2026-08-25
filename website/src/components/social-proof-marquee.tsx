"use client";

import { Language } from "@/i18n/translations";
import { MessageSquare, Github, Sparkles } from "lucide-react";
import { testimonials } from "@/data/testimonials";

interface SocialProofMarqueeProps {
  language: Language;
}

export default function SocialProofMarquee({ language }: SocialProofMarqueeProps) {
  return (
    <section className="w-full py-16 overflow-hidden border-t border-white/[0.06] bg-black/40 font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
          Trusted by Developers Worldwide
        </h3>
      </div>
      
      {testimonials.length < 3 ? (
        <div className="max-w-3xl mx-auto px-6 text-center">
          <a
            href="https://github.com/AbdullahMalik17/malikclaw/discussions"
            target="_blank"
            rel="noreferrer"
            className="group block bg-zinc-950/80 border border-white/10 hover:border-amber-500/40 rounded-2xl p-8 transition-all hover:scale-[1.02] shadow-xl"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl">
                <Github className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1 font-sans">
                  Be the first to share your edge AI deployment!
                </h4>
                <p className="text-xs text-zinc-400 font-sans">
                  ⭐ Join the discussion and share your MalikClaw setup on GitHub Discussions →
                </p>
              </div>
            </div>
          </a>
        </div>
      ) : (
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
              <div 
                key={idx} 
                className="w-[320px] md:w-[420px] mx-3 inline-block bg-zinc-950/80 border border-white/[0.08] p-5 rounded-2xl whitespace-normal backdrop-blur-xl hover:border-amber-500/40 transition-colors shadow-lg"
              >
                <div className="flex flex-col h-full justify-between gap-3">
                  <p className="text-zinc-300 text-xs sm:text-sm italic font-sans">
                    "{testimonial.quote}"
                  </p>
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <p className="text-white text-xs font-bold font-sans">{testimonial.author}</p>
                    <p className="text-amber-400 text-[11px] font-semibold">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#050507] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#050507] to-transparent pointer-events-none" />
        </div>
      )}
    </section>
  );
}
