import { supabase } from '../lib/supabase';

export const deleteReportById = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({
        message: 'Laporan gagal dihapus, Id tidak ditemukan',
      });
    }

    return res.json({
      message: 'Laporan berhasil dihapus',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
