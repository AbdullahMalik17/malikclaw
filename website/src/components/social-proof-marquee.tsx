"use client";

import { Language } from "@/i18n/translations";
import { MessageSquare } from "lucide-react";

interface SocialProofMarqueeProps {
  language: Language;
}

export default function SocialProofMarquee({ language }: SocialProofMarqueeProps) {
  const testimonials = [
    {
      name: "Alex Dev",
      role: "Senior Embedded Engineer",
      text: "MalikClaw running <10MB RAM on my Raspberry Pi is insane! OpenClaw could never."
    },
    {
      name: "Samira K.",
      role: "Startup Founder",
      text: "1-second boot time on our edge devices is a game changer. The local-first approach is incredibly fast."
    },
    {
      name: "JD",
      role: "AI Researcher",
      text: "Zero-trust design finally done right. Cryptographic verification on every API request is exactly what we needed."
    },
    {
      name: "Elena R.",
      role: "DevOps Lead",
      text: "I was skeptical about a new agent framework, but MalikClaw replacing OpenClaw saved us 80% on compute cost."
    },
    {
      name: "Chris Tech",
      role: "IoT Developer",
      text: "Lightning fast, beautiful UI, and natively handles my Odoo integrations securely. 10/10."
    }
  ];

  // Duplicate list to achieve seamless infinite scrolling
  const scrollItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="w-full py-16 overflow-hidden border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center flex items-center justify-center gap-2">
        <MessageSquare className="w-5 h-5 text-zinc-500" />
        <h3 className="text-zinc-400 font-medium">Trusted by Developers Worldwide</h3>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
          {scrollItems.map((testimonial, idx) => (
            <div 
              key={idx} 
              className="w-[350px] md:w-[450px] mx-4 inline-block bg-[#111] border border-white/10 rounded-2xl p-6 whitespace-normal"
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <p className="text-zinc-300 italic">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-gryphon-gold text-sm font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}
