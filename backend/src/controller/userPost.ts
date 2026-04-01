import post from '../post';
import { nanoid } from 'nanoid';

export const postContent = (req: any, res: any) => {
  const { judul, kategori, deskripsi, userNIK, username } = req.body;
  const id = nanoid(16);

  if (!judul || !kategori || !deskripsi) {
    return res.status(400).json({ message: 'Mohon lengkapi form' });
  }
  interface laporan {
    id: string;
    judul: string;
    kategori: any;
    deskripsi: string;
    lampiranFoto: any;
    userNIK?: any;
    username?: string;
    createdAt: string;
  }
  const newPost = {
    id,
    judul,
    kategori,
    deskripsi,
    lampiranFoto: req.file?.filename ?? null,
    userNIK,
    username,
    createdAt: new Date().toISOString(),
  } as laporan;
  post.push(newPost);

  const isSuccess = post.filter((post) => post.id === id).length > 0;

  if (!isSuccess) {
    return res.status(400).json({ message: 'Laporan gagal dibuat' });
  }

  if (isSuccess) {
    return res.status(201).json({
      message: 'Laporan berhasil dibuat',
      data: newPost,
    });
  }
};
