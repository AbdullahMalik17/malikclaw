"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    await sendMessage({ text: trimmed });
  };

  return (
    <aside aria-label="MalikClaw Assistant" className="fixed bottom-6 end-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="malikclaw-assistant-dialog"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-widget-title"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col rounded-2xl bg-[#0B0C10] border border-zinc-800 shadow-2xl overflow-hidden font-mono text-zinc-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="chat-widget-title" className="font-semibold text-white tracking-tight text-sm">
                    MalikClaw Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Online
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close MalikClaw Assistant"
                className="w-8 h-8 rounded-lg bg-black border border-zinc-800 hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                  <Bot className="w-12 h-12 text-amber-400" aria-hidden="true" />
                  <p className="text-zinc-300 text-sm max-w-[220px]">How can I help you deploy MalikClaw v2.0.0 today?</p>
                </div>
              ) : (
                messages.map((m) => {
                  const text = m.parts
                    .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
                    .map((part) => part.text)
                    .join("");

                  return (
                    <div
                      key={m.id}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          m.role === "user" ? "bg-zinc-800" : "bg-black border border-zinc-800"
                        }`}>
                          {m.role === "user" ? (
                            <User className="w-4 h-4 text-zinc-300" aria-hidden="true" />
                          ) : (
                            <Bot className="w-4 h-4 text-amber-400" aria-hidden="true" />
                          )}
                        </div>
                        <div className={`px-4 py-3 rounded-xl text-sm whitespace-pre-wrap break-words ${
                          m.role === "user"
                            ? "bg-zinc-800 text-white"
                            : "bg-black text-zinc-200 border border-zinc-800"
                        }`}>
                          {text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-black text-zinc-300 border border-zinc-800 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-400" aria-hidden="true" />
                      <span className="text-sm text-zinc-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/[0.04]">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  aria-label="Ask MalikClaw Assistant a question"
                  className="w-full rounded-xl bg-black border border-zinc-800 ps-4 pe-12 py-3 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-colors placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="absolute end-2 p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="malikclaw-assistant-dialog"
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        className="w-14 h-14 rounded-2xl bg-amber-500 text-black border border-amber-400/50 flex items-center justify-center shadow-lg hover:bg-amber-400 active:scale-[0.98] transition-all"
      >
        {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <MessageSquare className="w-6 h-6" aria-hidden="true" />}
      </button>
    </aside>
  );
}
