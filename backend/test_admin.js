const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10 });
  console.log(data, error);
}
test();
