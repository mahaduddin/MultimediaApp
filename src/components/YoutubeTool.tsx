import React, { useState } from "react";
import { Youtube, Search, Download, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface FormatInfo {
  itag: number;
  qualityLabel: string;
  mimeType: string;
  container: string;
  contentLength: string;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  author: string;
  formats: FormatInfo[];
}

export function YoutubeTool() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const fetchInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError("");
    setVideoInfo(null);

    try {
      const res = await fetch("/api/ytdl/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Invalid response from server");
      }
      if (!res.ok) throw new Error(data.error || "Failed to fetch metadata");
      
      setVideoInfo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (itag: number) => {
    // Open in a new tab / trigger file download natively
    window.location.href = `/api/ytdl/download?url=${encodeURIComponent(url)}&itag=${itag}`;
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold flex flex-col md:flex-row items-center gap-3 md:justify-start justify-center">
          <Youtube className="w-10 h-10 text-yellow-500" />
          Video Downloader
        </h2>
        <p className="text-neutral-400 text-lg">Fetch the highest quality videos from YouTube instantly.</p>
      </div>

      <form onSubmit={fetchInfo} className="relative flex items-center rounded-3xl bg-neutral-900/60 shadow-2xl p-2 mb-10 border border-neutral-800 focus-within:border-yellow-500/50 focus-within:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all backdrop-blur-md">
        <Search className="w-5 h-5 text-neutral-500 ml-4 hidden sm:block" />
        <input
          type="url"
          required
          placeholder="Paste YouTube link here... (e.g., https://youtube.com/watch?v=...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-transparent border-none text-white px-4 py-3 outline-none placeholder:text-neutral-600"
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative overflow-hidden"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Fetching</span>
            </>
          ) : (
            <span>Search</span>
          )}
        </button>
      </form>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mt-4">
          {error}
        </motion.div>
      )}

      {videoInfo && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8"
        >
          <div className="flex-shrink-0 w-full md:w-64 space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <img src={videoInfo.thumbnail} alt={videoInfo.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{videoInfo.title}</h3>
              <p className="text-sm text-neutral-400">{videoInfo.author}</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Available Formats</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videoInfo.formats.map((fmt) => (
                <button
                  key={fmt.itag}
                  onClick={() => handleDownload(fmt.itag)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">{fmt.qualityLabel || 'Standard'}</span>
                    <span className="text-xs text-neutral-500 mt-0.5 max-w-[120px] truncate">{fmt.container?.toUpperCase() || 'MP4'}</span>
                  </div>
                  <Download className="w-5 h-5 text-neutral-500 group-hover:text-yellow-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
