process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

c.connect()
  .then(() => c.query(`
    SELECT pg_get_constraintdef(c.oid) AS constraint_def
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE c.conname = 'reports_complaint_category_check' AND n.nspname = 'public';
  `))
  .then(r => {
    console.log('Constraint Definition:');
    console.table(r.rows);
    c.end();
  })
  .catch(e => { console.error('Error:', e); c.end(); });
