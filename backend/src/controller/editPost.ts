import post from '../post';

export const editPost = (req: any, res: any) => {
  const { id } = req.params;
  const { judul, kategori, deskripsi } = req.body;
  const index = post.findIndex((n) => n.id === id);

  if (index !== -1) {
    post[index] = { ...post[index], judul, kategori, deskripsi };
    return res.json({
      message: 'Laporan berhasil diperbaharui',
    });
  }

  return res.status(404).json({
    message: 'Gagal memperbaharui laporan',
  });
};
