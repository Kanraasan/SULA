import { hashSync } from 'bcryptjs';

const regist: Array<any> = [
  {
    NIK: 3310012345678901,
    username: 'testuser',
    password: hashSync('password123', 10),
    alamatLengkap: 'Jl. Test No. 123',
    kecamatan: 'Laweyan',
    kelurahan: 'Bumi',
  },
];

export default regist;
