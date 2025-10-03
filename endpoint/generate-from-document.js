import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const router = express.Router();

// Multer in memory dengan limit size
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
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

// Endpoint document + prompt
router.post("/generate-from-document", upload.single("document"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File dokumen wajib ada." });
  }
  
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt teks wajib ada." });
  }

  try {
    // Validasi tipe file yang didukung
    const supportedMimeTypes = [
      'application/pdf',
      'text/plain',
      'text/html',
      'text/csv',
      'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ];

    if (!supportedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: "Format file tidak didukung. Gunakan PDF, DOC, DOCX, atau file teks."
      });
    }

    const documentBase64 = req.file.buffer.toString("base64");

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: documentBase64,
              },
            },
          ],
        },
      ],
    });

    res.json({ 
      result: extractText(aiResponse),
      filename: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;