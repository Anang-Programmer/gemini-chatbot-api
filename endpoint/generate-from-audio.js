import express, { Router } from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const router = express.Router();
const port = 3000;

router.use(cors());
router.use(express.json());

// Multer in memory untuk audio
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // Limit 20MB untuk file audio
  }
});

// Inisialisasi client GenAI
const ai = new GoogleGenAI({});

// Helper untuk ekstrak teks
function extractText(genaiResponse) {
  try {
    return genaiResponse.text;
  } catch (e) {
    console.error("Error extracting text:", e);
    return "Gagal memproses respons AI.";
  }
}

// Endpoint audio + prompt
router.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File audio wajib ada." });
  }
  
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt teks wajib ada." });
  }

  // Validasi tipe file audio yang didukung
  const supportedMimeTypes = [
    "audio/wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/aac",
    "audio/ogg",
    "audio/flac"
  ];

  if (!supportedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      error: "Format audio tidak didukung. Gunakan: WAV, MP3, AAC, OGG, atau FLAC." 
    });
  }

  try {
    const audioBase64 = req.file.buffer.toString("base64");

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: audioBase64,
              },
            },
          ],
        },
      ],
    });

    res.json({ result: aiResponse.text });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk mendapatkan info file audio yang didukung
router.get("/supported-audio-formats", (req, res) => {
  res.json({
    formats: ["WAV", "MP3", "AAC", "OGG", "FLAC"],
    maxSize: "20MB",
    note: "Pastikan audio berkualitas baik untuk hasil terbaik"
  });
});

export default router;