import { Shield, Lock, UserCheck, Database, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5 bg-[#0a0a0a] pt-32 pb-20">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gryphon-gold/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gryphon-gold/10 rounded-full mb-8">
            <Shield className="w-12 h-12 text-gryphon-gold" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Zero-Trust by Design
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            MalikClaw is built on the principle that your AI agent shouldn't have unchecked power. Every action is cryptographically verified and locally contained.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-20 space-y-24">
        
        {/* 1. Threat Model */}
        <section className="group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white">Threat Model</h2>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 transition-colors hover:border-white/10">
            <p className="mb-6 text-lg">MalikClaw is engineered to protect against:</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-gryphon-gold mt-1">▹</span>
                <div>
                  <strong className="text-white block">Prompt Injection Attacks</strong>
                  <span className="text-zinc-400">Strict separation of instruction memory and user input contexts.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gryphon-gold mt-1">▹</span>
                <div>
                  <strong className="text-white block">Unauthorized Exfiltration</strong>
                  <span className="text-zinc-400">Default-deny network policies ensure skills can only communicate with approved endpoints.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gryphon-gold mt-1">▹</span>
                <div>
                  <strong className="text-white block">Privilege Escalation</strong>
                  <span className="text-zinc-400">Agent runs in unprivileged user space without root access requirements.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Cryptographic Verification */}
        <section className="group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white">Cryptographic Verification</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Signed Actions</h3>
              <p className="text-zinc-400">
                Critical transactions are signed using local Ed25519 keys generated upon installation. The private key never leaves your device's secure enclave (or equivalent keystore).
              </p>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Skill Integrity</h3>
              <p className="text-zinc-400">
                Skills fetched from the registry are checksummed and signature-verified before execution. Tampered skills are automatically rejected.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Human-in-the-Loop */}
        <section className="group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white">Human-in-the-Loop (HITL)</h2>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px]"></div>
            <p className="text-lg mb-8 relative z-10">
              High-risk actions require explicit human approval via the local TUI or web interface before the agent can proceed.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 relative z-10">
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                <span className="font-bold text-white block mb-1">💳 Stripe</span>
                <span className="text-sm text-zinc-500">Payments & Refunds</span>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                <span className="font-bold text-white block mb-1">📧 Gmail</span>
                <span className="text-sm text-zinc-500">Sending external emails</span>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                <span className="font-bold text-white block mb-1">🏢 Odoo</span>
                <span className="text-sm text-zinc-500">Modifying ERP records</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Local-First Data Flow */}
        <section className="group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white">Local-First Data Flow</h2>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8">
            <p className="mb-8 text-lg">Your data never leaves your device without explicit consent. Vector embeddings and memories are stored in your local workspace.</p>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0a0a] p-8 rounded-2xl border border-white/5">
              <div className="text-center w-full md:w-auto">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-bold text-white">Local Device</span>
                <p className="text-xs text-zinc-500 mt-1">Memory & Keys</p>
              </div>
              
              <div className="hidden md:flex flex-col items-center">
                <span className="text-xs text-gryphon-gold font-bold mb-1">Sanitized Prompts</span>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gryphon-gold to-transparent relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gryphon-gold rounded-full blur-[2px]"></div>
                </div>
              </div>
              
              <div className="text-center w-full md:w-auto">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-bold text-white">LLM Provider</span>
                <p className="text-xs text-zinc-500 mt-1">(e.g. Gemini/OpenAI)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Audit Log & 6. Reporting */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-gryphon-gold" />
              <h3 className="text-2xl font-bold text-white">Audit Logs</h3>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 h-full">
              <p className="text-zinc-400 mb-6">
                Every API call, file access, and state change can be recorded in an immutable local ledger for complete transparency.
              </p>
              <code className="block bg-black p-4 rounded-xl text-gryphon-gold font-mono text-sm border border-white/10">
                malikclaw agent --audit-log
              </code>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-gryphon-gold" />
              <h3 className="text-2xl font-bold text-white">Vulnerability Reporting</h3>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 h-full flex flex-col justify-between">
              <p className="text-zinc-400 mb-6">
                Security is an ongoing process. If you discover a vulnerability, please report it securely through our dedicated channel.
              </p>
              <a 
                href="https://github.com/AbdullahMalik17/malikclaw/blob/main/SECURITY.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-white font-bold hover:text-gryphon-gold transition-colors"
              >
                Read SECURITY.md <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
