import { supabase } from '../lib/supabase';

export const createReport = async (req: any, res: any) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: 'user belum login nih' });
    }

    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ message: 'form-nya diisi semua dong' });
    }

    // 1. Simpan laporan ke Supabase (sesuaikan dengan tabel 'reports' di SQL)
    const { data: newReport, error } = await supabase
      .from('reports')
      .insert([
        {
          complaint_title: title,
          complaint_category: category.toLowerCase(), // Sesuaikan agar cocok dengan ENUM di SQL (lowercase)
          complaint_description: description,
          complaint_image: req.file?.filename ?? null, // Simpan nama file foto
          user_id: user.id, // Menyambung ke tabel 'users' via ID
          username: user.username,
          status: 'menunggu', // Sesuaikan dengan list status di SQL
          upvotes: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: 'laporan berhasil dibikin',
      data: newReport,
    });
  } catch (error: any) {
    console.error('error pas createReport:', error);
    return res.status(500).json({
      message: 'ada masalah di server',
      error: error.message
    });
  }
};
