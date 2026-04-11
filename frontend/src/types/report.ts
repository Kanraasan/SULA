// Interface untuk data mentah yang datang dari Backend (API) sesuai SQL Supabase
export interface IReport {
  id: string;
  user_id: string;
  username: string;
  complaint_title: string;
  complaint_category: string;
  complaint_description: string;
  complaint_image: string | null;
  status: "menunggu" | "diproses" | "selesai" | "ditolak";
  upvotes: number;
  created_at: string;
  updated_at?: string;
}

// Interface untuk data yang sudah ditransformasi agar siap tampil di UI
export interface IReportUI {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  time: string;
  createdAt: Date;
  author: string;
  votes: number;
  imageUrl: string;
}
