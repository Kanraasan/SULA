-- Menambahkan kolom latitude dan longitude untuk fitur Peta Interaktif
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS latitude double precision;

ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS longitude double precision;

-- Menambahkan kolom catatan_admin untuk fitur Timbal Balik Admin
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS catatan_admin text;
