import post from '../post';
export const postContent = (req: any, res: any) => {
  const { judul, kategori, deskripsi } = req.body;

  if (!judul || !kategori || !deskripsi) {
    return res.status(400).json({ message: 'Mohon lengkapi form' });
  }
  interface laporan {
    judul: string;
    kategori: any;
    deskripsi: string;
    lampiranFoto: any;
  }
  const newPost = {
    judul,
    kategori,
    deskripsi,
    lampiranFoto: req.file?.filename ?? null,
  } as laporan;

  post.push(newPost);

  return res.status(201).json({
    message: 'Laporan berhasil dibuat',
    data: newPost,
  });
};
