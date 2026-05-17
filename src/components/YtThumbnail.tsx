import React, { useState } from "react";
import { Youtube, Search, Download, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

export function YtThumbnail() {
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const extractThumbnail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Extract video ID
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;

    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const handleDownload = async () => {
    if (!thumbnailUrl) return;
    try {
      const res = await fetch(thumbnailUrl);
      const blob = await res.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `yt-thumbnail-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(err) {
      // CORS issue can happen directly fetching from youtube, fallback to open in new tab
      window.open(thumbnailUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-red-500" />
          YT Thumbnail Grabber
        </h2>
        <p className="text-neutral-400">Paste a YouTube link and download the highest quality thumbnail.</p>
      </div>

      <form onSubmit={extractThumbnail} className="relative flex items-center rounded-2xl glass-panel shadow-xl p-2 mb-8 border border-neutral-800 focus-within:border-yellow-500/50 transition-colors">
        <Search className="w-5 h-5 text-neutral-500 ml-4 hidden sm:block" />
        <input
          type="url"
          required
          placeholder="Paste YouTube link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-transparent border-none text-white px-4 py-3 outline-none placeholder:text-neutral-600"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
        >
          <span>Grab</span>
        </button>
      </form>

      {thumbnailUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-neutral-800 rounded-3xl p-6 flex flex-col items-center gap-6"
        >
          <img 
            src={thumbnailUrl} 
            alt="YouTube Thumbnail" 
            className="w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-800" 
          />
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Thumbnail
          </button>
        </motion.div>
      )}
    </div>
  );
}
