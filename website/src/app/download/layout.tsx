import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Download MalikClaw v2.0.0 — Windows, macOS, Linux, Android & Docker",
  description:
    "Download MalikClaw v2.0.0 pure-Go binaries for Windows, macOS, Linux (x86_64, ARM64, RISC-V), Android Termux, and Docker GHCR.",
  alternates: {
    canonical: "/download",
  },
  openGraph: {
    title: "Download MalikClaw v2.0.0 — Windows, macOS, Linux, Android & Docker",
    description:
      "Install MalikClaw v2.0.0 in seconds via cURL, PowerShell irm, Termux, or Docker on any laptop, $10 SBC, or Android phone.",
    url: "https://malikclaw.vercel.app/download",
    images: [
      {
        url: "/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Download MalikClaw v2.0.0 — Agentic Era 2026",
      },
    ],
  },
};

export default function DownloadLayout({ children }: { children: ReactNode }) {
  return children;
}
