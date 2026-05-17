import React, { useState } from "react";
import { Mic, Volume2, Type } from "lucide-react";
import { motion } from "motion/react";

export function TextToSpeech() {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold flex flex-col md:flex-row items-center gap-3 md:justify-start justify-center">
          <Volume2 className="w-10 h-10 text-yellow-500" />
          Text to Speech
        </h2>
        <p className="text-neutral-400 text-lg">Convert your text into realistic speech instantly.</p>
      </div>

      <div className="glass-panel border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
        <label className="block text-sm font-medium text-neutral-400">Content to speak</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          className="w-full h-48 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500/50 resize-none transition-colors"
        />

        <div className="flex justify-end gap-4">
          {isSpeaking ? (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleSpeak}
              disabled={!text}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Mic className="w-5 h-5" />
              Speak
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
