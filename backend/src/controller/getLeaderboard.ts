import reportData from '../mock/reportData';
import userData from '../mock/userData';

export const getLeaderboard = (req: any, res: any) => {
  // Aggregate reports by username
  const userStats = reportData.reduce((acc: any, report: any) => {
    const { username, status } = report;
    if (!acc[username]) {
      acc[username] = {
        username,
        totalReports: 0,
        validReports: 0,
      };
    }
    acc[username].totalReports += 1;
    if (status === 'Selesai' || status === 'Diverifikasi') {
      acc[username].validReports += 1;
    }
    return acc;
  }, {});

  // Merge with user profile info
  const leaderboard = Object.values(userStats).map((stats: any) => {
    const user = userData.find((u: any) => u.username === stats.username);
    return {
      ...stats,
      name: user ? user.username : stats.username,
      district: user ? user.kecamatan : 'N/A',
      image: 'https://placehold.co/80x80', // Placeholder
    };
  });

  // Sort by valid reports descending
  leaderboard.sort((a: any, b: any) => b.validReports - a.validReports);

  // Assign ranks
  const rankedLeaderboard = leaderboard.map((item: any, index: number) => ({
    ...item,
    rank: index + 1,
  }));

  res.status(200).json({
    message: 'Berhasil mengambil data leaderboard',
    data: rankedLeaderboard,
  });
};
