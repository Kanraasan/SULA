import { compareSync } from 'bcryptjs';
import userData from '../mock/userData';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_sula_123';

export const loginUser = (req: any, res: any) => {
  const { identifier, password } = req.body;

  const user = userData.find(
    (u) => u.username === identifier || String(u.nik) === String(identifier),
  );

  if (!user) {
    return res.status(404).json({ message: 'user gak ketemu' });
  }

  const isMatch = compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'password-nya salah bos' });
  }

  // bikin token jwt-nya
  const token = jwt.sign(
    { nik: user.nik, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' } // token-nya awet cuma sehari
  );

  return res.status(200).json({
    message: 'login mantap!',
    data: { 
      nik: user.nik, 
      username: user.username, 
      role: user.role,
      token: token // kirim token ke frontend
    },
  });
};
