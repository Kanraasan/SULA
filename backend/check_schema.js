const p = require('postgres');
require('dotenv').config();
const sql = p(process.env.DATABASE_URL);
sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'reports'`
  .then(r => { console.log(r); process.exit(0); });
