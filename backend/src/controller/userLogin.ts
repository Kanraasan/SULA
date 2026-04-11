import { supabase } from '../lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_sula_123';

import { z } from 'zod';

const loginSchema = z.object({
  identifier: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, "Password wajib diisi")
}).refine(data => data.identifier || data.email, {
  message: "Email atau Username wajib diisi",
  path: ["identifier"]
});

export const loginUser = async (req: any, res: any) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error.issues?.[0]?.message || 'Validasi gagal' });
  }

  const { identifier, email: legacyEmail, password } = parseResult.data;
  const loginAlias = identifier || legacyEmail;

  if (!loginAlias) return res.status(400).json({ message: "Email atau Username wajib diisi" });

  try {
    let emailToLogin = loginAlias;

    // Jika bukan email (tidak mengandung '@'), kita anggap itu username
    if (!loginAlias.includes('@')) {
      // 1. Cari user di tabel public.users berdasarkan username
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', loginAlias)
        .single();

      if (userError || !userRecord) {
        return res.status(401).json({ message: 'Email atau username tidak ditemukan' });
      }

      // 2. Ambil email dari auth.users via Supabase Admin API
      const { data: authAdminData, error: authAdminError } = await supabase.auth.admin.getUserById(userRecord.id);
      if (authAdminError || !authAdminData.user) {
        return res.status(401).json({ message: 'Gagal memverifikasi pengguna auth' });
      }

      emailToLogin = authAdminData.user.email || '';
    }

    // 3. SignIn dengan email dan password menggunakan client auth isolated agar tidak mencemari global supabase client
    const { createClient } = require('@supabase/supabase-js');
    const authClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: emailToLogin!,
      password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      return res.status(401).json({ message: 'Login gagal' });
    }

    // 4. Ambil data profil dari tabel 'users' (sesuai SQL) menggunakan global supabase client yang masih bersih (service_role bypass RLS)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.warn('Profil user tidak ditemukan di tabel users:', profileError);
    }

    // 5. Buat JWT token untuk aplikasi
    const token = jwt.sign(
      { 
        id: authData.user.id,
        email: authData.user.email,
        nik: profile?.nik, 
        username: profile?.username, 
        role: profile?.role || 'user' 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login berhasil!',
      data: { 
        id: authData.user.id,
        nik: profile?.nik, 
        username: profile?.username, 
        role: profile?.role || 'user',
        noWa: profile?.no_wa,
        alamatLengkap: profile?.alamatLengkap,
        kecamatan: profile?.kecamatan,
        kelurahan: profile?.kelurahan,
        token: token,
        supabase_token: authData.session?.access_token
      },
    });
  } catch (error: any) {
    console.error('Error saat login:', error);
    return res.status(401).json({
      message: 'Email/Username atau password salah',
      error: error.message,
    });
  }
};
