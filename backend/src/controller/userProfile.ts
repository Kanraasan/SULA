import { supabase } from '../lib/supabase';

export const updateUserProfile = async (req: any, res: any) => {
  const user = req.user;
  const { username, no_wa, alamat_lengkap, kecamatan, kelurahan } = req.body;

  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        username,
        alamatLengkap: alamat_lengkap,
        kecamatan,
        kelurahan,
        // no_wa: no_wa, // uncomment ini jika kolom no_wa sudah ada di DB
      })
      .eq('id', user.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    if (!updatedUser) {
      return res.status(404).json({
        message: 'Gagal mengupdate: User tidak ditemukan atau terblokir kebijakan keamanan RLS',
      });
    }

    return res.status(200).json({
      message: 'Profil berhasil diperbarui',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Error update user profile:', error);
    return res.status(500).json({
      message: 'Server error saat update profil',
      error: error.message,
    });
  }
};
