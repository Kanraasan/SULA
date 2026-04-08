import reportData from '../reportData';

export const getReportById = (req: any, res: any) => {
  const { id } = req.params;
  const report = reportData.find((p) => p.id === id);

  if (!report) {
    return res.status(404).json({ message: 'Laporan tidak ditemukan' });
  }

  res.status(200).json({
    message: 'Berhasil mengambil detail laporan',
    data: report,
  });
};
