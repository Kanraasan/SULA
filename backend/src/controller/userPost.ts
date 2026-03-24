import post from '../post';

export const postContent = (req: any, res: any) => {
  type laporan = {
    judul: string;
    kategori: any;
    deskripsi: string;
    lampiranFoto: any;
  };
  const { judul, kategori, deskripsi, lampiranFoto } = req.body;

  if (!judul || !kategori || !deskripsi) {
    return res.status(400).json({
      message: 'Mohon lengkapi form',
    });
  }
  const newPost: laporan = {
    judul,
    kategori,
    deskripsi,
    lampiranFoto,
  };

  post.push(newPost);

  return res.status(201).json({
    message: 'Laporan berhasil dibuat',
    data: newPost,
  });
};
