import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import PWARegister from "@/components/pwa-register";
import ChatWidget from "@/components/chat-widget";
import { ThemeProvider } from "@/components/theme-provider";

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MalikClaw v2.0.0 — Agentic Era 2026 | Edge AI & Everyday Automation",
  description:
    "MalikClaw v2.0.0 (Agentic Era 2026) is an ultra-lightweight Go AI agent (<10MB RAM) built for everyday life automation, WhatsApp/Telegram replies, Android ADB tasks, SSRF & prompt-injection defense, smart multi-model cost routing, and universal SKILL.md + MCP support — in English & Urdu on any $10 SBC or old phone. آگے بڑھو، ملک کلاؤ!",
  keywords: [
    "MalikClaw",
    "MalikClaw v2.0.0",
    "Agentic Era 2026",
    "Autonomous AI Agent",
    "Edge AI",
    "Go AI Assistant",
    "Everyday Automation",
    "WhatsApp Telegram AI Bot",
    "Android ADB Automation",
    "SSRF Firewall",
    "Prompt Injection Guard",
    "Multi-Model Cost Router",
    "Ollama",
    "SKILL.md",
    "Model Context Protocol",
    "MCP",
    "Urdu AI",
    "RISC-V",
    "ARM64",
    "Open Source",
  ],
  authors: [{ name: "Muhammad Abdullah Athar", url: "https://github.com/AbdullahMalik17" }],
  creator: "Muhammad Abdullah Athar",
  metadataBase: new URL("https://malikclaw.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MalikClaw v2.0.0 — Agentic Era 2026 | Edge AI & Everyday Automation",
    description:
      "Automate everyday life in English or Urdu on <10MB RAM & $10 hardware. Built-in SSRF firewall, prompt-injection guard, smart Ollama/frontier cost router, and SKILL.md + MCP ecosystem.",
    url: "https://malikclaw.vercel.app",
    siteName: "MalikClaw",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "MalikClaw v2.0.0 Agentic Era 2026 — Gryphon Edge AI Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MalikClaw v2.0.0 — Agentic Era 2026 | Edge AI & Everyday Automation",
    description:
      "Pure Go AI agent (<10MB RAM) for everyday WhatsApp/Telegram & Android ADB automation, defense-in-depth security, smart cost routing, and SKILL.md + MCP.",
    creator: "@Ab4695Athar",
    images: ["/assets/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MalikClaw",
  alternateName: "MalikClaw v2.0.0 — Agentic Era 2026",
  softwareVersion: "2.0.0",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Autonomous AI Agent & Edge Automation Runtime",
  operatingSystem: "Linux, Windows, macOS, Android (Termux / ADB), RISC-V, ARM64",
  description:
    "MalikClaw v2.0.0 is an ultra-lightweight, pure-Go autonomous AI assistant (<10MB RAM, <1s cold boot) engineered for everyday life automation in English and Urdu on $10 edge SBCs or spare phones. Features a built-in SSRF network firewall, prompt-injection structural guard, smart multi-model cost router (local Ollama to frontier models), and universal SKILL.md + Model Context Protocol (MCP) support.",
  url: "https://malikclaw.vercel.app",
  image: "https://malikclaw.vercel.app/assets/og-banner.png",
  downloadUrl: "https://github.com/AbdullahMalik17/malikclaw/releases/latest",
  softwareHelp: "https://malikclaw.vercel.app/docs",
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  inLanguage: ["en", "ur", "fr", "ja", "pt", "vi"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Muhammad Abdullah Athar",
    url: "https://github.com/AbdullahMalik17",
  },
  featureList: [
    "Everyday Life Made Easy: WhatsApp/Telegram replies, morning briefings, Android ADB phone automation, and daily reminders in English or Urdu",
    "Defense-in-Depth Security: Built-in SSRF Network Firewall and Prompt-Injection Structural Guard",
    "Smart Multi-Model Cost Router: Routes simple tasks to fast local Ollama models and complex reasoning to frontier LLMs",
    "Universal SKILL.md + MCP Ecosystem: Modular skills and Model Context Protocol servers out of the box",
    "Ultra-lightweight pure Go binary with <10MB RAM footprint and <1s cold boot on $10 SBCs or old Android phones",
  ],
  sameAs: [
    "https://github.com/AbdullahMalik17/malikclaw",
    "https://mcpmarket.com/server/malikclaw",
  ],
} as const;

export const viewport: Viewport = {
  themeColor: "#EAB308",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${notoNastaliqUrdu.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MalikClaw" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationJsonLd),
          }}
        />
      </head>
      <body
        className="font-sans antialiased"
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PWARegister />
          {children}
          <ChatWidget />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
