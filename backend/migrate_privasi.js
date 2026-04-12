const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.vlbvhnsnozdpxfaiwfre:IAleq6qkMChX71Gp@aws-1-ap-south-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });

client.connect()
  .then(() => client.query("ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS privasi character varying DEFAULT 'public'"))
  .then(res => { console.log('success:', res); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
