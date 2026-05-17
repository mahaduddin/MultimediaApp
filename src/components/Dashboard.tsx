import { motion } from "motion/react";
import { DownloadCloud, Video, Sparkles, Image as ImageIcon, Loader2, Youtube, CopySlash, QrCode, Instagram, KeyRound, Type, Mic, Bot, Minimize } from "lucide-react";
import { cn } from "../lib/utils";

export function Dashboard({ onNavigate }: { onNavigate: (id: string) => void }) {
  const tools = [
    {
      id: "compressor",
      title: "Image Compressor",
      description: "Compress images without losing quality right in your browser.",
      icon: <Minimize className="w-8 h-8 text-yellow-500" />,
      gradient: "from-yellow-500/20 to-yellow-600/5",
    },
    {
      id: "bgrm",
      title: "Remove Background",
      description: "Extract subjects from images instantly with secure on-device AI.",
      icon: <ImageIcon className="w-8 h-8 text-fuchsia-400" />,
      gradient: "from-fuchsia-500/20 to-fuchsia-600/5",
    },
    {
      id: "meme",
      title: "Meme Maker",
      description: "Generate viral Hindi memes automatically using AI.",
      icon: <ImageIcon className="w-8 h-8 text-orange-400" />,
      gradient: "from-orange-500/20 to-orange-600/5",
    },
    {
      id: "yt-thumb",
      title: "YT Thumbnail Grabber",
      description: "Download max-resolution thumbnails from any YouTube link.",
      icon: <ImageIcon className="w-8 h-8 text-rose-400" />,
      gradient: "from-rose-500/20 to-rose-600/5",
    },
    {
      id: "insta",
      title: "IG Video Downloader",
      description: "Grab Reels and videos directly from Instagram.",
      icon: <Instagram className="w-8 h-8 text-pink-500" />,
      gradient: "from-pink-500/20 to-rose-500/5",
    },
    {
      id: "converter",
      title: "Image Converter",
      description: "Convert PNG to JPG and more, works fully offline.",
      icon: <CopySlash className="w-8 h-8 text-blue-400" />,
      gradient: "from-blue-500/20 to-blue-600/5",
    },
    {
      id: "qrcode",
      title: "QR Code Generator",
      description: "Create standard QR codes for any link or text.",
      icon: <QrCode className="w-8 h-8 text-green-400" />,
      gradient: "from-green-500/20 to-green-600/5",
    },
    {
      id: "tts",
      title: "Text to Speech",
      description: "Convert text to high quality speech easily.",
      icon: <Mic className="w-8 h-8 text-cyan-400" />,
      gradient: "from-cyan-500/20 to-cyan-600/5",
    },
    {
      id: "passgen",
      title: "Password Generator",
      description: "Instantly create highly secure passwords.",
      icon: <KeyRound className="w-8 h-8 text-teal-400" />,
      gradient: "from-teal-500/20 to-teal-600/5",
    }
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-4 text-center md:text-left pt-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex flex-col md:flex-row items-center gap-3 md:justify-start justify-center">
          <span>Multimedia<span className="text-yellow-500">.app</span></span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto md:mx-0 font-medium">
          Your all-in-one suite for creative media workflows. Fast, private, and powerful.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(tool.id)}
            className={cn(
              "cursor-pointer relative overflow-hidden rounded-[2rem] p-7 bg-neutral-900/40 border border-neutral-800/60 hover:border-neutral-700 hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 h-full backdrop-blur-md group",
              "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:opacity-0 hover:before:opacity-100 before:transition-opacity",
              tool.gradient
            )}
          >
            <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800/80 group-hover:scale-105 transition-transform duration-300">
              {tool.icon}
            </div>
            <div className="mt-2 text-left">
              <h2 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-neutral-50 transition-colors">{tool.title}</h2>
              <p className="text-neutral-400 text-sm leading-relaxed">{tool.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
