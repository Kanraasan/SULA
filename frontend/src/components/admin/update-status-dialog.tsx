import { useEffect, useState } from "react"
import { type Laporan } from "@/components/report-table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

type StatusOption = {
  value: Laporan["status"]
  label: string
}

const statusOptions: StatusOption[] = [
  { value: "menunggu", label: "Menunggu Validasi" },
  { value: "diproses", label: "Sedang Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak / Spam" },
]

type UpdateStatusDialogProps = {
  open: boolean
  isUpdatingStatus: boolean
  selectedReport: Laporan | null
  onOpenChange: (open: boolean) => void
  onSubmit: (status: Laporan["status"], catatan: string) => Promise<boolean>
}

export function UpdateStatusDialog({
  open,
  isUpdatingStatus,
  selectedReport,
  onOpenChange,
  onSubmit,
}: UpdateStatusDialogProps) {
  const [status, setStatus] = useState<Laporan["status"]>("menunggu")
  const [catatan, setCatatan] = useState("")

  useEffect(() => {
    if (!selectedReport) {
      setStatus("menunggu")
      setCatatan("")
      return
    }

    setStatus(selectedReport.status)
    setCatatan("")
  }, [selectedReport, open])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isSuccess = await onSubmit(status, catatan)
    if (isSuccess) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      modal={false}
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Perbarui Status Laporan</DialogTitle>
          <DialogDescription>
            Ubah status laporan dan simpan perubahan.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="status-laporan">Status</Label>
            <Combobox
              items={statusOptions}
              itemToStringValue={(item: StatusOption) => item.label}
              onValueChange={(item: StatusOption | null) => {
                if (!item) return
                setStatus(item.value)
              }}
            >
              <ComboboxInput
                placeholder="Pilih status laporan"
                value={statusOptions.find((item) => item.value === status)?.label ?? ""}
              />
              <ComboboxContent className="z-70">
                <ComboboxEmpty>Status tidak ditemukan</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <Label htmlFor="catatan-admin">Catatan Admin (Opsional)</Label>
            <Textarea
              id="catatan-admin"
              value={catatan}
              onChange={(event) => setCatatan(event.target.value)}
              placeholder="Tambahkan catatan tindak lanjut"
              className="min-h-24"
            />
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUpdatingStatus}>
              {isUpdatingStatus ? "Menyimpan..." : "Simpan Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
