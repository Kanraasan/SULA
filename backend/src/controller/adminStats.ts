import { supabase } from '../lib/supabase';

/**
 * GET /api/admin/stats
 * Mengembalikan ringkasan statistik laporan secara terpusat
 * Sehingga halaman Dashboard, Statistik, dll tidak perlu fetch semua data lalu hitung sendiri
 */
export const getAdminStats = async (req: any, res: any) => {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('id, complaint_title, complaint_category, complaint_description, status, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const allReports = reports || [];

    // Hitung per status
    const statusCounts = {
      total: allReports.length,
      menunggu: 0,
      diproses: 0,
      selesai: 0,
      ditolak: 0,
    };

    // Hitung per kategori
    const categoryCounts: Record<string, number> = {};

    // Hitung laporan hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayCount = 0;

    // Trend bulanan (6 bulan terakhir)
    const monthlyTrend: Record<string, number> = {};
    
    // Trend harian (90 hari terakhir) - untuk Dashboard
    const dailyTrend: Record<string, { baru: number; diproses: number; selesai: number }> = {};

    for (const report of allReports) {
      // Status
      const status = (report.status || 'menunggu').toLowerCase();
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts] += 1;
      } else {
        statusCounts.menunggu += 1;
      }

      // Kategori
      const category = (report.complaint_category || 'lainnya').toLowerCase();
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;

      // Hari ini
      const createdAt = new Date(report.created_at);
      const createdDay = new Date(createdAt);
      createdDay.setHours(0, 0, 0, 0);
      if (createdDay.getTime() === today.getTime()) {
        todayCount += 1;
      }

      // Validasi tanggal
      if (!Number.isNaN(createdAt.getTime())) {
        // Bulanan
        const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
        monthlyTrend[monthKey] = (monthlyTrend[monthKey] || 0) + 1;

        // Harian (tanggal YYYY-MM-DD)
        const dateKey = createdAt.toISOString().slice(0, 10);
        if (!dailyTrend[dateKey]) {
          dailyTrend[dateKey] = { baru: 0, diproses: 0, selesai: 0 };
        }
        if (status === 'diproses') {
          dailyTrend[dateKey].diproses += 1;
        } else if (status === 'selesai') {
          dailyTrend[dateKey].selesai += 1;
        } else {
          dailyTrend[dateKey].baru += 1;
        }
      }
    }

    // Format kategori
    const normalizedLabel: Record<string, string> = {
      infrastruktur: "Infrastruktur",
      kebersihan: "Kebersihan",
      penerangan: "Penerangan",
      ketertiban: "Ketertiban",
      fasilitas_publik: "Fasilitas",
      fasilitas: "Fasilitas",
      pelayanan: "Pelayanan",
      bencana: "Bencana",
      lingkungan: "Lingkungan",
    };

    const categoryData = Object.entries(categoryCounts)
      .map(([kategori, jumlah]) => ({
        kategori: normalizedLabel[kategori] || "Lainnya",
        jumlah
      }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 6);

    // Format trend bulanan (untuk StatisticsPage)
    const trendDataMonthly = Object.entries(monthlyTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, total]) => {
        const [year, month] = key.split('-');
        const date = new Date(Number(year), Number(month) - 1, 1);
        const bulan = new Intl.DateTimeFormat('id-ID', { month: 'short' })
          .format(date)
          .toUpperCase();
        return { bulan, total };
      });
      
    // Format trend harian (untuk DashboardPage)
    const trendDataDaily = Object.entries(dailyTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, ...value }))
      .slice(-90);

    // Dapatkan beberapa laporan terbaru untuk preview
    const statusMap: Record<string, string> = {
      selesai: 'SELESAI',
      diproses: 'DIPROSES',
      ditolak: 'DITOLAK',
      menunggu: 'MENUNGGU',
    };

    const latestReports = allReports.slice(0, 8).map(post => ({
      id: `#${(post.id || '').toString().slice(0, 8).toUpperCase()}`,
      kategori: post.complaint_category,
      ket: post.complaint_title,
      status: statusMap[(post.status || 'menunggu').toLowerCase()] || 'MENUNGGU',
      tgl: new Date(post.created_at).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));

    return res.status(200).json({
      message: 'Berhasil mengambil statistik admin',
      data: {
        summary: statusCounts,
        todayCount,
        categoryData,
        trendDataMonthly,
        trendDataDaily,
        latestReports,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal mengambil statistik',
      error: error.message,
    });
  }
};
