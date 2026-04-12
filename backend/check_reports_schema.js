process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ 
  connectionString: process.env.DATABASE_URL
});

c.connect()
  .then(() => c.query(`
    SELECT column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_name='reports' AND table_schema='public' 
    ORDER BY ordinal_position
  `))
  .then(r => {
    console.log('Reports table columns:');
    r.rows.forEach(row => 
      console.log(`  ${row.column_name}: ${row.data_type} | nullable: ${row.is_nullable} | default: ${row.column_default}`)
    );
    c.end();
  })
  .catch(e => { console.error(e); c.end(); });
