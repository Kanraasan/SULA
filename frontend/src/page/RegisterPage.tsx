import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useNavigate } from "react-router-dom"
import { useApi } from "@/hooks/useApi"
import { authService } from "@/services/auth.service"

type Kecamatan = {
  id: number
  name: string
}

type Kelurahan = {
  id: number
  name: string
  kecamatan: string
}

const kecamatan: Kecamatan[] = [
  { id: 1, name: "Banjarsari" },
  { id: 2, name: "Jebres" },
  { id: 3, name: "Laweyan" },
  { id: 4, name: "Pasar Kliwon" },
  { id: 5, name: "Serengan" },
]

const kelurahan: Kelurahan[] = [
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

export default function RegisterPage() {
  const navigate = useNavigate()
  const { execute, loading: isSubmitting, error: apiError } = useApi()

  const [nik, setNik] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [tanggalLahir, setTanggalLahir] = useState("")
  const [alamatLengkap, setAlamatLengkap] = useState("")
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null)
  const [selectedKelurahan, setSelectedKelurahan] = useState<Kelurahan | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredKelurahan = useMemo(() => {
    if (!selectedKecamatan) return []
    return kelurahan.filter((item) => item.kecamatan === selectedKecamatan.name)
  }, [selectedKecamatan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!nik.trim()) newErrors.nik = "NIK wajib diisi"
    if (!email.trim()) newErrors.email = "Email wajib diisi"
    if (!username.trim()) newErrors.username = "Username wajib diisi"
    if (!password.trim()) newErrors.password = "Password wajib diisi"
    if (!passwordConfirm.trim()) newErrors.passwordConfirm = "Konfirmasi password wajib diisi"
    if (password !== passwordConfirm) newErrors.passwordConfirm = "Password tidak sama"
    if (!tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir wajib diisi"
    if (!selectedKecamatan) newErrors.kecamatan = "Kecamatan wajib dipilih"
    if (!selectedKelurahan) newErrors.kelurahan = "Kelurahan wajib dipilih"
    if (!alamatLengkap.trim()) newErrors.alamatLengkap = "Alamat lengkap wajib diisi"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    try {
      await execute(authService.register({
        nik,
        email,
        username,
        password,
        passwordConfirm,
        tanggalLahir,
        alamatLengkap,
        kecamatan: selectedKecamatan?.name || "",
        kelurahan: selectedKelurahan?.name || "",
      }))

      alert("Registrasi berhasil! Silakan login dengan akun Anda.")
      navigate("/")
    } catch (error) {
      // Error handled by useApi
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 border p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <form id="register-form" className={cn("flex flex-col gap-5")} onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col gap-1 mb-4">
                  <h1 className="text-3xl font-bold">Selamat Datang di SULA!</h1>
                  <p className="text-sm text-muted-foreground">
                    Silakan mendaftar untuk melaporkan fasilitas publik di Kota Surakarta.
                  </p>
                </div>

                {apiError && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {apiError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="nik">NIK</FieldLabel>
                    <Input id="nik" value={nik} onChange={(e) => setNik(e.target.value)} required placeholder="3372..." />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="johndoe" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="tanggalLahir">Tanggal Lahir</FieldLabel>
                    <Input id="tanggalLahir" type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} required />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="******" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="passwordConfirm">Konfirmasi</FieldLabel>
                    <Input id="passwordConfirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required placeholder="******" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="kecamatan">Kecamatan</FieldLabel>
                    <Combobox
                      items={kecamatan}
                      itemToStringValue={(k) => k.name}
                      onValueChange={(val) => { setSelectedKecamatan(val); setSelectedKelurahan(null); }}
                    >
                      <ComboboxInput placeholder="Pilih..." value={selectedKecamatan?.name ?? ""} />
                      <ComboboxContent>
                        <ComboboxList>
                          {kecamatan.map((kec) => (
                            <ComboboxItem key={kec.id} value={kec}>{kec.name}</ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="kelurahan">Kelurahan</FieldLabel>
                    <Combobox
                      items={filteredKelurahan}
                      itemToStringValue={(k) => k.name}
                      onValueChange={(val) => setSelectedKelurahan(val)}
                    >
                      <ComboboxInput placeholder="Pilih..." value={selectedKelurahan?.name ?? ""} disabled={!selectedKecamatan} />
                      <ComboboxContent>
                        <ComboboxList>
                          {filteredKelurahan.map((kel) => (
                            <ComboboxItem key={kel.id} value={kel}>{kel.name}</ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="alamatLengkap">Alamat Lengkap</FieldLabel>
                  <Textarea id="alamatLengkap" value={alamatLengkap} onChange={(e) => setAlamatLengkap(e.target.value)} required placeholder="Jl. Slamet Riyadi No..." />
                </Field>

                <Button size="lg" type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-2">
                  Sudah punya akun? <a href="/" className="text-primary hover:underline">Masuk</a>
                </p>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop"
          alt="Registration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-10 bg-primary/20" />
      </div>
    </div>
  )
}
