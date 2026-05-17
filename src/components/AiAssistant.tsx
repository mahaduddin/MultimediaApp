import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";
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
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
        // Simple 1-turn memory or we could send the whole history. Sending just message for simplicity now.
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
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col relative">
      <div className="space-y-1 mb-6 flex-shrink-0">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Bot className="w-8 h-8 text-yellow-500" />
          Customer Support
        </h2>
        <p className="text-neutral-400">Your customer support agent for Multimedia.app. How can I help you?</p>
      </div>

      <div className="flex-1 glass-panel border border-neutral-800 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] relative mb-24 md:mb-0">
        
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide py-32 md:py-6 bg-black/40">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] border",
                  msg.role === "user" ? "bg-yellow-500 border-yellow-400" : "bg-neutral-800 border-neutral-700"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4 md:w-5 md:h-5 text-black" /> : <Bot className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />}
                </div>
                
                <div className={cn(
                  "px-5 py-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed text-sm md:text-[15px]",
                  msg.role === "user" 
                    ? "bg-yellow-500 text-black font-medium border border-yellow-400 shadow-md" 
                    : "bg-neutral-900 border border-neutral-800 text-neutral-200"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 max-w-[85%]"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                  <span className="text-neutral-500 text-sm">Gemini is thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={endOfMessagesRef} className="h-4" />
          </AnimatePresence>
        </div>

        {/* Input box */}
        <div className="absolute md:relative bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950 md:bg-transparent">
          <form onSubmit={handleSubmit} className="relative flex items-center shadow-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the app..."
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-yellow-500 text-white rounded-2xl pl-5 pr-14 py-4 outline-none transition-colors placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-neutral-600">AI output may not always be accurate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
