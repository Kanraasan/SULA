import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useApi } from "@/hooks/useApi"
import { authService } from "@/services/auth.service"

import { KECAMATAN_LIST, KELURAHAN_LIST, type Kecamatan, type Kelurahan } from "@/lib/regions"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { execute, loading: isSubmitting, error: apiError } = useApi()

  const [nik, setNik] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [tanggalLahir, setTanggalLahir] = useState<Date | undefined>(undefined)
  const [alamatLengkap, setAlamatLengkap] = useState("")
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null)
  const [selectedKelurahan, setSelectedKelurahan] = useState<Kelurahan | null>(null)
  const [kecamatanSearch, setKecamatanSearch] = useState("")
  const [kelurahanSearch, setKelurahanSearch] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredKelurahan = useMemo(() => {
    if (!selectedKecamatan) return []
    return KELURAHAN_LIST.filter(k => k.kecamatan === selectedKecamatan.name)
  }, [selectedKecamatan])

  const filteredKecamatanOptions = useMemo(() => {
    if (!kecamatanSearch) return KECAMATAN_LIST
    return KECAMATAN_LIST.filter(k => k.name.toLowerCase().includes(kecamatanSearch.toLowerCase()))
  }, [kecamatanSearch])

  const filteredKelurahanOptions = useMemo(() => {
    if (!kelurahanSearch) return filteredKelurahan
    return filteredKelurahan.filter(k => k.name.toLowerCase().includes(kelurahanSearch.toLowerCase()))
  }, [kelurahanSearch, filteredKelurahan])

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
        tanggalLahir: tanggalLahir ? tanggalLahir.toISOString() : "",
        alamatLengkap,
        kecamatan: selectedKecamatan?.name || "",
        kelurahan: selectedKelurahan?.name || "",
      }))

      alert("Registrasi berhasil! Silakan login dengan akun Anda.")
      navigate("/login")
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
                    {errors.nik && <p className="text-xs text-destructive mt-1">{errors.nik}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com" />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="johndoe" />
                    {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="tanggalLahir">Tanggal Lahir</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background",
                            !tanggalLahir && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tanggalLahir ? format(tanggalLahir, "PPP") : <span>Pilih Tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={tanggalLahir}
                          onSelect={setTanggalLahir}
                          initialFocus
                          captionLayout="dropdown"
                          startMonth={new Date(1950, 0)}
                          endMonth={new Date()}
                          defaultMonth={new Date(2000, 0)}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="******" />
                    {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="passwordConfirm">Konfirmasi</FieldLabel>
                    <Input id="passwordConfirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required placeholder="******" />
                    {errors.passwordConfirm && <p className="text-xs text-destructive mt-1">{errors.passwordConfirm}</p>}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="kecamatan">Kecamatan</FieldLabel>
                    <Combobox
                      items={filteredKecamatanOptions}
                      itemToStringValue={(k: Kecamatan) => k.name}
                      onValueChange={(val: Kecamatan | null) => { 
                        setSelectedKecamatan(val); 
                        setSelectedKelurahan(null); 
                        setKecamatanSearch(val ? val.name : "");
                        setKelurahanSearch("");
                      }}
                    >
                      <ComboboxInput 
                        placeholder="Ketik atau pilih kecamatan..." 
                        value={kecamatanSearch}
                        onChange={(e) => setKecamatanSearch(e.target.value)}
                        onBlur={() => { if(selectedKecamatan) setKecamatanSearch(selectedKecamatan.name) }}
                      />
                      <ComboboxContent>
                        <ComboboxList>
                          {filteredKecamatanOptions.map((kec) => (
                            <ComboboxItem key={kec.id} value={kec}>{kec.name}</ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="kelurahan">Kelurahan</FieldLabel>
                    <Combobox
                      items={filteredKelurahanOptions}
                      itemToStringValue={(k: Kelurahan) => k.name}
                      onValueChange={(val: Kelurahan | null) => {
                        setSelectedKelurahan(val);
                        setKelurahanSearch(val ? val.name : "");
                      }}
                    >
                      <ComboboxInput 
                        placeholder="Ketik atau pilih kelurahan..." 
                        disabled={!selectedKecamatan}
                        value={kelurahanSearch}
                        onChange={(e) => setKelurahanSearch(e.target.value)}
                        onBlur={() => { if(selectedKelurahan) setKelurahanSearch(selectedKelurahan.name) }}
                      />
                      <ComboboxContent>
                        <ComboboxList>
                          {filteredKelurahanOptions.map((kel) => (
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
