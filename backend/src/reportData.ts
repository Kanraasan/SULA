const reportData: Array<any> = [
  {
    id: 'dummy-report-001',
    title: 'Jalan berlubang di depan pasar',
    category: 'infrastruktur',
    description: 'Jalan berlubang cukup besar di depan pasar tradisional. Sangat berbahaya untuk pengendara motor.',
    lampiranFoto: null,
    userNik: '3310012345678901',
    username: 'testuser',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam yang lalu
  },
  {
    id: 'dummy-report-002',
    title: 'Lampu jalan mati di Jl. Slamet Riyadi',
    category: 'penerangan',
    description: '5 lampu PJU mati total sepanjang 200 meter. Sangat gelap di malam hari.',
    lampiranFoto: null,
    userNik: '3310012345678902',
    username: 'warga_solo',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 jam yang lalu
  },
  {
    id: 'dummy-report-003',
    title: 'Sampah menumpuk di TPS Mojosongo',
    category: 'kebersihan',
    description: 'Sampah sudah menumpuk tinggi dan berbau. Belum diangkut selama 3 hari.',
    lampiranFoto: null,
    userNik: '3310012345678903',
    username: 'budi_santoso',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 hari yang lalu
  },
];
export default reportData;
