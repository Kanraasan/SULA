import { supabase } from '../lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_sula_123';

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // 1. SignIn dengan email dan password di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      return res.status(401).json({ message: 'Login gagal' });
    }

    // 2. Ambil data profil dari tabel 'users' (sesuai SQL)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.warn('Profil user tidak ditemukan di tabel users:', profileError);
    }

    // 3. Buat JWT token untuk aplikasi
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
        token: token,
        supabase_token: authData.session?.access_token
      },
    });
  } catch (error: any) {
    console.error('Error saat login:', error);
    return res.status(401).json({
      message: 'Email atau password salah',
      error: error.message,
    });
  }
};
