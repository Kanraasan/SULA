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
  const [NIK, setNIK] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [alamatLengkap, setAlamatLengkap] = useState("")
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(
    null
  )
  const [selectedKelurahan, setSelectedKelurahan] = useState<Kelurahan | null>(
    null
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredKelurahan = useMemo(() => {
    if (!selectedKecamatan) return []
    return kelurahan.filter((item) => item.kecamatan === selectedKecamatan.name)
  }, [selectedKecamatan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!NIK.trim()) newErrors.NIK = "NIK wajib diisi"
    if (!username.trim()) newErrors.username = "Username wajib diisi"
    if (!password.trim()) newErrors.password = "Password wajib diisi"
    if (!passwordConfirm.trim())
      newErrors.passwordConfirm = "Konfirmasi password wajib diisi"
    if (password !== passwordConfirm)
      newErrors.passwordConfirm = "Password tidak sama"
    if (!selectedKecamatan) newErrors.kecamatan = "Kecamatan wajib dipilih"
    if (!selectedKelurahan) newErrors.kelurahan = "Kelurahan wajib dipilih"
    if (!alamatLengkap.trim())
      newErrors.alamatLengkap = "Alamat lengkap wajib diisi"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch("/api/regist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NIK: parseInt(NIK),
          username,
          password,
          passwordConfirm,
          alamatLengkap,
          kecamatan: selectedKecamatan.name,
          kelurahan: selectedKelurahan.name,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Registrasi berhasil! Silakan login dengan akun Anda.")
        window.location.href = "/"
      } else {
        setErrors({ general: result.message || "Registrasi gagal" })
      }
    } catch (error) {
      setErrors({ general: "Terjadi kesalahan saat registrasi" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 border md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <form className={cn("flex flex-col gap-5")} onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold">
                    Selamat Datang di SULA!
                  </h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    Silakan mendaftar dan mendapatkan akun Anda untuk melaporkan
                    atau memantau status fasilitas di lingkungan Anda.
                  </p>
                </div>

                {errors.general && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {errors.general}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="nik">NIK</FieldLabel>
                  <Input
                    id="nik"
                    type="text"
                    placeholder="Masukkan NIK Anda"
                    value={NIK}
                    onChange={(e) => setNIK(e.target.value)}
                    required
                    className="bg-background"
                  />
                  {errors.NIK && (
                    <p className="text-sm text-destructive">{errors.NIK}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan Username Anda"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-background"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">
                      {errors.username}
                    </p>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="passwordConfirm">
                      Konfirmasi Kata Sandi
                    </FieldLabel>
                  </div>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="Masukkan ulang kata sandi"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    className="bg-background"
                  />
                  {errors.passwordConfirm && (
                    <p className="text-sm text-destructive">
                      {errors.passwordConfirm}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className={cn("flex flex-col gap-5")} onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="kecamatan">Kecamatan</FieldLabel>
                  <Combobox
                    items={kecamatan}
                    itemToStringValue={(kecamatan: Kecamatan) => kecamatan.name}
                    onValueChange={(val) => {
                      setSelectedKecamatan(val)
                      setSelectedKelurahan(null)
                    }}
                  >
                    <ComboboxInput
                      placeholder="Pilih kecamatan anda"
                      value={selectedKecamatan?.name ?? ""}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>Pilih Kecamatan Anda</ComboboxEmpty>
                      <ComboboxList>
                        {(kecamatan) => (
                          <ComboboxItem key={kecamatan.id} value={kecamatan}>
                            {kecamatan.name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {errors.kecamatan && (
                    <p className="text-sm text-destructive">
                      {errors.kecamatan}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="kelurahan">Kelurahan</FieldLabel>
                  <Combobox
                    items={filteredKelurahan}
                    itemToStringValue={(kelurahan: Kelurahan) => kelurahan.name}
                    onValueChange={(val) => {
                      setSelectedKelurahan(val)
                    }}
                  >
                    <ComboboxInput
                      placeholder={
                        selectedKecamatan
                          ? "Pilih kelurahan anda"
                          : "Pilih kecamatan dulu"
                      }
                      value={selectedKelurahan?.name ?? ""}
                      disabled={!selectedKecamatan}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>Pilih Kelurahan Anda</ComboboxEmpty>
                      <ComboboxList>
                        {(kelurahan) => (
                          <ComboboxItem key={kelurahan.id} value={kelurahan}>
                            {kelurahan.name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {errors.kelurahan && (
                    <p className="text-sm text-destructive">
                      {errors.kelurahan}
                    </p>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="fullAdress">Alamat Lengkap</FieldLabel>
                  </div>
                  <Textarea
                    id="fullAdress"
                    placeholder="Masukkan alamat lengkap Anda"
                    value={alamatLengkap}
                    onChange={(e) => setAlamatLengkap(e.target.value)}
                    required
                  />
                  {errors.alamatLengkap && (
                    <p className="text-sm text-destructive">
                      {errors.alamatLengkap}
                    </p>
                  )}
                </Field>

                <Field>
                  <Button size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Memproses..." : "Daftar"}
                  </Button>
                </Field>

                <Field>
                  <FieldDescription className="text-center">
                    Sudah punya akun?{" "}
                    <a
                      href="/"
                      className="text-primary underline-offset-4 hover:underline dark:text-blue-600"
                    >
                      Masuk Sekarang
                    </a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
