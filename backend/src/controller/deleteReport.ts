import reportData from '../reportData';

export const deleteReportById = (req: any, res: any) => {
  const { id } = req.params;
  const index = reportData.findIndex((n) => n.id === id);

  if (index !== -1) {
    reportData.splice(index, 1);
    return res.json({
      message: 'Laporan berhasil dihapus',
    });
  }

  return res.status(404).json({
    message: 'Laporan gagal dihapus, Id tidak ditemukan',
  });
};
