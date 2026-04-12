const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Client 1: simulate backend
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);

async function test() {
  // 1. signInWithPassword
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@sula.com',
    password: 'Password123!',
  });
  console.log('Login:', authData?.user?.id, authError);

  // 2. Query users as the logged-in client
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  console.log('Profile Role:', profile?.role, 'Error:', profileError);
}
test();
