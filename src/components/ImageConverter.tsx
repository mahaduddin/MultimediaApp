import React, { useState, useRef } from "react";
import { CopySlash, Download, UploadCloud, FileImage } from "lucide-react";
import { motion } from "motion/react";

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    // Default switch: if png, suggest jpeg, etc.
    if (selected.type === "image/png") setTargetFormat("image/jpeg");
    else if (selected.type === "image/jpeg") setTargetFormat("image/png");
  };

  const handleConvert = () => {
    if (!preview || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Fill background for transparency to jpeg conversion
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      const ext = targetFormat.split('/')[1];
      const dataUrl = canvas.toDataURL(targetFormat, 0.9);
      
      const link = document.createElement("a");
      link.href = dataUrl;
      const originalName = file?.name.split('.')[0] || "converted";
      link.download = `${originalName}.${ext}`;
      link.click();
    };
    img.src = preview;
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold flex flex-col md:flex-row items-center gap-3 md:justify-start justify-center">
          <CopySlash className="w-10 h-10 text-yellow-500" />
          Format Converter
        </h2>
        <p className="text-neutral-400 text-lg">Convert between PNG, JPG, and WEBP instantly, right in your browser.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square w-full border-2 border-dashed border-neutral-700/80 hover:border-yellow-500/60 rounded-[2.5rem] bg-neutral-900/40 flex flex-col items-center justify-center p-6 cursor-pointer transition-all relative overflow-hidden group hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] backdrop-blur-xl"
        >
          {preview ? (
            <img src={preview} alt="Upload preview" className="w-full h-full object-contain z-10 drop-shadow-2xl" />
          ) : (
            <>
              <div className="p-6 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] mb-6 group-hover:scale-110 transition-transform duration-500">
                <UploadCloud className="w-10 h-10 text-black" />
              </div>
              <p className="font-medium text-white text-center">Click to Upload Image</p>
            </>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFile} className="hidden" />
        </div>

        <div className="glass-panel border border-neutral-800 rounded-3xl p-6 flex flex-col gap-6 justify-center">
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-400">Convert to Format</label>
            <div className="flex gap-3">
              {[
                { val: "image/jpeg", label: "JPG" },
                { val: "image/png", label: "PNG" },
                { val: "image/webp", label: "WEBP" },
              ].map(fmt => (
                <button
                  key={fmt.val}
                  onClick={() => setTargetFormat(fmt.val as any)}
                  className={`flex-1 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                    targetFormat === fmt.val 
                      ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] transform scale-[1.02]" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={!preview}
            className="w-full flex justify-center items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4"
          >
            <Download className="w-5 h-5" />
            Convert & Download
          </button>
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
