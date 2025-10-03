// index.js

import express from "express";
import multer from "multer";
import cors from "cors";
import "dotenv/config"; // Load environment variables di awal

// Impor semua router dari folder /endpoint
import textRouter from "./endpoint/generate-text.js";
import imageRouter from "./endpoint/generate-from-image.js";
import documentRouter from "./endpoint/generate-from-document.js";
import audioRouter from "./endpoint/generate-from-audio.js";

const app = express();
const port = 3000;

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// === Pendaftaran Route ===
// Memberitahu Express untuk menggunakan router yang sudah diimpor.
// Semua endpoint di bawah ini akan memiliki prefix /api.
// Contoh: /api/generate-text, /api/generate-from-image, dst.
app.use("/api", textRouter);
app.use("/api", imageRouter);
app.use("/api", documentRouter);
app.use("/api", audioRouter);

// Menjalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});