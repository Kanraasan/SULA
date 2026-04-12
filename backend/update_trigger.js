process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

c.connect()
  .then(() => c.query(`
    CREATE OR REPLACE FUNCTION public.set_report_username()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    DECLARE 
      db_user_username character varying;
    BEGIN
        SELECT username INTO db_user_username
        FROM public.users
        WHERE id = NEW.user_id;
        
        IF db_user_username IS NOT NULL THEN
            NEW.username = db_user_username;
        END IF;
        
        -- jika tidak ada di db tapi di payload ada, biarkan saja data aslinya (NEW.username)
        RETURN NEW;
    END;
    $function$;
  `))
  .then(r => {
    console.log('Function set_report_username updated successfully!');
    c.end();
  })
  .catch(e => { console.error('Error updating function:', e); c.end(); });
