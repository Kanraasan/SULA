import { supabase } from '../lib/supabase';

export const getReports = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      message: 'Berhasil mengambil data laporan',
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Gagal mengambil data laporan',
      error: error.message,
    });
  }
};
