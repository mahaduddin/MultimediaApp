import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Download, RefreshCw, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { motion } from "motion/react";

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export function MemeMaker() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<MemeTemplate | null>(null);
  const [memeText, setMemeText] = useState("");
  const [textOptions, setTextOptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [textPos, setTextPos] = useState({ x: 0.5, y: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTemplates(data.data.memes);
          // Pick random template
          const random = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
          setCurrentTemplate(random);
        }
      })
      .catch((e) => console.error("Failed to load memes", e));
  }, []);

  const drawMeme = () => {
    if (!currentTemplate || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Calculate scaled dimensions to fit a reasonable size
      const scale = Math.min(600 / img.width, 600 / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);

      if (memeText) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        
        // Font size based on width
        const fontSize = Math.floor(width / 12);
        ctx.font = `bold ${fontSize}px sans-serif`;

        // Split text by lines based on max width
        const words = memeText.split(' ');
        let line = '';
        let lines = [];
        const maxWidth = width - 40;

        for(let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        // Draw at relative position
        let y = Math.max(fontSize, Math.min(height - (lines.length * fontSize), height * textPos.y));
        const cx = Math.max(20, Math.min(width - 20, width * textPos.x));
        
        for(let i=0; i<lines.length; i++) {
          ctx.strokeText(lines[i], cx, y);
          ctx.fillText(lines[i], cx, y);
          y += fontSize + 5;
        }
      }
    };
    img.src = currentTemplate.url;
  };

  useEffect(() => {
    drawMeme();
  }, [currentTemplate, memeText, textPos]);

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTextPos({ x, y });
  };

  const generateAIText = async () => {
    if (!currentTemplate) return;
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Generate a funny, relatable single punchline meme text in Hindi (in Latin script/Hinglish or Devanagari) for a meme template named "${currentTemplate.name}". The text should be concise, not too big. Please output ONLY the meme text.` 
        }),
      });
      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Invalid response from server");
      }
      if (!res.ok) throw new Error(data.error || "Failed to generate meme text");
      let textReply = data.reply?.trim() || "";
      if (!textReply || textReply.length < 2) {
        throw new Error("AI did not return a valid meme punchline.");
      }
      
      const options = textReply.split('\n').map((opt: string) => opt.replace(/^"|"$/g, '').trim()).filter(Boolean);
      if (options.length > 0) {
        setTextOptions(options);
        setMemeText(options[0]);
      } else {
        throw new Error("AI output format error.");
      }
    } catch (err: any) {
      setError("Failed to generate AI meme text.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !currentTemplate) return;
    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `meme-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (currentTemplate && !memeText && !isGenerating && textOptions.length === 0) {
      generateAIText();
    }
  }, [currentTemplate]);

  const nextTemplate = () => {
    if (!templates.length) return;
    const random = templates[Math.floor(Math.random() * templates.length)];
    setCurrentTemplate(random);
    setMemeText("");
    setTextOptions([]);
    setTextPos({ x: 0.5, y: 0.8 });
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCurrentTemplate({
      id: "custom",
      name: "Custom Image",
      url,
      width: 0,
      height: 0,
      box_count: 2
    });
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold flex flex-col md:flex-row items-center gap-3 md:justify-start justify-center">
          <ImageIcon className="w-10 h-10 text-yellow-500" />
          AI Meme Maker
        </h2>
        <p className="text-neutral-400 text-lg">Generate viral Hindi memes automatically using AI.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Canvas Area */}
        <div className="flex-1 bg-neutral-900/40 border border-neutral-800/80 rounded-[2.5rem] p-4 flex flex-col items-center justify-center min-h-[400px] backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent -z-10" />
          {error && <p className="text-red-400 mb-4 font-medium">{error}</p>}
          <canvas 
            ref={canvasRef} 
            className="max-w-full rounded-xl shadow-2xl cursor-move touch-none" 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          <p className="text-xs text-neutral-500 font-medium absolute bottom-4 text-center pb-2 pointer-events-none">Hint: You can drag the text to reposition it.</p>
        </div>

        {/* Controls */}
        <div className="w-full md:w-72 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={nextTemplate}
              className="w-full flex justify-center items-center gap-2 bg-neutral-800 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-700 text-white p-3 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Random</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex justify-center items-center gap-2 bg-neutral-800 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-700 text-white p-3 rounded-xl transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="text-sm font-medium">Upload</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleCustomUpload} accept="image/*" className="hidden" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-neutral-400 font-medium px-1">Meme Text (Hindi)</label>
            <textarea
              value={memeText}
              onChange={(e) => setMemeText(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500/50 min-h-[80px] shadow-inner"
              placeholder="Your punchline..."
            />
          </div>

          {textOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-400 font-medium px-1">AI Suggestions</label>
              <div className="flex flex-col gap-2">
                {textOptions.slice(0, 3).map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setMemeText(opt)}
                    className={`p-2 text-sm text-left border rounded-xl transition-colors ${memeText === opt ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-neutral-800 border-neutral-700 hover:border-yellow-500/50 text-neutral-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={generateAIText}
            disabled={isGenerating}
            className="w-full flex justify-center items-center gap-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black font-semibold p-3 rounded-xl transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Generate AI Meme"}
          </button>

          <button 
            onClick={handleDownload}
            disabled={!currentTemplate}
            className="w-full flex justify-center items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold p-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Download className="w-5 h-5" />
            Download Meme
          </button>
        </div>
      </div>
    </div>
  );
}
