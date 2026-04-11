process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

c.connect()
  .then(() => c.query(`
    INSERT INTO public.users (id, username, role, nik, no_telp, address, name)
    VALUES (
      'ee7db8bc-628c-4342-a8f4-961ebc3d2b77', 
      'kanraLama', 
      'user', 
      '1234567890123456', 
      '0812345678', 
      'Alamat Dummy', 
      'Kanra'
    )
    ON CONFLICT (id) DO UPDATE SET 
      username = EXCLUDED.username, 
      nik = EXCLUDED.nik;
  `))
  .then(r => {
    console.log('Fixed broken database user ee7db8bc successfully!');
    c.end();
  })
  .catch(e => { console.error('Error insert:', e.message); c.end(); });
