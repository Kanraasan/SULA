type Laporan = {
  id: string;
  date: string;
  reporter: {
    initials: string;
    name: string;
  };
  complaint: {
    title: string;
    category: string;
    description: string;
  };
  status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak';
  upvotes: number;
};

export const dataLaporan: Laporan[] = [
  {
    id: '1',
    date: 'Oct 12, 2023',
    reporter: { initials: 'BS', name: 'Budi Santoso' },
    complaint: {
      title: 'Pothole on Jalan Merdeka',
      category: 'infrastruktur',
      description: 'Near the intersection, causing traffic...',
    },
    status: 'menunggu',
    upvotes: 12,
  },
  {
    id: '2',
    date: 'Oct 11, 2023',
    reporter: { initials: 'SA', name: 'Siti Aminah' },
    complaint: {
      title: 'Broken Streetlight',
      category: 'penerangan',
      description: 'Lamp post #45 is flickering and completely o...',
    },
    status: 'diproses',
    upvotes: 8,
  },
  {
    id: '3',
    date: 'Oct 10, 2023',
    reporter: { initials: 'AW', name: 'Agus Wijaya' },
    complaint: {
      title: 'Clogged Drain',
      category: 'kebersihan',
      description: 'Water backing up during heavy rain in RT 03.',
    },
    status: 'selesai',
    upvotes: 5,
  },
  {
    id: '4',
    date: 'Oct 09, 2023',
    reporter: { initials: 'RM', name: 'Rina Marlina' },
    complaint: {
      title: 'Fallen Tree Branches',
      category: 'bencana',
      description: 'Blocking the pathway near the community...',
    },
    status: 'diproses',
    upvotes: 15,
  },
  {
    id: '5',
    date: 'Oct 08, 2023',
    reporter: { initials: 'JA', name: 'Joko Anwar' },
    complaint: {
      title: 'Trash not collected',
      category: 'kebersihan',
      description: 'Garbage bins overflowing for 3 days in RT 05.',
    },
    status: 'menunggu',
    upvotes: 3,
  },
  {
    id: '6',
    date: 'Oct 07, 2023',
    reporter: { initials: 'HR', name: 'Heri Ramadhan' },
    complaint: {
      title: 'Wild Dogs',
      category: 'ketertiban',
      description: 'Pack of wild dogs roaming near school area.',
    },
    status: 'menunggu',
    upvotes: 20,
  },
  {
    id: '7',
    date: 'Oct 06, 2023',
    reporter: { initials: 'LN', name: 'Lina Nur' },
    complaint: {
      title: 'Burst Pipe',
      category: 'infrastruktur',
      description: 'Water pipe burst on Jl. Slamet Riyadi.',
    },
    status: 'selesai',
    upvotes: 45,
  },
  {
    id: '8',
    date: 'Oct 05, 2023',
    reporter: { initials: 'DP', name: 'Dedi Putra' },
    complaint: {
      title: 'Illegal Parking',
      category: 'ketertiban',
      description: 'Cars blocking the narrow alleyway.',
    },
    status: 'diproses',
    upvotes: 2,
  },
  {
    id: '9',
    date: 'Oct 04, 2023',
    reporter: { initials: 'MT', name: 'Mita Tiara' },
    complaint: {
      title: 'Graffiti',
      category: 'ketertiban',
      description: 'New graffiti on the community park wall.',
    },
    status: 'menunggu',
    upvotes: 7,
  },
  {
    id: '10',
    date: 'Oct 03, 2023',
    reporter: { initials: 'BK', name: 'Bambang K.' },
    complaint: {
      title: 'Broken Swing',
      category: 'fasilitas_publik',
      description: 'Swing at playground is unsafe for kids.',
    },
    status: 'selesai',
    upvotes: 11,
  },
  {
    id: '11',
    date: 'Oct 02, 2023',
    reporter: { initials: 'FS', name: 'Farah S.' },
    complaint: {
      title: 'Noisy Construction',
      category: 'ketertiban',
      description: 'Building work past 10 PM in residential area.',
    },
    status: 'diproses',
    upvotes: 9,
  },
  {
    id: '12',
    date: 'Oct 01, 2023',
    reporter: { initials: 'GG', name: 'Gilang G.' },
    complaint: {
      title: 'Stray Cat Colony',
      category: 'kebersihan',
      description: 'Too many strays causing hygiene issues.',
    },
    status: 'menunggu',
    upvotes: 3,
  },
  {
    id: '13',
    date: 'Sep 30, 2023',
    reporter: { initials: 'AA', name: 'Andi A.' },
    complaint: {
      title: 'Broken Manhole',
      category: 'infrastruktur',
      description: 'Manhole cover is missing, dangerous for bikes.',
    },
    status: 'diproses',
    upvotes: 33,
  },
  {
    id: '14',
    date: 'Sep 29, 2023',
    reporter: { initials: 'RR', name: 'Ria R.' },
    complaint: {
      title: 'Illegal Trash Dumping',
      category: 'kebersihan',
      description: 'Someone dumping bags near the river.',
    },
    status: 'menunggu',
    upvotes: 18,
  },
  {
    id: '15',
    date: 'Sep 28, 2023',
    reporter: { initials: 'IK', name: 'Iwan K.' },
    complaint: {
      title: 'Smelly Drain',
      category: 'kebersihan',
      description: 'Sewer smell is very strong today.',
    },
    status: 'selesai',
    upvotes: 22,
  },
  {
    id: '16',
    date: 'Sep 27, 2023',
    reporter: { initials: 'TY', name: 'Tedy Y.' },
    complaint: {
      title: 'Flickering Sign',
      category: 'penerangan',
      description: 'Public information board is broken.',
    },
    status: 'menunggu',
    upvotes: 1,
  },
  {
    id: '17',
    date: 'Sep 26, 2023',
    reporter: { initials: 'SP', name: 'Sari P.' },
    complaint: {
      title: 'Tree Ripping Wires',
      category: 'bencana',
      description: 'Branches tangled in internet cables.',
    },
    status: 'diproses',
    upvotes: 14,
  },
  {
    id: '18',
    date: 'Sep 25, 2023',
    reporter: { initials: 'JM', name: 'Joni M.' },
    complaint: {
      title: 'Dusty Road',
      category: 'infrastruktur',
      description: 'Trucks leaving too much mud/dust on road.',
    },
    status: 'menunggu',
    upvotes: 5,
  },
  {
    id: '19',
    date: 'Sep 24, 2023',
    reporter: { initials: 'NA', name: 'Nina A.' },
    complaint: {
      title: 'Blocked Sidewalk',
      category: 'infrastruktur',
      description: 'Vendor blocking access for wheelchairs.',
    },
    status: 'selesai',
    upvotes: 27,
  },
  {
    id: '20',
    date: 'Sep 23, 2023',
    reporter: { initials: 'WW', name: 'Wawan W.' },
    complaint: {
      title: 'Crashed Barrier',
      category: 'infrastruktur',
      description: 'Road barrier broken after minor accident.',
    },
    status: 'menunggu',
    upvotes: 4,
  },
  {
    id: '21',
    date: 'Sep 22, 2023',
    reporter: { initials: 'DS', name: 'Dina S.' },
    complaint: {
      title: 'Mosquito Breeding',
      category: 'kebersihan',
      description: 'Standing water in vacant lot.',
    },
    status: 'diproses',
    upvotes: 19,
  },
  {
    id: '22',
    date: 'Sep 21, 2023',
    reporter: { initials: 'BN', name: 'Beno N.' },
    complaint: {
      title: 'Loud Party',
      category: 'ketertiban',
      description: 'Neighbor playing loud music nightly.',
    },
    status: 'menunggu',
    upvotes: 6,
  },
  {
    id: '23',
    date: 'Sep 20, 2023',
    reporter: { initials: 'CC', name: 'Cici C.' },
    complaint: {
      title: 'Damaged Park Bench',
      category: 'fasilitas_publik',
      description: 'Seat is broken at the central park.',
    },
    status: 'selesai',
    upvotes: 13,
  },
  {
    id: '24',
    date: 'Sep 19, 2023',
    reporter: { initials: 'HH', name: 'Hadi H.' },
    complaint: {
      title: 'Broken ATM Lights',
      category: 'penerangan',
      description: 'Area around ATM is too dark at night.',
    },
    status: 'menunggu',
    upvotes: 2,
  },
  {
    id: '25',
    date: 'Sep 18, 2023',
    reporter: { initials: 'MM', name: 'Maya M.' },
    complaint: {
      title: 'Uneven Pavement',
      category: 'infrastruktur',
      description: 'People tripping near the market entrance.',
    },
    status: 'diproses',
    upvotes: 31,
  },
];
