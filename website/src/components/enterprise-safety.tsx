"use client";

import { motion } from "framer-motion";
import { Shield, Lock, UserCheck, Key } from "lucide-react";
import { Language } from "@/i18n/translations";

interface EnterpriseSafetyProps {
  language: Language;
}

export default function EnterpriseSafety({ language }: EnterpriseSafetyProps) {
  const isRTL = language === 'ur';

  const content: Partial<Record<Language, any>> = {
    en: {
      title: "Zero-Trust by Design",
      subtitle: "Enterprise-grade safety with Human-in-the-Loop architecture.",
      badge: "Security First",
      cards: [
        {
          title: "Cryptographic Verification",
          description: "All sensitive actions are cryptographically signed. MalikClaw cannot execute actions without valid keys.",
          icon: Key
        },
        {
          title: "Explicit User Approval",
          description: "Unlike competing agents that blindly execute, MalikClaw pauses and requests explicit approval for Odoo, Gmail, or Stripe APIs.",
          icon: UserCheck
        },
        {
          title: "Local-First Execution",
          description: "Data processing happens on-device. Your sensitive information never leaves your hardware without your consent.",
          icon: Lock
        }
      ]
    },
    ur: {
      title: "زیرو ٹرسٹ ڈیزائن کے ذریعے",
      subtitle: "ہیومن-ان-دی-لوپ آرکیٹیکچر کے ساتھ انٹرپرائز گریڈ سیفٹی۔",
      badge: "پہلے سیکورٹی",
      cards: [
        {
          title: "کرپٹوگرافک تصدیق",
          description: "تمام حساس کارروائیوں پر کرپٹوگرافک دستخط ہوتے ہیں۔ ملک کلاؤ درست کنجیوں کے بغیر کام نہیں کر سکتا۔",
          icon: Key
        },
        {
          title: "صارف کی واضح منظوری",
          description: "دوسرے ایجنٹس کے برعکس، ملک کلاؤ اوڈو، جی میل، یا اسٹرائپ APIs کے لیے آپ کی واضح منظوری مانگتا ہے۔",
          icon: UserCheck
        },
        {
          title: "پہلے مقامی عمل",
          description: "ڈیٹا پروسیسنگ ڈیوائس پر ہوتی ہے۔ آپ کی حساس معلومات آپ کی رضامندی کے بغیر کبھی آپ کے ہارڈویئر سے باہر نہیں نکلتیں۔",
          icon: Lock
        }
      ]
    }
  };

  const t = content[language] || content.en;

  return (
    <section className="w-full py-24 relative max-w-6xl mx-auto px-6">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] -z-10 rounded-[100px]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm mb-6">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-medium">
            {t.badge}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          {t.title}
        </h2>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {t.cards.map((card: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="group relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-2"
          >
            <div className="absolute inset-x-0 -top-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <card.icon className="w-7 h-7 text-blue-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              {card.title}
            </h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
