# Project Capstone Fullstack Vite + Express

Projek ini memakai **Vite** untuk frontend dan **Express.js** untuk backend.

## Teknologi Utama
- **Frontend**: Vite, React 19, Tailwind CSS v4, TypeScript.
- **Backend**: Express.js, TypeScript, ts-node-dev.

## Struktur
- `frontend/`: Aplikasi React yang dibuat dengan Vite dan Tailwind CSS v4.
- `backend/`: Server Express.js menggunakan TypeScript.

## Memulai Proyek

### 1. Jalankan Backend
```bash
cd backend
npm install
npm run dev
```
Backend berjalan di `http://localhost:5000`.

### 2. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di `http://localhost:5173`. 

> **Catatan**: Vite dikonfigurasi dengan proxy untuk meneruskan permintaan dari `/api` ke `http://localhost:5000`.

## API Endpoints
- `GET /api/hello`: Mengembalikan pesan salam dari backend.
