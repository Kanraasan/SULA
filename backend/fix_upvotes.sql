-- Menambahkan kolom array upvoted_by untuk melacak siapa saja yang sudah upvote
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS upvoted_by text[] DEFAULT '{}';
