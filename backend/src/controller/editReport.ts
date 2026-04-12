import { supabase } from '../lib/supabase';

export const editReport = async (req: any, res: any) => {
  const { id } = req.params;
  const user = req.user;
  const { title, category, description, status, catatanAdmin, latitude, longitude } = req.body;

  try {
    // 1. Verify ownership if user is not admin
    if (user.role !== 'admin') {
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (reportError || !reportData) {
        return res.status(404).json({ message: 'Laporan tidak ditemukan' });
      }
      
      if (reportData.user_id !== user.id) {
        return res.status(403).json({ message: 'Anda tidak berhak mengedit laporan ini' });
      }
    }

    // 2. Perform update
    const updatePayload: any = {
      complaint_title: title,
      complaint_category: category?.toLowerCase(),
      complaint_description: description,
      ...(latitude !== undefined ? { latitude: parseFloat(latitude) } : {}),
      ...(longitude !== undefined ? { longitude: parseFloat(longitude) } : {}),
    };

    // Only admin can change status and catatanAdmin
    if (user.role === 'admin') {
      if (status) updatePayload.status = status.toLowerCase();
      if (catatanAdmin !== undefined) updatePayload.catatan_admin = catatanAdmin;
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updatePayload)
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
