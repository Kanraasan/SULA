const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function main() {
  const email = 'admin@sula.com';
  const password = 'Password123!';
  const username = 'admin_sula';
  const nik = '1234567890123456';
  
  // 1. SignUp
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, nik }
    }
  });

  if (authError || !authData.user) {
    console.log('SignUp Auth Error:', authError);
    // Ignore Error if user exists and just fetch the user
  }

  // Cari user id
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);

  if (user) {
    // 2. Insert or update to public.users
    const { error: dbError } = await supabase.from('users').upsert({
      id: user.id,
      nik,
      username,
      password,
      alamatLengkap: 'Jl. Admin No 1, Surakarta',
      kecamatan: 'Banjarsari',
      kelurahan: 'Manahan',
      tanggalLahir: '1990-01-01',
      role: 'admin'
    });

    if (dbError) {
      console.log('DB Error:', dbError);
    } else {
      console.log('Berhasil membuat/update admin account!');
    }
  }
}

main();
