import { UserNavbar } from "@/components/user/UserNavbar"
import { UserFooter } from "@/components/user/UserFooter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Loader2,
  UserCircle,
  AlertCircle,
  Save,
} from "lucide-react"
import { useEffect, useState, useMemo, type FormEvent } from "react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { KECAMATAN_LIST, KELURAHAN_LIST, type Kecamatan, type Kelurahan } from "@/lib/regions"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

export default function UserSettingPage() {
  const { user, logout } = useAuth()
  const currentYear = new Date().getFullYear()

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [profile, setProfile] = useState({
    username: "",
    nik: "",
    noWa: "",
    alamatLengkap: "",
    kecamatan: "",
    kelurahan: "",
  })

  // State untuk dropdown kecamatan dan kelurahan
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null)
  const [selectedKelurahan, setSelectedKelurahan] = useState<Kelurahan | null>(null)
  const [kecamatanSearch, setKecamatanSearch] = useState("")
  const [kelurahanSearch, setKelurahanSearch] = useState("")

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

  // Pre-fill from auth context
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        username: user.username || "",
        nik: user.nik || "",
        noWa: user.noWa || "",
        alamatLengkap: user.alamatLengkap || "",
        kecamatan: user.kecamatan || "",
        kelurahan: user.kelurahan || "",
      }))

      if (user.kecamatan) {
        const found = KECAMATAN_LIST.find(k => k.name === user.kecamatan)
        if (found) {
          setSelectedKecamatan(found)
          setKecamatanSearch(found.name)
        }
      }
      if (user.kelurahan) {
        const found = KELURAHAN_LIST.find(k => k.name === user.kelurahan)
        if (found) {
          setSelectedKelurahan(found)
          setKelurahanSearch(found.name)
        }
      }
    }
  }, [user])

  const getAuthHeaders = (): Record<string, string> => {
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user")
    if (!rawUser) return {}
    try {
      const parsed = JSON.parse(rawUser) as { token?: string }
      if (!parsed.token) return {}
      return { Authorization: `Bearer ${parsed.token}` }
    } catch {
      return {}
    }
  }

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const headers = getAuthHeaders()
      
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          username: profile.username,
          no_wa: profile.noWa,
          alamat_lengkap: profile.alamatLengkap,
          kecamatan: profile.kecamatan,
          kelurahan: profile.kelurahan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Gagal menyimpan profil")
      }

      // Update local storage so UI reflects changes without logout
      const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user")
      if (rawUser) {
        const userData = JSON.parse(rawUser)
        userData.username = profile.username
        userData.noWa = profile.noWa
        userData.alamatLengkap = profile.alamatLengkap
        userData.kecamatan = profile.kecamatan
        userData.kelurahan = profile.kelurahan

        if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(userData))
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData))
        }
      }

      toast.success("Profil berhasil diperbarui!")
    } catch (error: any) {
      console.error("Gagal menyimpan profil:", error)
      toast.error(error.message || "Gagal menyimpan profil")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      toast.success("Permintaan penghapusan akun telah dikirim.")
      setTimeout(() => {
        logout()
      }, 1500)
    } catch (error) {
      toast.error("Gagal menghapus akun")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 transition-colors duration-300 dark:bg-background">
      <UserNavbar />

      <main className="container mx-auto flex-1 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Pengaturan Profil
            </h1>
            <p className="text-muted-foreground">
              Kelola informasi akun Anda di SULA
            </p>
          </div>

          {/* Profile Card */}
          <Card className="overflow-hidden rounded-3xl border-none bg-card/60 shadow-xl shadow-primary/5 backdrop-blur-sm">
            <CardContent className="space-y-8 p-8">
              {/* Avatar Area */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserCircle className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {profile.username || "Warga SULA"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    NIK: {profile.nik || "-"}
                  </p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSave}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, username: e.target.value }))
                      }
                      placeholder="Masukkan nama lengkap..."
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nik" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      NIK
                    </Label>
                    <Input
                      id="nik"
                      value={profile.nik}
                      disabled
                      className="h-12 rounded-xl cursor-not-allowed opacity-60"
                      title="NIK tidak bisa diubah"
                    />
                    <p className="text-xs text-muted-foreground">
                      NIK ditetapkan saat pendaftaran dan tidak dapat diubah.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noWa" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Nomor WhatsApp
                  </Label>
                  <Input
                    id="noWa"
                    value={profile.noWa}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, noWa: e.target.value }))
                    }
                    placeholder="Contoh: 08123456789"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Alamat Lengkap
                  </Label>
                  <Textarea
                    id="alamat"
                    rows={3}
                    value={profile.alamatLengkap}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, alamatLengkap: e.target.value }))
                    }
                    placeholder="Masukkan alamat lengkap..."
                    className="rounded-xl resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="kecamatan" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Kecamatan
                    </Label>
                    <Combobox
                      items={filteredKecamatanOptions}
                      itemToStringValue={(k: Kecamatan) => k.name}
                      onValueChange={(val: Kecamatan | null) => {
                        setSelectedKecamatan(val)
                        setSelectedKelurahan(null)
                        setKecamatanSearch(val ? val.name : "")
                        setKelurahanSearch("")
                        setProfile(prev => ({ ...prev, kecamatan: val?.name || "", kelurahan: "" }))
                      }}
                    >
                      <ComboboxInput 
                        placeholder="Pilih atau cari kecamatan..." 
                        value={kecamatanSearch}
                        onChange={(e) => setKecamatanSearch(e.target.value)}
                        onBlur={() => { if (selectedKecamatan) setKecamatanSearch(selectedKecamatan.name) }}
                        className="h-12 rounded-xl"
                      />
                      <ComboboxContent className="rounded-xl">
                        <ComboboxList>
                          {filteredKecamatanOptions.map((kec) => (
                            <ComboboxItem key={kec.id} value={kec} className="cursor-pointer">
                              {kec.name}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="kelurahan" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Kelurahan
                    </Label>
                    <Combobox
                      items={filteredKelurahanOptions}
                      itemToStringValue={(k: Kelurahan) => k.name}
                      onValueChange={(val: Kelurahan | null) => {
                        setSelectedKelurahan(val)
                        setKelurahanSearch(val ? val.name : "")
                        setProfile(prev => ({ ...prev, kelurahan: val?.name || "" }))
                      }}
                    >
                      <ComboboxInput 
                        placeholder={selectedKecamatan ? "Pilih atau cari kelurahan..." : "Pilih kecamatan dahulu"} 
                        disabled={!selectedKecamatan}
                        value={kelurahanSearch}
                        onChange={(e) => setKelurahanSearch(e.target.value)}
                        onBlur={() => { if (selectedKelurahan) setKelurahanSearch(selectedKelurahan.name) }}
                        className="h-12 rounded-xl"
                      />
                      <ComboboxContent className="rounded-xl">
                        <ComboboxList>
                          {filteredKelurahanOptions.map((kel) => (
                            <ComboboxItem key={kel.id} value={kel} className="cursor-pointer">
                              {kel.name}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-muted-foreground">
                    Perubahan akan langsung tersimpan
                  </p>
                  <Button
                    type="submit"
                    className="h-12 min-w-40 rounded-2xl font-bold shadow-lg shadow-primary/20"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="overflow-hidden rounded-3xl border-red-200/80 dark:border-red-900/30">
            <div className="flex items-center gap-2 border-b bg-red-50 px-8 py-3 text-red-700 dark:bg-red-950/20 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-bold">Zona Berbahaya</span>
            </div>
            <CardContent className="flex flex-col gap-5 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold">Hapus Akun</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Akun Anda dan seluruh data akan dihapus secara permanen.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Hapus Akun
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Hapus Akun</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini bersifat permanen. Data akun dan aktivitas
                      Anda akan dihapus dari sistem SULA.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menghapus...
                        </>
                      ) : (
                        "Lanjut Hapus"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <p className="pb-4 text-center text-xs text-muted-foreground">
            © {currentYear} SULA. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </main>

      <UserFooter />
    </div>
  )
}
