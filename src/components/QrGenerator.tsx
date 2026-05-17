import { useState, useRef } from "react";
import { QrCode, Download } from "lucide-react";
import QRCode from "react-qr-code";
import { motion } from "motion/react";

export function QrGenerator() {
  const [text, setText] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Configure canvas size based on standard QR code size for high quality
    canvas.width = 1024;
    canvas.height = 1024;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "white"; // Background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <QrCode className="w-8 h-8 text-green-400" />
          QR Generator
        </h2>
        <p className="text-neutral-400">Generate high-quality QR codes for any text, URL, or data.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 glass-panel border border-neutral-800 rounded-3xl p-6">
          <label className="block text-sm font-medium text-neutral-400 mb-3">Your Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter URL, text, wifi credentials, etc..."
            className="w-full h-48 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-green-500/50 resize-none transition-colors"
          />
        </div>

        <div className="w-full md:w-80 glass-panel border border-neutral-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-6">
          <div 
            ref={qrRef}
            className="bg-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            <QRCode 
              value={text || "https://multimedia.app"} 
              size={200}
              level="M"
            />
          </div>
          
          <button
            onClick={handleDownload}
            disabled={!text}
            className="w-full flex justify-center items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Download className="w-5 h-5" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
