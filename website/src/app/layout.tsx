import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    title: "MalikClaw - Ultra-Efficient Personal AI Assistant",
    description: "Runs on $10 hardware with <10MB RAM. The edge champion for AI agents.",
    url: "https://malikclaw.io",
    siteName: "MalikClaw",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MalikClaw - Ultra-Efficient Personal AI Assistant",
    description: "Runs on $10 hardware with <10MB RAM. The edge champion for AI agents.",
    creator: "@Ab4695Athar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
