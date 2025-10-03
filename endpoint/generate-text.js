import express, { Router } from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';


import 'dotenv/config';

// Mulai persiapkan project kita 

// 1. Inisialisasi Express

const router = express.Router();
const ai = new GoogleGenAI({});
let conversation = []; // simpan semua riwayat chat



// 2. Inisialisasi Multer
// router.use(cors());
// // router.use(multer());
// router.use(express.json());

// 3. Inisialisasi endpoint
// [HTTP method: GET, POST, PUT, PATCH, DELETE]
// .get() --> utamanya untuk mengambil data, atau search
// .post() --> utamanya untuk menambahkan data baru kedalam server
// .put() --> utamanya untuk mengupdate data yang sudah ada didalam server
// .patch() --> utamanya untuk menambal data yang sudah ada didalam server
// .delete() --> utamanya untuk menghapus data yang sudah ada didalam server
//

router.post(
    '/chat', //http://localhost:[PORT]/chat
    async (req, res) => {
        const { body } = req;
        const { conversation } = body;



        if (!conversation || !Array.isArray(conversation)) {
            res.status(400).json({
                message: 'Percakapan Harus Valid',
                data: null,
                success: false,
            })

            return;
        }

        // guard clause #2 -- satpam ketat!
        const conversationIsValid = conversation.every((message) => {
            // kondisi pertama -- message harus truthy
            if (!message) return false;

            // kondisi kedua -- message harus berupa object, namun bukan array!
            if (typeof message !== 'object' || Array.isArray(message)) return false;

            // kondisi ketiga -- message harus berisi hanya role dan text
            const keys = Object.keys(message);
            const keyLengthIsValid = keys.length === 2;
            const keyContainsValidName = keys.every(key => ['role', 'text'].includes(key));

            if (!keyLengthIsValid || !keyContainsValidName) return false;

            // kondisi keempat
            // -- role harus berupa 'user' | 'model'
            // -- text harus berupa string

            const { role, text } = message;
            const roleIsValid = ['user', 'model'].includes(role);
            const textIsValid = typeof text === 'string';

            if (!roleIsValid || !textIsValid) return false;

            // selebihnya...

            return true;
        });


        if (!conversationIsValid) {
            res.status(400).json({
                message: 'Percakapan Harus Valid',
                data: null,
                success: false,
            })

            return;
        }
        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        // dagingnya (A5 wagyu nih)
        try {
            // 3rd party API -- Google AI
            const aiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents
            });

            res.status(200).json({
                success: true,
                data: aiResponse.text,
                message: "Berhasil ditanggapi oleh Google Gemini Flash!"
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                success: false,
                data: null,
                message: e.message || "Ada masalah di server gan!"
            })
        }
    }
);

// entry point
// router.listen(3000, () => {
//     console.log('Server is running on port 3000');
// })

export default router