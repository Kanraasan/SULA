export type Kecamatan = {
  id: number
  name: string
}

export type Kelurahan = {
  id: number
  name: string
  kecamatan: string
}

export const KECAMATAN_LIST: Kecamatan[] = [
  { id: 1, name: "Banjarsari" },
  { id: 2, name: "Jebres" },
  { id: 3, name: "Laweyan" },
  { id: 4, name: "Pasar Kliwon" },
  { id: 5, name: "Serengan" },
]

export const KELURAHAN_LIST: Kelurahan[] = [
  // Kecamatan Banjarsari
  { id: 1, name: "Banjarsari", kecamatan: "Banjarsari" },
  { id: 2, name: "Gilingan", kecamatan: "Banjarsari" },
  { id: 3, name: "Kadipiro", kecamatan: "Banjarsari" },
  { id: 4, name: "Keprabon", kecamatan: "Banjarsari" },
  { id: 5, name: "Kestalan", kecamatan: "Banjarsari" },
  { id: 6, name: "Ketelan", kecamatan: "Banjarsari" },
  { id: 7, name: "Manahan", kecamatan: "Banjarsari" },
  { id: 8, name: "Mangkubumen", kecamatan: "Banjarsari" },
  { id: 9, name: "Nusukan", kecamatan: "Banjarsari" },
  { id: 10, name: "Punggawan", kecamatan: "Banjarsari" },
  { id: 11, name: "Setabelan", kecamatan: "Banjarsari" },
  { id: 12, name: "Sumber", kecamatan: "Banjarsari" },
  { id: 13, name: "Timuran", kecamatan: "Banjarsari" },
  { id: 14, name: "Joglo", kecamatan: "Banjarsari" },
  { id: 15, name: "Banyuanyar", kecamatan: "Banjarsari" },

  // Kecamatan Jebres
  { id: 16, name: "Gandekan", kecamatan: "Jebres" },
  { id: 17, name: "Jagalan", kecamatan: "Jebres" },
  { id: 18, name: "Jebres", kecamatan: "Jebres" },
  { id: 19, name: "Kepatihan Kulon", kecamatan: "Jebres" },
  { id: 20, name: "Kepatihan Wetan", kecamatan: "Jebres" },
  { id: 21, name: "Mojosongo", kecamatan: "Jebres" },
  { id: 22, name: "Pucangsawit", kecamatan: "Jebres" },
  { id: 23, name: "Purwodiningratan", kecamatan: "Jebres" },
  { id: 24, name: "Sudiroprajan", kecamatan: "Jebres" },
  { id: 25, name: "Tegalharjo", kecamatan: "Jebres" },
  { id: 26, name: "Sewu", kecamatan: "Jebres" },

  // Kecamatan Laweyan
  { id: 27, name: "Bumi", kecamatan: "Laweyan" },
  { id: 28, name: "Jajar", kecamatan: "Laweyan" },
  { id: 29, name: "Karangasem", kecamatan: "Laweyan" },
  { id: 30, name: "Kerten", kecamatan: "Laweyan" },
  { id: 31, name: "Laweyan", kecamatan: "Laweyan" },
  { id: 32, name: "Pajang", kecamatan: "Laweyan" },
  { id: 33, name: "Panularan", kecamatan: "Laweyan" },
  { id: 34, name: "Penumping", kecamatan: "Laweyan" },
  { id: 35, name: "Purwosari", kecamatan: "Laweyan" },
  { id: 36, name: "Sondakan", kecamatan: "Laweyan" },
  { id: 37, name: "Sriwedari", kecamatan: "Laweyan" },

  // Kecamatan Pasar Kliwon
  { id: 38, name: "Baluwarti", kecamatan: "Pasar Kliwon" },
  { id: 39, name: "Gajahan", kecamatan: "Pasar Kliwon" },
  { id: 40, name: "Joyosuran", kecamatan: "Pasar Kliwon" },
  { id: 41, name: "Kampung Baru", kecamatan: "Pasar Kliwon" },
  { id: 42, name: "Kauman", kecamatan: "Pasar Kliwon" },
  { id: 43, name: "Kedung Lumbu", kecamatan: "Pasar Kliwon" },
  { id: 44, name: "Mojo", kecamatan: "Pasar Kliwon" },
  { id: 45, name: "Pasar Kliwon", kecamatan: "Pasar Kliwon" },
  { id: 46, name: "Sangkrah", kecamatan: "Pasar Kliwon" },
  { id: 47, name: "Semanggi", kecamatan: "Pasar Kliwon" },

  // Kecamatan Serengan
  { id: 48, name: "Danukusuman", kecamatan: "Serengan" },
  { id: 49, name: "Jayengan", kecamatan: "Serengan" },
  { id: 50, name: "Joyotakan", kecamatan: "Serengan" },
  { id: 51, name: "Kemlayan", kecamatan: "Serengan" },
  { id: 52, name: "Kratonan", kecamatan: "Serengan" },
  { id: 53, name: "Serengan", kecamatan: "Serengan" },
  { id: 54, name: "Tipes", kecamatan: "Serengan" },
]
