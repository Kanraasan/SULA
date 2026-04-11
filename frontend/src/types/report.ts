// Interface untuk data mentah yang datang dari Backend (API)
export interface IReport {
  id: string;
  title: string;
  category: string;
  description: string;
  lampiranFoto: string | null;
  userNik?: string;
  username?: string;
  createdAt: string;
  updatedAt?: string;
}

// Interface untuk data yang sudah ditransformasi agar siap tampil di UI
export interface IReportUI {
  id: string;
  title: string;
  category: string;
  status: "Menunggu" | "Diproses" | "Selesai";
  time: string;
  createdAt: Date;
  author: string;
  votes: number;
  imageUrl: string;
}
