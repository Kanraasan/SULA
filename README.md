# Project Capstone Fullstack Vite + Express

projek ini pake **Vite** buat frontend dan **Express.js** buat backend. 

## Teknologi Utama
- **Frontend**: Vite, React 19, Tailwind CSS v4, TypeScript.
- **Backend**: Express.js, TypeScript, ts-node-dev.

## Struktur
- `frontend/`: aplikasi react yang dibuat pake vite dan tailwind css v4.
- `backend/`: server express.js pake typescript.

## Cara Mulai

### 1. Atur Variabel Lingkungan (.env)
sebelum jalanin, pastiin kamu udah buat file `.env` di folder masing-masing ya. kamu bisa contek dari file `.env.example` yang udah ada.

**di folder `frontend/`:**
buat file `.env.development` (buat lokal) atau `.env.production` (kalo mau deploy).
```bash
VITE_API_URL=/api
```

**di folder `backend/`:**
buat file `.env`.
```bash
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 2. Jalankan Backend
```bash
cd backend
npm install
npm run dev
```
backend bakal jalan di `http://localhost:5000`.

### 3. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
frontend bakal jalan di `http://localhost:5173`. 

> **catatan**: vite udah dikonfigurasi pake proxy, jadi semua request ke `/api` bakal otomatis dilempar ke `http://localhost:5000` biar gak kena masalah CORS pas lagi development.

## API Endpoints
- `GET /api/hello`: balikin pesan salam dari backend.
