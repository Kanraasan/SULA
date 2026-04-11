import { supabase } from '../lib/supabase';

/**
 * GET /api/admin/profile
 * Mengambil profil admin berdasarkan ID dari JWT token
 */
export const getAdminProfile = async (req: any, res: any) => {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ message: 'User belum login' });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('id, nik, username, alamatLengkap, kecamatan, kelurahan, tanggalLahir, role')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ message: 'Profil tidak ditemukan' });
    }

    return res.status(200).json({
      message: 'Berhasil mengambil profil',
      data: {
        ...profile,
        email: user.email, // email dari JWT (disimpan di auth.users, bukan public.users)
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/profile
 * Update profil admin (username, alamatLengkap, kecamatan, kelurahan)
 */
export const updateAdminProfile = async (req: any, res: any) => {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ message: 'User belum login' });
    }

    const { username, alamatLengkap, kecamatan, kelurahan } = req.body;

    const updatePayload: Record<string, any> = {};
    if (username !== undefined) updatePayload.username = username;
    if (alamatLengkap !== undefined) updatePayload.alamatLengkap = alamatLengkap;
    if (kecamatan !== undefined) updatePayload.kecamatan = kecamatan;
    if (kelurahan !== undefined) updatePayload.kelurahan = kelurahan;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: 'Tidak ada data yang diubah' });
    }

    const { data, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', user.id)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({
        message: 'Gagal memperbarui profil',
      });
    }

    return res.status(200).json({
      message: 'Profil berhasil diperbarui',
      data: data[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/account
 * Hapus akun admin — menghapus dari tabel public.users
 * (Supabase Auth delete memerlukan service_role key)
 */
export const deleteAdminAccount = async (req: any, res: any) => {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ message: 'User belum login' });
    }

    // Hapus dari tabel public.users
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    // Coba hapus dari Supabase Auth juga (butuh service_role key)
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (authDeleteError) {
      console.warn('Gagal hapus dari Auth (mungkin bukan service_role key):', authDeleteError.message);
    }

    return res.status(200).json({
      message: 'Akun berhasil dihapus',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus akun',
      error: error.message,
    });
  }
};
