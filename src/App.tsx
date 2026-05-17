/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LayoutGrid, Video, Image as ImageIcon, Sparkles, Youtube, CopySlash, QrCode, Instagram, KeyRound, CheckCircle, Menu, X, Type, ShieldCheck, FileText, PlaySquare, Mic, Bot } from "lucide-react";
import { cn } from "./lib/utils";
import { motion, AnimatePresence } from "motion/react";

import { Dashboard } from "./components/Dashboard";
import { YoutubeTool } from "./components/YoutubeTool";
import { BgRemovalTool } from "./components/BgRemovalTool";
import { AiAssistant } from "./components/AiAssistant";
import { MemeMaker } from "./components/MemeMaker";
import { YtThumbnail } from "./components/YtThumbnail";
import { InstaDownloader } from "./components/InstaDownloader";
import { ImageConverter } from "./components/ImageConverter";
import { QrGenerator } from "./components/QrGenerator";
import { PasswordGenerator } from "./components/PasswordGenerator";
import { TextToSpeech } from "./components/TextToSpeech";
import { FeedbackWidget } from "./components/FeedbackWidget";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", icon: LayoutGrid, label: "Home" },
    { id: "ytdl", icon: Youtube, label: "YT Downloader" },
    { id: "yt-thumb", icon: PlaySquare, label: "YT Thumbnail" },
    { id: "insta", icon: Instagram, label: "IG Downloader" },
    { id: "bgrm", icon: ImageIcon, label: "BG Removal" },
    { id: "converter", icon: CopySlash, label: "Image Converter" },
    { id: "meme", icon: Type, label: "Meme Maker" },
    { id: "qrcode", icon: QrCode, label: "QR Generator" },
    { id: "tts", icon: Mic, label: "Text to Speech" },
    { id: "passgen", icon: KeyRound, label: "Password Gen" },
  ] as const;
  
  type ViewType = typeof navItems[number]["id"];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans selection:bg-yellow-500/30">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-neutral-900/40 border-r border-neutral-800/80 z-20 backdrop-blur-xl shrink-0">
        <div className="h-24 flex items-center px-8 shrink-0 cursor-pointer" onClick={() => setCurrentView("dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)] border border-yellow-400 mr-3">
            <PlaySquare className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Multimedia<span className="text-yellow-500">.app</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1.5 scrollbar-hide">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-4 mt-2">Tools & Features</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={cn(
                "flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 group",
                currentView === item.id 
                  ? "bg-yellow-500 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.15)]" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800 hover:pl-5"
              )}
            >
              <item.icon className={cn("w-5 h-5 mr-3", currentView === item.id && "scale-110", "transition-transform duration-300")} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 shrink-0 border-t border-neutral-800/80">
          <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-xl border border-green-500/20 text-xs font-semibold shadow-[0_0_15px_rgba(34,197,94,0.1)] w-full justify-center">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Secure Mode</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      
        {/* Mobile Header */}
        <header className="lg:hidden h-16 shrink-0 bg-neutral-950/80 glass-panel border-b border-neutral-800/80 z-50 flex items-center px-4 justify-between shadow-lg">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("dashboard")}>
            <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)] border border-yellow-400">
              <PlaySquare className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Multimedia<span className="text-yellow-500">.app</span>
            </span>
          </div>

          <button 
            className="p-2 text-neutral-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden absolute top-16 left-0 right-0 glass-panel border-b border-neutral-800/80 z-40 flex flex-col p-4 gap-2 bg-neutral-950/95"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as ViewType);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center p-3 rounded-xl transition-all duration-200",
                    currentView === item.id 
                      ? "bg-yellow-500/10 text-yellow-500 shadow-inner" 
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide flex flex-col">
          {/* Subtle Background Glow */}
          <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        
        {/* Dynamic View Component */}
        <div className="w-full shrink-0 pb-16 pt-4 md:pt-8 px-2 md:px-0 flex flex-col min-h-[50vh]">
          {currentView === "dashboard" && <Dashboard onNavigate={(id) => setCurrentView(id as ViewType)} />}
          {currentView === "ytdl" && <YoutubeTool />}
          {currentView === "bgrm" && <BgRemovalTool />}
          {currentView === "insta" && <InstaDownloader />}
          {currentView === "converter" && <ImageConverter />}
          {currentView === "qrcode" && <QrGenerator />}
          {currentView === "tts" && <TextToSpeech />}
          {currentView === "passgen" && <PasswordGenerator />}
          {currentView === "yt-thumb" && <YtThumbnail />}
          {currentView === "meme" && <MemeMaker />}
        </div>
        
        {/* Universal Footer / Credits */}
        <footer className="mt-auto w-[calc(100%-2rem)] max-w-7xl mx-auto mb-12 border border-neutral-800/80 rounded-[2.5rem] p-6 md:p-12 bg-neutral-900/40 shrink-0 shadow-2xl backdrop-blur-md">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-neutral-400 text-sm mb-10">
             <div className="space-y-4">
               <h3 className="text-white font-bold text-xl flex items-center gap-3">
                 <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                   <ShieldCheck className="w-5 h-5 text-yellow-500" /> 
                 </div>
                 Security & Privacy
               </h3>
               <p className="leading-relaxed text-neutral-400">
                 Multimedia.app process specific media securely. Most operations are processed completely on-device.
                 Your privacy and data security are our top priorities. Uploaded media is never stored or shared with any third parties.
               </p>
             </div>
             <div className="space-y-4">
               <h3 className="text-white font-bold text-xl flex items-center gap-3">
                 <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                   <FileText className="w-5 h-5 text-yellow-500" />
                 </div>
                 Claims & Terms
               </h3>
               <p className="leading-relaxed text-neutral-400">
                 This app is a free utility tool provided as-is. By using this service, you agree to comply with international copyright laws. Do not download, convert, or distribute copyrighted content without the explicit permission of the owner.
               </p>
             </div>
           </div>
           
           <div className="border-t border-neutral-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-5 py-2 rounded-full border border-green-500/20 text-sm font-semibold shadow-[0_0_15px_rgba(34,197,94,0.1)]">
               <CheckCircle className="w-4 h-4" />
               <span>100% Secure Application</span>
             </div>
             <p className="text-base tracking-wide text-neutral-400">
               Created by - <strong className="text-yellow-500 font-bold tracking-wider text-lg ml-1">Mahad Uddin</strong>
             </p>
           </div>
        </footer>
      </main>
      </div>
      
      {/* Global AI Chat Support Widget */}
      <AiAssistant />
      
      {/* Global Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}
