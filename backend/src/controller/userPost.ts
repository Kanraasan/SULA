import post from '../post';
import { nanoid } from 'nanoid';

export const postContent = (req: any, res: any) => {
  try {
    const { judul, kategori, deskripsi, userNIK, username } = req.body;
    const id = nanoid(16);

    console.log('Received data:', { judul, kategori, deskripsi, userNIK, username });

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

    console.log('New post created:', newPost);

    const isSuccess = post.filter((p) => p.id === id).length > 0;

    if (!isSuccess) {
      return res.status(400).json({ message: 'Laporan gagal dibuat' });
    }

    return res.status(201).json({
      message: 'Laporan berhasil dibuat',
      data: newPost,
    });
  } catch (error) {
    console.error('Error in postContent:', error);
    return res.status(500).json({ 
      message: 'Terjadi kesalahan server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
