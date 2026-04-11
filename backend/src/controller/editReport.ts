import reportData from '../mock/reportData';

export const editReport = (req: any, res: any) => {
  const { id } = req.params;
  const { title, category, description, status } = req.body;
  const index = reportData.findIndex((n) => n.id === id);

  if (index !== -1) {
    reportData[index] = {
      ...reportData[index],
      title,
      category,
      description,
      ...(status ? { status } : {}),
    };
    return res.json({
      message: 'Laporan berhasil diperbaharui',
    });
  }

  return res.status(404).json({
    message: 'Gagal memperbaharui laporan',
  });
};
