import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

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

app.use('/api', router);

// endpoint simpel buat ngetes koneksi
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express!' });
});

// nyalain server-nya
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
