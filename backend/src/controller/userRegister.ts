import { hashSync } from 'bcryptjs';
import regist from '../regist';

export const createUser = (req: any, res: any) => {
  if (!req.body) {
    return res.status(400).json({
      message:
        'Request body tidak ditemukan. Pastikan Content-Type: application/json',
    });
  }

  const {
    NIK = 'untitled',
    username,
    password,
    passwordConfirm,
    alamatLengkap,
    kecamatan,
    kelurahan,
  } = req.body;

  if (!username || !password || !passwordConfirm) {
    return res.status(400).json({
      message: 'Username dan password wajib diisi',
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      message: 'Password tidak sama',
    });
  }

  const hashedPassword = hashSync(password, 10);
  const newRegist = {
    NIK,
    username,
    password: hashedPassword,
    alamatLengkap,
    kecamatan,
    kelurahan,
  };

  regist.push(newRegist);

  return res.status(201).json({
    message: 'Registrasi berhasil',
    data: newRegist,
  });
};
