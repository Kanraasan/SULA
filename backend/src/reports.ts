export const DUMMY_REPORTS = [
  {
    id: 1,
    title: 'Jalan berlubang parah depan di Pasar Gemblegan',
    category: 'Infrastruktur',
    status: 'Menunggu' as const,
    time: '2 jam yang lalu',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    author: 'Budi S.',
    votes: 24,
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Tumpukan sampah belum diambil di Belakang Terminal Tirtonadi',
    category: 'Kebersihan',
    status: 'Diproses' as const,
    time: 'Kemarin',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    author: 'Siti A.',
    votes: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1374&auto=format&fit=crop',
  },
  {
    id: 3,
    title: '5 Lampu PJU mati total di Jl. Veteran',
    category: 'Fasilitas',
    status: 'Selesai' as const,
    time: '3 hari yang lalu',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    author: 'Agus K.',
    votes: 42,
    imageUrl:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1470&auto=format&fit=crop',
  },
];
