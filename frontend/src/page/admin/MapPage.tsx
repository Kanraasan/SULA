import { AppSidebar } from "@/components/AppSidebar"
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  type MapRef,
  type MapViewport,
} from "@/components/ui/map"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState, useEffect, useRef, useMemo } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import Clock02 from "@/components/Clock02"
import { Badge } from "@/components/ui/badge"
import { api, isHandledApiError } from "@/lib/api-client"
import { toast } from "sonner"
import { Loader2, FileText } from "lucide-react"

const styles = {
  // default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
}

type StyleKey = keyof typeof styles

type BackendReport = {
  id: string
  complaint_title: string
  complaint_category: string
  complaint_description: string
  status?: "menunggu" | "diproses" | "selesai" | "ditolak"
  username: string
  created_at: string
  latitude: number | null
  longitude: number | null
}

const statusLabel: Record<string, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
}

const statusColor: Record<string, string> = {
  menunggu:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-500",
  diproses:
    "bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-600",
  selesai:
    "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-500",
  ditolak:
    "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-500",
}

const categoryLabel: Record<string, string> = {
  infrastruktur: "Infrastruktur",
  kebersihan: "Kebersihan",
  penerangan: "Penerangan",
  ketertiban: "Ketertiban",
  fasilitas_publik: "Fasilitas Publik",
  fasilitas: "Fasilitas",
  pelayanan: "Pelayanan",
  bencana: "Bencana",
  lingkungan: "Lingkungan",
}

const categoryColor: Record<string, string> = {
  infrastruktur: "#ef4444",
  kebersihan: "#22c55e",
  penerangan: "#eab308",
  ketertiban: "#f97316",
  fasilitas_publik: "#3b82f6",
  fasilitas: "#3b82f6",
  pelayanan: "#8b5cf6",
  bencana: "#dc2626",
  lingkungan: "#14b8a6",
}

export default function MapPage() {
  const mapRef = useRef<MapRef>(null)
  const [style, setStyle] = useState<StyleKey>("openstreetmap")
  const selectedStyle = styles[style]
  const is3D = style === "openstreetmap3d"

  const [reports, setReports] = useState<BackendReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("")

  const [viewport, setViewport] = useState<MapViewport>({
    center: [110.8371, -7.5703],
    zoom: 12,
    bearing: 0,
    pitch: 0,
  })

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 })
  }, [is3D])

  // Fetch data laporan
  useEffect(() => {
    const loadReports = async () => {
      try {
        const result = await api.get<{ data?: BackendReport[] }>("/api/report", {
          fallbackMessage: "Gagal memuat data laporan",
          showErrorToast: true,
        })

        if (Array.isArray(result.data)) {
          setReports(result.data)
        }
      } catch (error) {
        if (!isHandledApiError(error)) {
          toast.error("Gagal memuat data laporan untuk peta")
        }
        console.error("Gagal memuat laporan:", error)
      } finally {
        setIsLoading(false)
      }
    }

    void loadReports()
  }, [])

  const filteredReports = useMemo(() => {
    if (!filterStatus) return reports
    return reports.filter(
      (r) => (r.status || "menunggu") === filterStatus
    )
  }, [reports, filterStatus])

  // Hitung ringkasan per status
  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = {
      menunggu: 0,
      diproses: 0,
      selesai: 0,
      ditolak: 0,
    }
    for (const r of reports) {
      const s = r.status || "menunggu"
      counts[s] = (counts[s] || 0) + 1
    }
    return counts
  }, [reports])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h2 className="font-bold">Peta Wilayah</h2>
          </div>
          <div className="flex items-center gap-4">
            <Clock02 />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Panel Laporan di samping peta */}
          <div className="flex w-80 flex-col border-r bg-card lg:w-96">
            {/* Header panel */}
            <div className="border-b p-4">
              <h3 className="text-lg font-bold">Daftar Laporan</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {reports.length} laporan total
              </p>

              {/* Filter chip per status */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterStatus("")}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    filterStatus === ""
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Semua ({reports.length})
                </button>
                {Object.entries(statusSummary).map(([key, count]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setFilterStatus(filterStatus === key ? "" : key)
                    }
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      filterStatus === key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {statusLabel[key] || key} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Daftar laporan */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Memuat laporan...
                  </span>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileText className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">Tidak ada laporan</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="border-b px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold leading-tight line-clamp-1">
                        {report.complaint_title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={`shrink-0 text-[10px] font-medium ${
                          statusColor[report.status || "menunggu"] || ""
                        }`}
                      >
                        {statusLabel[report.status || "menunggu"] || "Menunggu"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {report.complaint_description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="capitalize">
                        {categoryLabel[report.complaint_category] ||
                          report.complaint_category}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <span>{report.username || "Anonim"}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <span>
                        {new Date(report.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Peta */}
          <div className="relative flex-1">
            <Map
              viewport={viewport}
              onViewportChange={setViewport}
              ref={mapRef}
              styles={
                selectedStyle
                  ? { light: selectedStyle, dark: selectedStyle }
                  : undefined
              }
              className="h-full w-full"
            >
              <MapControls
                position="bottom-right"
                showZoom
                showCompass
                showLocate
                showFullscreen
              />
              {/* Markers dari laporan yang punya koordinat */}
              {filteredReports
                .filter((r) => r.latitude != null && r.longitude != null)
                .map((report) => (
                  <MapMarker
                    key={report.id}
                    longitude={report.longitude!}
                    latitude={report.latitude!}
                  >
                    <MarkerContent>
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-125"
                        style={{ backgroundColor: categoryColor[report.complaint_category] || "#3b82f6" }}
                      >
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    </MarkerContent>
                    <MarkerPopup>
                      <div className="max-w-[240px] space-y-2">
                        <h4 className="text-sm font-bold leading-tight">{report.complaint_title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`shrink-0 text-[10px] font-medium ${
                              statusColor[report.status || "menunggu"] || ""
                            }`}
                          >
                            {statusLabel[report.status || "menunggu"] || "Menunggu"}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground capitalize">
                            {categoryLabel[report.complaint_category] || report.complaint_category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {report.complaint_description}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {report.username} · {new Date(report.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </MarkerPopup>
                  </MapMarker>
                ))}
            </Map>
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border bg-background/80 px-2 py-1.5 font-mono text-xs backdrop-blur">
              <span>
                <span className="text-muted-foreground">bujur:</span>{" "}
                {viewport.center[0].toFixed(3)}
              </span>
              <span>
                <span className="text-muted-foreground">lintang:</span>{" "}
                {viewport.center[1].toFixed(3)}
              </span>
              <span>
                <span className="text-muted-foreground">perbesaran:</span>{" "}
                {viewport.zoom.toFixed(1)}
              </span>
              <span>
                <span className="text-muted-foreground">arah:</span>{" "}
                {viewport.bearing.toFixed(1)}°
              </span>
              <span>
                <span className="text-muted-foreground">kemiringan:</span>{" "}
                {viewport.pitch.toFixed(1)}°
              </span>
            </div>
            <div className="absolute top-2 right-2 z-10">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as StyleKey)}
                className="rounded-md border bg-background px-2 py-1 text-sm text-foreground shadow"
              >
                <option value="openstreetmap">
                  Peta Standar (OpenStreetMap)
                </option>
                <option value="openstreetmap3d">Peta 3D (OpenStreetMap)</option>
              </select>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
