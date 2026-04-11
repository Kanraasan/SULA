import reportData from '../mock/reportData';
import { nanoid } from 'nanoid';

export const createReport = (req: any, res: any) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: 'user belum login nih' });
    }

    const { title, category, description } = req.body;
    const id = nanoid(16);

    if (!title || !category || !description) {
      return res.status(400).json({ message: 'form-nya diisi semua dong' });
    }

    interface Laporan {
      id: string;
      title: string;
      category: any;
      description: string;
      lampiranFoto: any;
      userNik?: any;
      username?: string;
      createdAt: string;
    }

    const newReport = {
      id,
      title,
      category,
      description,
      lampiranFoto: req.file?.filename ?? null,
      userNik: user.nik, // ambil dari jwt
      username: user.username, // ambil dari jwt
      createdAt: new Date().toISOString(),
    } as Laporan;

    reportData.push(newReport);

    const isSuccess = reportData.filter((p) => p.id === id).length > 0;

    if (!isSuccess) {
      return res.status(400).json({ message: 'laporan gagal dibikin' });
    }

    return res.status(201).json({
      message: 'laporan berhasil dibikin',
      data: newReport,
    });
  } catch (error) {
    console.error('error pas createReport:', error);
    return res.status(500).json({ 
      message: 'ada masalah di server',
      error: error instanceof Error ? error.message : 'error gak tau kenapa'
    });
  }
};
