import { supabase } from '../lib/supabase';
import { z } from 'zod';
import path from 'path';

const reportSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  category: z.string().min(2, 'Kategori harus dipilih'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
  reportType: z.enum(['public', 'anonymous', 'confidential']).optional().nullable()
});

export const createReport = async (req: any, res: any) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: 'user belum login nih' });
    }

    console.log('--- CREATE REPORT START ---');
    console.log('User from JWT:', { id: user.id, username: user.username, role: user.role });
    console.log('Incoming body:', req.body);
    console.log('File attached:', req.file ? req.file.originalname : 'No file');

    const parseResult = reportSchema.safeParse(req.body);
    if (!parseResult.success) {
      console.log('Zod validation errors:', parseResult.error.issues);
      return res.status(400).json({ message: parseResult.error.issues?.[0]?.message || 'Validasi gagal' });
    }

    const { title, category, description, latitude, longitude, reportType } = parseResult.data;

    // Ambil username dari JWT, fallback ke body, atau query DB jika masih null
    let username = user.username || req.body.username;
    
    if (!username) {
      console.log('Username tidak ada di JWT, query dari tabel users...');
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData?.username) {
        console.error('Gagal ambil username dari DB:', profileError);
        return res.status(400).json({ message: 'Username tidak ditemukan. Silakan lengkapi profil Anda terlebih dahulu.' });
      }
      username = profileData.username;
    }

    console.log('Using username:', username);

    let publicImageUrl = null;

    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        return res.status(500).json({ message: 'Gagal mengunggah foto ke cloud storage' });
      }

      const { data: { publicUrl } } = supabase.storage
        .from('reports')
        .getPublicUrl(fileName);

      publicImageUrl = publicUrl;
      console.log('Image uploaded to:', publicImageUrl);
    }

    const payload = {
      complaint_title: title,
      complaint_category: category.toLowerCase(),
      complaint_description: description,
      complaint_image: publicImageUrl,
      user_id: user.id,
      username: username,
      status: 'menunggu',
      upvotes: 0,
      privasi: reportType || 'public',
      ...(latitude ? { latitude: parseFloat(latitude) } : {}),
      ...(longitude ? { longitude: parseFloat(longitude) } : {}),
    };
    
    console.log('Payload for insert:', payload);

    const { data: newReport, error } = await supabase
      .from('reports')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    console.log('--- CREATE REPORT SUCCESS ---', newReport?.id);

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
