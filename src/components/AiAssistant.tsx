import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Bot, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm your Multimedia.app Support Bot. How can I assist you today with our tools?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch response");

      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "ai", content: "⚠️ Error: " + err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] md:w-[400px] h-[500px] max-h-[80vh] mb-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-[#1E5D90] via-[#3590AD] to-[#EFA245] text-white flex flex-col justify-between shrink-0 relative overflow-hidden h-32">
              <div className="absolute top-0 right-0 p-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-black/20 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-white/90" />
                </button>
              </div>
              <div className="flex-1" />
              <div className="flex flex-col gap-0.5">
                <h3 className="font-semibold text-white/90 text-xl tracking-tight flex items-center gap-2">
                  Hi there <span className="text-xl">💛</span>
                </h3>
                <p className="font-bold text-[22px] text-white tracking-tight leading-tight">How can we help?</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/50 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex max-w-[85%]", msg.role === "user" ? "ml-auto" : "")}>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                    msg.role === "user" 
                      ? "bg-yellow-500 text-black rounded-br-sm" 
                      : "bg-neutral-800 text-neutral-100 rounded-bl-sm border border-neutral-700/50"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex max-w-[85%]">
                  <div className="px-4 py-3 rounded-2xl bg-neutral-800 rounded-bl-sm border border-neutral-700/50 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    <span className="text-neutral-400 text-[13px]">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} className="h-2" />
            </div>

            {/* Input */}
            <div className="p-3 bg-neutral-900 border-t border-neutral-800 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-yellow-500 text-white rounded-xl pl-4 pr-10 py-3 text-sm outline-none transition-colors placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-yellow-500 text-black hover:bg-yellow-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full shadow-[0_4px_20px_rgba(234,179,8,0.4)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-50 float-right"
        aria-label="Toggle chat support"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m6 9 6 6 6-6"/></svg>
        ) : (
          <Bot className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
