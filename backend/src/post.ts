const post: Array<any> = [
  {
    id: 'dummy-post-001',
    judul: 'Jalan berlubang di depan pasar',
    kategori: 'infrastruktur',
    deskripsi: 'Jalan berlubang cukup besar di depan pasar tradisional. Sangat berbahaya untuk pengendara motor.',
    lampiranFoto: null,
    userNIK: '3310012345678901',
    username: 'testuser',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam lalu
  },
  {
    id: 'dummy-post-002',
    judul: 'Lampu jalan mati di Jl. Slamet Riyadi',
    kategori: 'penerangan',
    deskripsi: '5 lampu PJU mati total sepanjang 200 meter. Sangat gelap di malam hari.',
    lampiranFoto: null,
    userNIK: '3310012345678902',
    username: 'warga_solo',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 jam lalu
  },
  {
    id: 'dummy-post-003',
    judul: 'Sampah menumpuk di TPS Mojosongo',
    kategori: 'kebersihan',
    deskripsi: 'Sampah sudah menumpuk tinggi dan berbau. Belum diangkut selama 3 hari.',
    lampiranFoto: null,
    userNIK: '3310012345678903',
    username: 'budi_santoso',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 hari lalu
  },
];
export default post;
