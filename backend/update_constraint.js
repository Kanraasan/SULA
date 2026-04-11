process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

c.connect()
  .then(() => c.query(`
    -- Hapus constraint yang lama
    ALTER TABLE public.reports 
    DROP CONSTRAINT IF EXISTS reports_complaint_category_check;
    
    -- Tambahkan constraint baru yang sesuai dengan frontend
    ALTER TABLE public.reports 
    ADD CONSTRAINT reports_complaint_category_check 
    CHECK (
      complaint_category IN (
        'infrastruktur', 
        'penerangan', 
        'kebersihan', 
        'fasilitas', 
        'lingkungan',
        'kesehatan',
        'pendidikan',
        'keamanan',
        'transportasi',
        'lainnya'
      )
    );
  `))
  .then(r => {
    console.log('Successfully updated complaint_category check constraint!');
    c.end();
  })
  .catch(e => { console.error('Error changing constraint:', e); c.end(); });
