import { supabase } from '../lib/supabase';

export const upvoteReport = async (req: any, res: any) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('upvotes, upvoted_by')
      .eq('id', id)
      .single();

    if (fetchError || !report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    const upvotedBy = report.upvoted_by || [];
    const hasUpvoted = upvotedBy.includes(user.id);

    let newUpvotedBy;
    let newUpvotes;

    if (hasUpvoted) {
      newUpvotedBy = upvotedBy.filter((userId: string) => userId !== user.id);
      newUpvotes = Math.max((report.upvotes || 0) - 1, 0); // jangan sampai minus
    } else {
      newUpvotedBy = [...upvotedBy, user.id];
      newUpvotes = (report.upvotes || 0) + 1;
    }

    const { data, error: updateError } = await supabase
      .from('reports')
      .update({ 
        upvotes: newUpvotes,
        upvoted_by: newUpvotedBy
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      message: hasUpvoted ? 'Dukungan dibatalkan' : 'Berhasil mendukung laporan',
      data: { upvotes: data.upvotes, hasUpvoted: !hasUpvoted },
    });
  } catch (error: any) {
    console.error('Error upvoting report:', error);
    return res.status(500).json({
      message: 'Gagal mendukung laporan',
      error: error.message,
    });
  }
};
