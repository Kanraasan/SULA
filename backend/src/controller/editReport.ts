import { supabase } from '../lib/supabase';

export const editReport = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, category, description, status } = req.body;

  try {
    const { data, error } = await supabase
      .from('reports')
      .update({
        complaint_title: title,
        complaint_category: category?.toLowerCase(),
        complaint_description: description,
        ...(status ? { status: status.toLowerCase() } : {}),
      })
      .eq('id', id)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({
        message: 'Gagal memperbaharui laporan',
      });
    }

    return res.json({
      message: 'Laporan berhasil diperbaharui',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
