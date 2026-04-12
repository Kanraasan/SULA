import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import path from 'path';


dotenv.config();

const app = express();
const port = process.env.PORT || 3245;

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', router);


app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'halo dari express!' });
});


app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  const status = err?.status || 500;
  res.status(status).json({
    message: err?.message || 'Terjadi kesalahan pada server',
  });
});


app.listen(port, () => {
  console.log(`server jalan di http://localhost:${port}`);
});
