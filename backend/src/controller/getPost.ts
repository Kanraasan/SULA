import reportData from '../reportData';

export const getReports = (req: any, res: any) => {
  res.status(200).json({
    message: 'Berhasil mengambil data laporan',
    data: reportData,
  });
};
