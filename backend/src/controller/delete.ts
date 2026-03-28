import post from '../post';

export const deleteNoteById = (req: any, res: any) => {
  const { id } = req.params;
  const index = post.findIndex((n) => n.id === id);

  if (index !== -1) {
    post.splice(index, 1);
    return res.json({
      message: 'Catatan berhasil dihapus',
    });
  }

  return res.status(404).json({
    message: 'Catatan gagal dihapus, Id tidak ditemukan',
  });
};
