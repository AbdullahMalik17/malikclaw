"use client";

import { Language, translations } from "@/i18n/translations";

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const t = translations[language];

  return (
    <footer className="border-t border-white/10 py-12 text-center text-sm text-zinc-500">
      <p>
        {t.footer.builtWith}
      </p>
      <p className="mt-2 text-xs">
        {t.footer.copyright}
      </p>
    </footer>
  );
}
