const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.vlbvhnsnozdpxfaiwfre:IAleq6qkMChX71Gp@aws-1-ap-south-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });

client.connect()
  .then(() => client.query("SELECT * FROM public.users"))
  .then(res => { 
    console.log(JSON.stringify(res.rows, null, 2)); 
    process.exit(0); 
  })
  .catch(e => { 
    console.error(e); 
    process.exit(1); 
  });
