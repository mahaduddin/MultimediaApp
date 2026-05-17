import React, { useState, useRef } from "react";
import { UploadCloud, Download, Zap, RefreshCw, Minimize } from "lucide-react";
import { motion } from "motion/react";

export function ImageCompressor() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    
    setImageFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    
    compressImage(file, 0.7);
    setQuality(0.7);
  };

  const compressImage = (file: File, q: number) => {
    setIsCompressing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          const newUrl = URL.createObjectURL(blob);
          setCompressedUrl(newUrl);
          setCompressedSize(blob.size);
        }
        setIsCompressing(false);
      }, "image/jpeg", q);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseFloat(e.target.value);
    setQuality(newQuality);
    if (imageFile) {
      compressImage(imageFile, newQuality);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `compressed_${imageFile?.name || "image.jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
          <Minimize className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Image Compressor</h2>
        <p className="text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Reduce the file size of your images instantly. Keep the quality high while saving space and bandwidth. Works entirely on your device.
        </p>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-[2.5rem] p-6 lg:p-10 backdrop-blur-xl shadow-2xl">
        {!originalUrl ? (
          <label className="flex flex-col items-center justify-center w-full min-h-[350px] border-2 border-dashed border-neutral-700/50 rounded-[2rem] cursor-pointer hover:border-yellow-500/50 hover:bg-neutral-800/30 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 bg-neutral-800 rounded-full mb-4 group-hover:scale-110 shadow-lg transition-transform text-yellow-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="font-semibold text-lg text-white mb-2">Upload an Image</p>
            <p className="text-sm text-neutral-500 font-medium max-w-xs text-center">Drag and drop or click to browse (JPG, PNG, WebP)</p>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Original Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-300">Original</h3>
                  <span className="text-xs font-mono bg-neutral-800 px-3 py-1 rounded-full text-neutral-400 border border-neutral-700">
                    {formatSize(originalSize)}
                  </span>
                </div>
                <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                  <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Compressed Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-yellow-500 flex items-center gap-2">
                    Compressed 
                    {isCompressing && <RefreshCw className="w-3 h-3 animate-spin" />}
                  </h3>
                  <span className="text-xs font-mono bg-yellow-500/10 px-3 py-1 rounded-full text-yellow-500 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                    {formatSize(compressedSize)}
                  </span>
                </div>
                <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center group">
                  {compressedUrl && <img src={compressedUrl} alt="Compressed" className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500" />}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 bg-black/40 p-6 md:p-8 rounded-[2rem] border border-neutral-800/80 mt-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] pointer-events-none rounded-full" />
               
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 w-full">
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
                         Quality Slider
                       </label>
                       <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800">
                         {Math.round(quality * 100)}%
                       </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.05" 
                      value={quality} 
                      onChange={handleQualityChange}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setOriginalUrl(null);
                        setCompressedUrl(null);
                      }}
                      className="px-6 py-4 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors font-medium text-sm flex-1 md:flex-none flex items-center justify-center"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={!compressedUrl || isCompressing}
                      className="flex-1 md:flex-none flex items-center justify-center px-8 py-4 bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Save Image
                    </button>
                  </div>
               </div>
               
               {originalSize > 0 && compressedSize > 0 && (
                 <div className="pt-6 border-t border-neutral-800/50 flex items-center justify-center gap-2 text-sm text-neutral-400 relative z-10">
                   <Zap className="w-4 h-4 text-yellow-500" />
                   You saved <span className="text-white font-bold">{formatSize(originalSize - compressedSize)}</span> 
                   ({Math.round(((originalSize - compressedSize) / originalSize) * 100)}% reduction)
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
