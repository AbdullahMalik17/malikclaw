"use client";

import { Language } from "@/i18n/translations";
import { MessageSquare, Github } from "lucide-react";
import { testimonials } from "@/data/testimonials";

interface SocialProofMarqueeProps {
  language: Language;
}

export default function SocialProofMarquee({ language }: SocialProofMarqueeProps) {
  return (
    <section className="w-full py-16 overflow-hidden border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center flex items-center justify-center gap-2">
        <MessageSquare className="w-5 h-5 text-zinc-500" />
        <h3 className="text-zinc-400 font-medium">Trusted by Developers Worldwide</h3>
      </div>
      
      {testimonials.length < 3 ? (
        <div className="max-w-3xl mx-auto px-6 text-center">
          <a
            href="https://github.com/AbdullahMalik17/malikclaw/discussions"
            target="_blank"
            rel="noreferrer"
            className="group block bg-[#111] border border-white/10 hover:border-gryphon-gold/50 rounded-2xl p-8 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gryphon-gold/10 rounded-full group-hover:bg-gryphon-gold/20 transition-colors">
                <Github className="w-8 h-8 text-gryphon-gold" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Be the first to share your story!</h4>
                <p className="text-zinc-400">
                  ⭐ Share your MalikClaw experience on GitHub Discussions →
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
                className="w-[350px] md:w-[450px] mx-4 inline-block bg-[#111] border border-white/10 rounded-2xl p-6 whitespace-normal"
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  <p className="text-zinc-300 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-bold">{testimonial.author}</p>
                    <p className="text-gryphon-gold text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none"></div>
        </div>
      )}
    </section>
  );
}
