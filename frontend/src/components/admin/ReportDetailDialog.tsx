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
import { type Laporan } from "./ReportTable"

const formatTanggalIndonesia = (value: string) => {
  const dateValue = new Date(value)

  if (Number.isNaN(dateValue.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateValue)
}

type ReportDetailDialogProps = {
  open: boolean
  selectedDetail: Laporan | null
  onOpenChange: (open: boolean) => void
}

export function ReportDetailDialog({
  open,
  selectedDetail,
  onOpenChange,
}: ReportDetailDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Laporan</DialogTitle>
          <DialogDescription>
            Ringkasan data laporan yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="text-md text-muted-foreground">Judul Laporan</p>
            <p className="font-medium">{selectedDetail?.complaint.title || "-"}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="text-md text-muted-foreground">Pelapor</p>
              <p className="font-medium">{selectedDetail?.reporter.name || "-"}</p>
            </div>
            <div>
              <p className="text-md text-muted-foreground">Tanggal</p>
              <p className="font-medium">
                {selectedDetail?.date
                  ? formatTanggalIndonesia(selectedDetail.date)
                  : "-"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-md text-muted-foreground">Kategori</p>
            <p className="font-medium capitalize">
              {(selectedDetail?.complaint.category || "-").replaceAll("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-md text-muted-foreground">Deskripsi</p>
            <p className="leading-relaxed text-sm text-foreground">
              {selectedDetail?.complaint.description || "-"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
