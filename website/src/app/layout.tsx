import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/pwa-register";
import ChatWidget from "@/components/chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MalikClaw 🦅 - The Edge AI Champion",
  description: "🦅 MalikClaw is a high-performance, ultra-lightweight AI Assistant built in Go. Swift as an eagle, strong as a lion. Runs on $10 hardware with <10MB RAM. آگے بڑھو، ملک کلاؤ!",
  keywords: ["AI Assistant", "Go", "Edge Computing", "Lightweight AI", "Urdu AI", "South Asia", "RISC-V", "ARM", "Open Source", "Gryphon AI"],
  authors: [{ name: "Muhammad Abdullah Athar", url: "https://github.com/AbdullahMalik17" }],
  creator: "Muhammad Abdullah Athar",
  metadataBase: new URL("https://malikclaw.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MalikClaw - Ultra-Efficient Personal AI Assistant",
    description: "Runs on $10 hardware with <10MB RAM. The edge champion for AI agents.",
    url: "https://malikclaw.vercel.app",
    siteName: "MalikClaw",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "MalikClaw Gryphon Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MalikClaw - Ultra-Efficient Personal AI Assistant",
    description: "Runs on $10 hardware with <10MB RAM. The edge champion for AI agents.",
    creator: "@Ab4695Athar",
    images: ["/assets/logo.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MalikClaw" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWARegister />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
