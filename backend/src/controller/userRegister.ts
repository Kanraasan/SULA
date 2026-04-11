import { supabase } from '../lib/supabase';
import { z } from 'zod';

const registerSchema = z.object({
  nik: z.string().length(16, "NIK harus tepat 16 digit angka").regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  passwordConfirm: z.string(),
  alamatLengkap: z.string().optional(),
  kecamatan: z.string().optional(),
  kelurahan: z.string().optional(),
  tanggalLahir: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Password dan Konfirmasi Password tidak sama",
  path: ["passwordConfirm"],
});

export const createUser = async (req: any, res: any) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Request body tidak ditemukan. Pastikan Content-Type: application/json',
    });
  }

  const parseResult = registerSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.issues?.[0]?.message || 'Validasi gagal',
    });
  }

  const {
    nik,
    username,
    email,
    password,
    alamatLengkap,
    kecamatan,
    kelurahan,
    tanggalLahir,
  } = parseResult.data;

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
