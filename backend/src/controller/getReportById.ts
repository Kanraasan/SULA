import { supabase } from '../lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_sula_123';

export const getReportById = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    let user: any = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (e) {}
    }

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    if (report.privasi === 'confidential') {
      const isOwner = user && user.id === report.user_id;
      const isAdmin = user && user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Akses ditolak: Laporan ini bersifat rahasia' });
      }
    }

    if (report.privasi === 'anonymous') {
      const isAdmin = user && user.role === 'admin';
      if (!isAdmin) {
        report.username = 'Anonim';
      }
    }

    res.status(200).json({
      message: 'Berhasil mengambil detail laporan',
      data: report,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
