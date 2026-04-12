-- Menambahkan kolom privasi untuk mengaktifkan fitur Anonim & Rahasia
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS privasi character varying DEFAULT 'public';
