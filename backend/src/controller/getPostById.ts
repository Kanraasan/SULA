import post from '../post';

export const getPostById = (req: any, res: any) => {
  const { id } = req.params;
  const posts = post.find((n) => n.id === id);

  if (posts) {
    return res.json({
      message: 'Postingan ditemukan',
      data: { posts },
    });
  }

  return res.status(404).json({
    message: 'Postingan tidak ditemukan',
  });
};
