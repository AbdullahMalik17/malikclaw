import Link from "next/link";
import type { Metadata } from "next";
import { Shield, Lock, UserCheck, Database, AlertTriangle, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Zero-Trust Architecture — MalikClaw v2.0.0",
  description:
    "Explore MalikClaw v2.0.0 defense-in-depth security: SSRF Network Firewall, Prompt-Injection Structural Guard, ed25519 action signing, and human-in-the-loop approval gates.",
  alternates: {
    canonical: "/trust",
  },
  openGraph: {
    title: "Security & Zero-Trust Architecture — MalikClaw v2.0.0",
    description:
      "SSRF Firewall, Prompt-Injection Guard, local-first embeddings, and ed25519 action signing for autonomous edge AI.",
    url: "https://malikclaw.vercel.app/trust",
    images: [
      {
        url: "/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "MalikClaw v2.0.0 Zero-Trust Security Architecture",
      },
    ],
  },
};

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <nav className="sticky top-0 z-50 border-b border-card-border bg-background/85 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-bold tracking-tight text-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
            MalikClaw
          </Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="text-text-muted hover:text-foreground transition-colors">Home</Link>
            <Link href="/docs" className="text-text-muted hover:text-foreground transition-colors">Docs</Link>
            <Link href="/download" className="text-text-muted hover:text-foreground transition-colors">Download</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-card-border bg-surface-1 pt-20 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gryphon-gold/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8">
            <Shield className="w-12 h-12 text-amber-700 dark:text-gryphon-gold" aria-hidden="true" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Zero-Trust by Design
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            MalikClaw is built on the principle that your AI agent shouldn&apos;t have unchecked power. Every action is cryptographically verified and locally contained.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-20 space-y-24">

        {/* 1. Threat Model */}
        <section className="grid md:grid-cols-[minmax(0,17rem)_1fr] gap-8">
          <div className="md:sticky md:top-24 md:self-start">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Threat Model</h2>
            </div>
            <p className="text-sm text-text-muted">MalikClaw v2.0.0 is engineered to defend against:</p>
          </div>
          <ul className="divide-y divide-card-border border-y border-card-border">
            <li className="flex items-start gap-4 py-5 px-1 hover:bg-surface-2/60 transition-colors">
              <span className="text-amber-700 dark:text-amber-400 mt-1 font-mono text-xs tabular-nums">01</span>
              <div>
                <strong className="text-foreground block mb-1">Prompt-Injection Structural Guard</strong>
                <span className="text-text-muted text-sm">Structural separation and scanning of untrusted tool outputs vs system instructions.</span>
              </div>
            </li>
            <li className="flex items-start gap-4 py-5 px-1 hover:bg-surface-2/60 transition-colors">
              <span className="text-amber-700 dark:text-amber-400 mt-1 font-mono text-xs tabular-nums">02</span>
              <div>
                <strong className="text-foreground block mb-1">SSRF Network Boundary Firewall</strong>
                <span className="text-text-muted text-sm">Blocks private-IP, loopback, and cloud metadata egress across outbound HTTP, web, and MCP tools.</span>
              </div>
            </li>
            <li className="flex items-start gap-4 py-5 px-1 hover:bg-surface-2/60 transition-colors">
              <span className="text-amber-700 dark:text-amber-400 mt-1 font-mono text-xs tabular-nums">03</span>
              <div>
                <strong className="text-foreground block mb-1">Privilege Escalation</strong>
                <span className="text-text-muted text-sm">Agent runs in unprivileged user space without root access requirements.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* 2. Cryptographic Verification */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Cryptographic Verification</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8 rounded-2xl hover:border-amber-500/40 transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-4">Signed Actions</h3>
              <p className="text-text-muted">
                Critical transactions are signed using local Ed25519 keys generated upon installation. The private key never leaves your device&apos;s secure enclave (or equivalent keystore).
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl hover:border-amber-500/40 transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-4">Skill Integrity</h3>
              <p className="text-text-muted">
                Skills fetched from the registry are checksummed and signature-verified before execution. Tampered skills are automatically rejected.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Human-in-the-Loop */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Human-in-the-Loop (HITL)</h2>
          </div>
          <p className="text-lg mb-8 text-foreground max-w-2xl">
            High-risk actions require explicit human approval via the local TUI or web interface before the agent can proceed.
          </p>
          <ul className="divide-y divide-card-border border-y border-card-border">
            {[
              { name: "Stripe", detail: "Payments & Refunds" },
              { name: "Gmail", detail: "Sending external emails" },
              { name: "Odoo", detail: "Modifying ERP records" },
            ].map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-4 py-4 px-1 hover:bg-surface-2/60 transition-colors">
                <span className="font-bold text-foreground">{item.name}</span>
                <span className="flex items-center gap-3 text-sm text-text-muted">
                  {item.detail}
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-400 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Approval required
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Local-First Data Flow */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Database className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Local-First Data Flow</h2>
          </div>
          <div className="glass-card rounded-2xl p-8 hover:border-emerald-500/40 transition-colors">
            <p className="mb-8 text-lg text-foreground">Your data never leaves your device without explicit consent. Vector embeddings and memories are stored in your local workspace.</p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-2 p-8 rounded-2xl border border-card-border">
              <div className="text-center w-full md:w-auto">
                <div className="w-16 h-16 bg-surface-1 border border-card-border rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-foreground" aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-foreground">Local Device</span>
                <p className="text-xs text-text-muted mt-1">Memory &amp; Keys</p>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <span className="text-xs text-amber-700 dark:text-gryphon-gold font-bold mb-1">Sanitized Prompts</span>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full blur-[2px]"></div>
                </div>
              </div>

              <div className="text-center w-full md:w-auto">
                <div className="w-16 h-16 bg-surface-1 border border-card-border rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-foreground" aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-foreground">LLM Provider</span>
                <p className="text-xs text-text-muted mt-1">(Local Ollama or Cloud)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Audit Log & 6. Reporting */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-foreground">Audit Logs</h3>
            </div>
            <div className="glass-card rounded-2xl p-6 h-full hover:border-amber-500/40 transition-colors">
              <p className="text-text-muted mb-6">
                Every API call, file access, and state change can be recorded in an immutable local ledger for complete transparency.
              </p>
              <code className="block bg-[#0B0C10] p-4 rounded-xl text-amber-300 font-mono text-sm border border-zinc-800 select-all">
                malikclaw agent --audit-log
              </code>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-foreground">Vulnerability Reporting</h3>
            </div>
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <p className="text-text-muted mb-6">
                Security is an ongoing process. If you discover a vulnerability, please report it securely through our dedicated channel.
              </p>
              <a
                href="https://github.com/AbdullahMalik17/malikclaw/blob/main/SECURITY.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-foreground font-bold hover:text-amber-700 dark:hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 rounded transition-colors"
              >
                Read SECURITY.md <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
