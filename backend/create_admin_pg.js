const postgres = require('postgres');
require('dotenv').config();
const sql = postgres(process.env.DATABASE_URL);

async function main() {
  try {
    const email = 'admin@sula.com';
    const password = 'Password123!';
    const username = 'admin_sula';
    const nik = '1234567890123456';
    
    // Asumsikan id admin diambil dari auth.users yang sukses saya create tadi
    // Let's get the id from auth.users via supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      await sql`
        INSERT INTO users (id, nik, username, password, role, "alamatLengkap", kecamatan, kelurahan, "tanggalLahir")
        VALUES (${user.id}, ${nik}, ${username}, ${password}, 'admin', 'Jl. Admin', 'Banjarsari', 'Manahan', '1990-01-01')
        ON CONFLICT (id) DO UPDATE SET role = 'admin', username = ${username}, password = ${password}
      `;
      console.log('Admin user inserted via direct Postgres successfully!');
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

main();
