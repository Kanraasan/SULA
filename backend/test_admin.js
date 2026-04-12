const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);

async function test() {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10 });
  console.log(data, error);
}
test();
