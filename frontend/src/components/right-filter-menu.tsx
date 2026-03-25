import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { ListFilter } from "lucide-react"

type StatusLaporan = {
  value: string
  label: string
  color: string
}

const statusLaporan: StatusLaporan[] = [
  {
    value: "menunggu",
    label: "Menunggu Validasi",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    value: "diproses",
    label: "Sedang Diproses",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    value: "selesai",
    label: "Selesai",
    color: "bg-green-500/10 text-green-500",
  },
  {
    value: "ditolak",
    label: "Ditolak / Spam",
    color: "bg-red-500/10 text-red-500",
  },
]

type KategoriLaporan = {
  value: string
  label: string
  deskripsi?: string // Opsional, bisa dipakai untuk tooltip
}

const kategoriLaporan: KategoriLaporan[] = [
  {
    value: "infrastruktur",
    label: "Infrastruktur & Jalan",
    deskripsi: "Jalan berlubang, aspal rusak, trotoar ambles, dll.",
  },
  {
    value: "kebersihan",
    label: "Kebersihan & Lingkungan",
    deskripsi: "Tumpukan sampah liar, saluran air/selokan mampet, polusi.",
  },
  {
    value: "penerangan",
    label: "Penerangan Jalan Umum (PJU)",
    deskripsi: "Lampu jalan mati, tiang listrik rawan roboh.",
  },
  {
    value: "ketertiban",
    label: "Ketertiban & Keamanan",
    deskripsi: "Parkir liar, PKL mengganggu jalan, kebisingan, premanisme.",
  },
  {
    value: "fasilitas_publik",
    label: "Fasilitas Publik",
    deskripsi: "Kerusakan di taman kota, halte, atau fasilitas olahraga.",
  },
  {
    value: "pelayanan",
    label: "Pelayanan Pemerintahan",
    deskripsi:
      "Pungutan liar (pungli), pelayanan kelurahan/kecamatan yang lambat.",
  },
  {
    value: "bencana",
    label: "Bencana & Keadaan Darurat",
    deskripsi: "Pohon tumbang, banjir, tanah longsor, dll.",
  },
]

interface RightFilterMenuProps {
  category: string
  onCategoryChange: (val: string) => void
  status: string
  onStatusChange: (val: string) => void
  date: DateRange | undefined
  onDateChange: (val: DateRange | undefined) => void
  onResetFilters: () => void
}

export function RightFilterMenu({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  date,
  onDateChange,
  onResetFilters,
}: RightFilterMenuProps) {
  const selectedCategoryLabel =
    kategoriLaporan.find((item) => item.value === category)?.label ?? ""
  const selectedStatusLabel =
    statusLaporan.find((item) => item.value === status)?.label ?? ""
  const hasActiveFilters = Boolean(category || status || date?.from || date?.to)

  return (
    <div className="flex gap-2">
      {/* FILTER KATEGORI */}
      <Combobox
        items={kategoriLaporan}
        onValueChange={(val) =>
          onCategoryChange(typeof val === "string" ? val : "")
        }
      >
        <ComboboxInput
          placeholder="Category"
          value={selectedCategoryLabel}
          className="w-35"
        >
          <InputGroupAddon>
            <ListFilter className="size-4" />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent>
          <ComboboxEmpty>No categories found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item.value}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {/* FILTER STATUS */}
      <Combobox
        items={statusLaporan}
        onValueChange={(val) =>
          onStatusChange(typeof val === "string" ? val : "")
        }
      >
        <ComboboxInput
          placeholder="Status"
          value={selectedStatusLabel}
          className="w-35"
        />
        <ComboboxContent>
          <ComboboxEmpty>No status found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item.value}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {/* FILTER TANGGAL */}
      <Field className="mx-auto w-60">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start px-2.5 font-normal"
            >
              <CalendarIcon className="mr-2 size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Button
        variant="destructive"
        size="sm"
        disabled={!hasActiveFilters}
        className="h-9 px-3 text-destructive hover:text-destructive"
        onClick={onResetFilters}
      >
        Reset Filter
      </Button>
    </div>
  )
}
