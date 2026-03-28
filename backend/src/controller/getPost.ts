import post from '../post';

export const getPost = (req: any, res: any) => {
  return res.status(200).json({
    message: 'berhasil',
    data: post,
  });
};
