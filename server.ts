import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Max body size for potential large payloads
  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      let systemInstruction = "You are a customer support AI for Multimedia.app. Only assist users with using the app's features (Image Compressor, BG Removal, Image Converter, Meme Maker, QR Code). Talk respectfully in short, simple English sentences. Do not use Hindi, emojis, or symbols. Give a direct answer, do not output JSON.";
      
      if (message.toLowerCase().includes("meme text") || message.toLowerCase().includes("meme template")) {
        systemInstruction = "You are a meme generator. Read the prompt and output exactly 3 different, funny, short punchlines in Hindi or Hinglish. Separate each punchline with a newline character. Give ONLY the punchlines, no bullets, numbers, quotes, or conversational text.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: { 
          systemInstruction,
        }
      });
      
      res.json({ reply: response.text || "No reply generated" });
    } catch (err: any) {
      console.error("AI Error:", err);
      res.status(500).json({ error: err.message || "Failed to communicate with AI" });
    }
  });

  // --- Vite Middleware (Development) / Static Files (Production) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
