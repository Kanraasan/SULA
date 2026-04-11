import { supabase } from '../lib/supabase';

export const createUser = async (req: any, res: any) => {
  if (!req.body) {
    return res.status(400).json({
      message:
        'Request body tidak ditemukan. Pastikan Content-Type: application/json',
    });
  }

  const {
    nik,
    username,
    email,
    password,
    passwordConfirm,
    alamatLengkap,
    kecamatan,
    kelurahan,
    tanggalLahir, // Tambahkan field ini sesuai SQL
  } = req.body;

  if (!username || !email || !password || !passwordConfirm || !nik || !tanggalLahir) {
    return res.status(400).json({
      message: 'Username, email, password, NIK, dan Tanggal Lahir wajib diisi',
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      message: 'Password tidak sama',
    });
  }

  try {
    // 1. SignUp ke Supabase Auth (untuk autentikasi)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          nik,
        },
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      // 2. Simpan info tambahan ke tabel public.users (sesuai SQL Anda)
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          nik,
          username,
          password: password,
          alamatLengkap,
          kecamatan,
          kelurahan,
          tanggalLahir,
          role: 'user',
        },
      ]);

      if (profileError) throw profileError;
    }

    return res.status(201).json({
      message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
      data: {
        id: authData.user?.id,
        email: authData.user?.email,
        username,
      },
    });
  } catch (error: any) {
    console.error('Error saat registrasi:', error);
    return res.status(500).json({
      message: 'Gagal melakukan registrasi',
      error: error.message,
    });
  }
};
