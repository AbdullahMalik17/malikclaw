"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-[#050505] border border-zinc-800 overflow-hidden font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black border border-zinc-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#0df2c9]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white tracking-tight">MalikClaw Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#0df2c9]">
                    <span className="w-1.5 h-1.5 bg-[#0df2c9]"></span>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-black border border-zinc-800 hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <Bot className="w-12 h-12 text-zinc-500" />
                  <p className="text-zinc-400 text-sm max-w-[200px]">How can I help you deploy MalikClaw today?</p>
                </div>
              ) : (
                messages.map((m: any) => (
                  <div 
                    key={m.id} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${
                        m.role === 'user' ? 'bg-zinc-800' : 'bg-black border border-zinc-800'
                      }`}>
                        {m.role === 'user' ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-[#0df2c9]" />}
                      </div>
                      <div className={`px-4 py-3 text-sm ${
                        m.role === 'user' 
                          ? 'bg-zinc-800 text-white' 
                          : 'bg-black text-zinc-300 border border-zinc-800'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black border border-zinc-800 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-[#0df2c9]" />
                    </div>
                    <div className="px-4 py-3 bg-black text-zinc-300 border border-zinc-800 flex items-center gap-2">
                       <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                       <span className="text-sm text-zinc-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/5">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  className="w-full bg-black border border-zinc-800 pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !(input || '').trim()}
                  className="absolute right-2 p-2 bg-black border border-zinc-800 text-white hover:bg-zinc-900 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white text-black border border-zinc-800 flex items-center justify-center transition-shadow hover:bg-zinc-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
