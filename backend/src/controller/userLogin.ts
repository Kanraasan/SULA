import { compareSync } from 'bcryptjs';
import regist from '../regist';

export const loginUser = (req: any, res: any) => {
  if (!req.body) {
    return res
      .status(400)
      .json({
        message:
          'Request body tidak ditemukan. Pastikan Content-Type: application/json',
      });
  }

  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: 'Username/NIK dan password wajib diisi' });
  }

  const user = regist.find(
    (u) => u.username === identifier || u.NIK === identifier,
  );

  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  const isMatch = compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Password salah' });
  }

  return res.status(200).json({
    message: 'Login berhasil',
    data: { NIK: user.NIK, username: user.username },
  });
};
