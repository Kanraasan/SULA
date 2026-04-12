process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

c.connect()
  .then(() => c.query(`
    SELECT * FROM public.users WHERE id = 'd8c83e8b-1cb8-4e89-9856-4bba30a4be35';
  `))
  .then(r => {
    console.log('User data:');
    console.log(r.rows);
    c.end();
  })
  .catch(e => { console.error(e); c.end(); });
