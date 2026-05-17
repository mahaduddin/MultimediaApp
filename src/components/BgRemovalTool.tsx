import React, { useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
import { UploadCloud, Image as ImageIcon, Eraser, Loader2, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export function BgRemovalTool() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setResultImage(null);
    setProgressText("");
    
    // Show preview
    const url = URL.createObjectURL(file);
    setSourceImage(url);

    // Start processing
    processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgressText("Loading AI models (Can take 15-30s on first run) ...");
    
    try {
      // The configuration handles progress updates naturally if we hook into it,
      // but for simplicity we rely on the library defaults.
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          setProgressText(`Processing... \nDownloading resources: ${key}`);
        }
      });
      
      const newUrl = URL.createObjectURL(blob);
      setResultImage(newUrl);
    } catch (err: any) {
      console.error(err);
      alert("Background removal failed: " + err.message);
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  };

  const clearSelection = () => {
    setSourceImage(null);
    setResultImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="space-y-2 mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold flex flex-col md:flex-row items-center gap-3 md:justify-start justify-center">
          <Eraser className="w-10 h-10 text-yellow-500" />
          Background Removal
        </h2>
        <p className="text-neutral-400 text-lg">Instantly remove backgrounds securely using on-device AI.</p>
      </div>

      {!sourceImage ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 min-h-[400px] border-2 border-dashed border-neutral-700/80 hover:border-yellow-500/60 rounded-[2.5rem] bg-neutral-900/40 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all group relative overflow-hidden backdrop-blur-xl hover:shadow-[0_0_40px_rgba(234,179,8,0.1)]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="p-6 bg-yellow-500 rounded-full group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(234,179,8,0.4)] relative z-10">
            <UploadCloud className="w-10 h-10 text-black" />
          </div>
          <div className="text-center relative z-10">
            <p className="text-xl font-medium text-white mb-2">Click to Upload Image</p>
            <p className="text-sm text-neutral-500 max-w-xs mx-auto">Supported formats: JPG, PNG, WEBP. High resolution images may take longer.</p>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative flex-1">
          {/* Source Image */}
          <div className="glass-panel border border-neutral-800 rounded-3xl p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="font-medium text-neutral-400 text-sm tracking-wider uppercase">Original</span>
              <button onClick={clearSelection} disabled={isProcessing} className="text-xs text-neutral-500 hover:text-white disabled:opacity-50 transition-colors">
                Select Different
              </button>
            </div>
            <div className="flex-1 bg-neutral-950/50 rounded-2xl overflow-hidden relative min-h-[300px]">
              <img src={sourceImage} alt="Source" className="absolute inset-0 w-full h-full object-contain" />
            </div>
          </div>

          {/* Result Image */}
          <div className={cn(
            "glass-panel border border-neutral-800 rounded-3xl p-4 flex flex-col h-full relative overflow-hidden",
            isProcessing && "border-fuchsia-500/30 shadow-[0_0_40px_rgba(217,70,239,0.1)]"
          )}>
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="font-medium text-fuchsia-400 text-sm tracking-wider uppercase">Result</span>
              {resultImage && (
                <a 
                  href={resultImage} 
                  download="bg-removed.png"
                  className="flex items-center gap-1.5 text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-full transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Image
                </a>
              )}
            </div>
            
            <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE3MTcxNyIgLz4KPHBhdGggZD0iTTAgMGgxMHYxMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiMyNjI2MjYiIC8+Cjwvc3ZnPg==')] rounded-2xl overflow-hidden relative flex flex-col items-center justify-center min-h-[300px]">
              
              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center px-4"
                  >
                    <Loader2 className="w-10 h-10 text-fuchsia-500 animate-spin mb-4" />
                    <p className="text-white font-medium">Extracting Subject...</p>
                    <p className="text-xs text-neutral-400 mt-2 max-w-xs">{progressText}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {resultImage && (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={resultImage} 
                  alt="Result without background" 
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-10" 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
