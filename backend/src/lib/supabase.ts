import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL or SUPABASE_KEY/SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY is missing from .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
