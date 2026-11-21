"use client";

import { Language, translations } from "@/i18n/translations";
import { Github, Sparkles } from "lucide-react";
import { testimonials } from "@/data/testimonials";

interface SocialProofMarqueeProps {
  language: Language;
}

export default function SocialProofMarquee({ language }: SocialProofMarqueeProps) {
  const t = translations[language];
  const isUrdu = language === "ur";

  return (
    <section
      dir={isUrdu ? "rtl" : "ltr"}
      className="w-full py-16 overflow-hidden border-t border-card-border bg-surface-2/60 font-mono"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" aria-hidden="true" />
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
          {t.socialProof.heading}
        </h3>
      </div>

      {testimonials.length < 3 ? (
        <div className="max-w-3xl mx-auto px-6 text-center">
          <a
            href="https://github.com/AbdullahMalik17/malikclaw/discussions"
            target="_blank"
            rel="noreferrer"
            className="group block bg-card-bg border border-card-border hover:border-amber-500/50 rounded-2xl p-8 transition-colors shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-surface-2 border border-card-border rounded-xl">
                <Github className="w-6 h-6 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className={`text-lg font-bold text-foreground mb-1 font-sans ${isUrdu ? "font-urdu" : ""}`}>
                  {t.socialProof.ctaTitle}
                </h4>
                <p className={`text-xs text-text-muted font-sans ${isUrdu ? "font-urdu" : ""}`}>
                  {t.socialProof.ctaSubtitle}
                </p>
              </div>
            </div>
          </a>
        </div>
      ) : (
        <div dir="ltr" className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
              <div
                key={idx}
                className="w-[320px] md:w-[420px] mx-3 inline-block bg-card-bg border border-card-border p-5 rounded-2xl whitespace-normal backdrop-blur-xl hover:border-amber-500/45 transition-colors shadow-md"
              >
                <div className="flex flex-col h-full justify-between gap-3">
                  <p className="text-foreground/90 text-xs sm:text-sm italic font-sans">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-card-border flex items-center justify-between">
                    <p className="text-foreground text-xs font-bold font-sans">{testimonial.author}</p>
                    <p className="text-amber-700 dark:text-amber-400 text-[11px] font-semibold">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      )}
    </section>
  );
}
