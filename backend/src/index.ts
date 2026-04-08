import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import multer from 'multer';
import path from 'path';

// muat variabel dari file .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
// ambil url frontend buat izin cors, default-nya localhost vite
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
// atur izin akses (cors) biar frontend bisa konek
app.use(
  cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());

// buat akses file statis dari folder uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', router);

// endpoint simpel buat ngetes koneksi aja
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'halo dari express!' });
});

// nyalain server-nya
app.listen(port, () => {
  console.log(`server jalan di http://localhost:${port}`);
});
