import { hashSync } from 'bcryptjs';

const userData: Array<any> = [
  {
    nik: "1234567890",
    username: "admin",
    email: "admin@gmail.com",
    password: hashSync("admin123", 10),
    alamatLengkap: "Surakarta",
    kecamatan: "Laweyan",
    kelurahan: "Laweyan",
    role: "admin",
  }
];

export default userData;
