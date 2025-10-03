import express, { Router } from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const router = express.Router();
const port = 3000;

router.use(cors());
router.use(express.json());

// Multer in memory
const upload = multer({ storage: multer.memoryStorage() });

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

// Endpoint image + prompt
router.post("/generate-from-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File gambar wajib ada." });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt teks wajib ada." });
  }

  try {
    const imageBase64 = req.file.buffer.toString("base64");

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
                data: imageBase64,
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

// router.listen(port, () => {
//   console.log(`Server berjalan di http://localhost:${port}`);
// });

export default router;
