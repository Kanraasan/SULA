import { supabase } from '../lib/supabase';

export const getReportById = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Berhasil mengambil detail laporan',
      data: report,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
