import { supabase } from '../lib/supabase';

export const getLeaderboard = async (req: any, res: any) => {
  try {
    // 1. Fetch reports with joined user info from Supabase
    const { data: reports, error } = await supabase
      .from('reports')
      .select(`
        user_id,
        username,
        status,
        users (
          username,
          kecamatan
        )
      `);

    if (error) throw error;

    // 2. Aggregate reports by user_id or username
    const userStats: Record<string, any> = {};

    reports?.forEach((report: any) => {
      const key = report.user_id || report.username;
      if (!userStats[key]) {
        // Fallback to report.username if user join returns null
        const userData: any = report.users;
        userStats[key] = {
          username: userData?.username || report.username,
          totalReports: 0,
          validReports: 0,
          district: userData?.kecamatan || 'N/A',
        };
      }

      userStats[key].totalReports += 1;
      
      // Normalize status to lowercase for comparison
      const normStatus = report.status?.toLowerCase();
      if (normStatus === 'selesai' || normStatus === 'diverifikasi') {
        userStats[key].validReports += 1;
      }
    });

    // 3. Format into the leaderboard structure
    const leaderboard = Object.values(userStats).map((stats: any) => ({
      username: stats.username,
      totalReports: stats.totalReports,
      validReports: stats.validReports,
      name: stats.username,
      district: stats.district,
      image: 'https://placehold.co/80x80', // Placeholder as in original
    }));

    // 4. Sort by valid reports descending
    leaderboard.sort((a: any, b: any) => b.validReports - a.validReports);

    // 5. Assign ranks
    const rankedLeaderboard = leaderboard.map((item: any, index: number) => ({
      ...item,
      rank: index + 1,
    }));

    res.status(200).json({
      message: 'Berhasil mengambil data leaderboard',
      data: rankedLeaderboard,
    });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      message: 'Gagal mengambil data leaderboard',
      error: error.message,
    });
  }
};
