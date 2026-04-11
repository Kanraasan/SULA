import { hashSync } from 'bcryptjs';
import userData from '../mock/userData';

export const createUser = (req: any, res: any) => {
  if (!req.body) {
    return res.status(400).json({
      message:
        'Request body tidak ditemukan. Pastikan Content-Type: application/json',
    });
  }

  interface RegisterUser {
    nik: string;
    username: string;
    password: string;
    passwordConfirm: string;
    alamatLengkap: string;
    kecamatan: string;
    kelurahan: string;
  }

  const {
    nik,
    username,
    password,
    passwordConfirm,
    alamatLengkap,
    kecamatan,
    kelurahan,
  } = req.body as RegisterUser;

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
  const newUserData = {
    nik,
    username,
    password: hashedPassword,
    alamatLengkap,
    kecamatan,
    kelurahan,
    role: "user",
  };

  userData.push(newUserData);

  return res.status(201).json({
    message: 'Registrasi berhasil',
    data: newUserData,
  });
};
