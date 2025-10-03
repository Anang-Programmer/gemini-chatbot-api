# NodeAI API

API sederhana menggunakan **Express.js** untuk menghasilkan teks, gambar, dokumen, dan audio menggunakan **Google GenAI**.

---

## Struktur Folder

```
NodeAI/
├─ endpoint/
│  ├─ generate-from-audio.js
│  ├─ generate-from-document.js
│  ├─ generate-from-image.js
│  └─ generate-text.js
├─ node_modules/
├─ public/
│  ├─ index.html
│  ├─ script.js
│  └─ style.css
├─ .env
├─ .env.example
├─ .gitignore
├─ index.js
├─ package-lock.json
├─ package.json
└─ README.md
```

* `endpoint/` → Berisi script untuk tiap jenis generasi: teks, gambar, dokumen, audio.
* `public/` → Folder frontend sederhana untuk testing API (HTML, JS, CSS).
* `.env` → Tempat menyimpan **Google API key** (tidak di-commit ke Git).
* `index.js` → File utama server Express.js.

---

## Instalasi

Clone repo ini dan install dependencies:

```bash
git clone https://github.com/Anang-Programmer/gemini-ai-api-project.git
cd gemini-ai-api-project
npm install
```

Buat file `.env` berdasarkan `.env.example`:

```env
GOOGLE_API_KEY=your_api_key_here
PORT=3000
```

---

## Menjalankan Server

```bash
node index.js
```

Server berjalan di:

```
http://localhost:3000
```

---

## Endpoint API

Semua endpoint menggunakan prefix `/api`:

| Endpoint                      | Method | Deskripsi                                |
| ----------------------------- | ------ | ---------------------------------------- |
| `/api/generate-text`          | POST   | Generate teks menggunakan Google GenAI   |
| `/api/generate-from-image`    | POST   | Generate output berdasarkan input gambar |
| `/api/generate-from-document` | POST   | Generate output berdasarkan dokumen      |
| `/api/generate-from-audio`    | POST   | Generate output berdasarkan audio        |

---

## Contoh Request (cURL)

### Generate Text

```bash
curl -X POST http://localhost:3000/api/generate-text \
-H "Content-Type: application/json" \
-d '{"prompt":"Tulis puisi tentang AI"}'
```

### Generate From Image

```bash
curl -X POST http://localhost:3000/api/generate-from-image \
-H "Content-Type: multipart/form-data" \
-F "image=@path/to/image.png"
```

---

## Catatan

* Jangan commit file `.env` atau folder `node_modules` ke GitHub.
* Gunakan `.env.example` sebagai template untuk key API.

---

