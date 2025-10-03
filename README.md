

````markdown
# NodeAI API

API sederhana menggunakan **Express.js** untuk generate teks, gambar, dokumen, dan audio dengan Google GenAI.

## Instalasi
```bash
git clone https://github.com/Anang-Programmer/gemini-ai-api-project.git
cd gemini-api-project
npm install
````

Buat file `.env` dan isi:

```env
GOOGLE_API_KEY=your_api_key_here
```

## Menjalankan Server

```bash
node index.js
```

Server berjalan di:

```
http://localhost:3000
```

## Endpoint

Prefix: `/api`

* `POST /api/generate-text`
* `POST /api/generate-from-image`
* `POST /api/generate-from-document`
* `POST /api/generate-from-audio`


