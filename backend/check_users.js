process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

c.connect()
  .then(() => c.query(`
    select au.id as auth_id, au.email, pu.id as public_id, pu.username
    from auth.users au
    left join public.users pu on au.id = pu.id
    order by au.created_at desc
    limit 5;
  `))
  .then(r => {
    console.log('Recent Users (Auth vs Public):');
    console.table(r.rows);
    c.end();
  })
  .catch(e => { console.error('Error:', e); c.end(); });
