import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { type CreateReportPayload } from "@/hooks/useAdminReports"

type KategoriMasalah = {
  value: string
  label: string
}

type CreateReportDialogProps = {
  open: boolean
  isSubmitting: boolean
  kategoriMasalah: KategoriMasalah[]
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateReportPayload) => Promise<boolean>
}

export function CreateReportDialog({
  open,
  isSubmitting,
  kategoriMasalah,
  onOpenChange,
  onSubmit,
}: CreateReportDialogProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [lampiranFoto, setLampiranFoto] = useState<File | null>(null)

  useEffect(() => {
    if (!open) {
      setTitle("")
      setCategory("")
      setDescription("")
      setLampiranFoto(null)
    }
  }, [open])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim() || !category || !description.trim()) {
      toast.error("Mohon lengkapi judul, kategori, dan deskripsi laporan")
      return
    }

    const isSuccess = await onSubmit({
      title: title.trim(),
      category,
      description: description.trim(),
      lampiranFoto,
    })

    if (isSuccess) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Buat Laporan Baru</DialogTitle>
            <DialogDescription>
              Isi detail laporan warga lalu klik Buat untuk menyimpan.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="report-title">Judul Laporan</Label>
              <Input
                id="report-title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Jalan berlubang di Jl. Merdeka"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="report-category">Kategori Masalah</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="report-category" className="w-full">
                  <SelectValue placeholder="Pilih kategori masalah" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriMasalah.map((kategori) => (
                    <SelectItem key={kategori.value} value={kategori.value}>
                      {kategori.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="report-detail">Deskripsi Detail</Label>
              <Textarea
                id="report-detail"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Jelaskan lokasi, waktu kejadian, dan kondisi masalah secara rinci"
                className="min-h-28"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="report-photo">Foto Pendukung (Opsional)</Label>
              <Input
                id="report-photo"
                name="lampiranFoto"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  setLampiranFoto(file)
                }}
              />
              <FieldDescription>
                Format yang disarankan: JPG, JPEG, atau PNG.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Buat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
