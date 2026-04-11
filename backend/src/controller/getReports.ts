import { supabase } from '../lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_sula_123';

export const getReports = async (req: any, res: any) => {
  try {
    let user: any = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (e) {}
    }

    // Pagination: default limit 100, offset 0
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const offset = parseInt(req.query.offset) || 0;

    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!user || user.role !== 'admin') {
      if (user && user.id) {
         query = query.or(`privasi.neq.confidential,user_id.eq.${user.id}`);
      } else {
         query = query.neq('privasi', 'confidential');
      }
    }

    const { data: rawData, error, count } = await query;

    if (error) throw error;

    const data = rawData.map((report: any) => {
       if (report.privasi === 'anonymous' && (!user || user.role !== 'admin')) {
           return { ...report, username: 'Anonim' };
       }
       return report;
    });

    res.status(200).json({
      message: 'Berhasil mengambil data laporan',
      data: data,
      pagination: {
        total: count,
        limit,
        offset,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Gagal mengambil data laporan',
      error: error.message,
    });
  }
};
