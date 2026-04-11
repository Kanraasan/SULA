import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
// Note: Changed from '@/components/report-table' to '@/components/admin/ReportTable' to match actual file location
import { type Laporan } from "@/components/admin/ReportTable"
import { api, isHandledApiError } from "@/lib/api-client"

export type BackendPost = {
  id: string
  user_id: string
  username: string
  complaint_title: string
  complaint_category: string
  complaint_description: string
  complaint_image: string | null
  status: "menunggu" | "diproses" | "selesai" | "ditolak"
  upvotes: number
  created_at: string
  updated_at?: string
}

export type CreateReportPayload = {
  title: string
  category: string
  description: string
  lampiranFoto?: File | null
}

const toInitials = (name: string) => {
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return "AN"
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase()
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase()
}

const normalizeStatus = (
  value: BackendPost["status"] | string | undefined
): Laporan["status"] => {
  const v = value?.toLowerCase()
  if (v === "diproses" || v === "selesai" || v === "ditolak") {
    return v as Laporan["status"]
  }
  return "menunggu"
}

const mapPostToLaporan = (item: BackendPost): Laporan => {
  const reporterName = item.username || "Anonim"

  return {
    id: item.id,
    date: item.created_at,
    reporter: {
      initials: toInitials(reporterName),
      name: reporterName,
    },
    complaint: {
      title: item.complaint_title,
      category: item.complaint_category?.toLowerCase() || "lainnya",
      description: item.complaint_description,
    },
    status: normalizeStatus(item.status),
    upvotes: item.upvotes || 0,
  }
}

const getAuthHeaders = (): Record<string, string> => {
  const rawUser = localStorage.getItem("user")
  if (!rawUser) return {}

  try {
    const parsedUser = JSON.parse(rawUser) as { token?: string; nik?: string | number; username?: string }
    if (!parsedUser.token) return {}
    return { Authorization: `Bearer ${parsedUser.token}` }
  } catch {
    return {}
  }
}

const getUserIdentity = () => {
  const rawUser = localStorage.getItem("user")
  if (!rawUser) return null

  try {
    const parsedUser = JSON.parse(rawUser) as { nik?: string | number; username?: string }
    return {
      nik: parsedUser.nik,
      username: parsedUser.username,
    }
  } catch {
    return null
  }
}

export function useAdminReports() {
  const [laporanData, setLaporanData] = useState<Laporan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchLaporan = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await api.get<{ data?: BackendPost[] }>("/api/report", {
        fallbackMessage: "Gagal mengambil data laporan",
      })

      const mapped = Array.isArray(result.data)
        ? result.data.map((item: BackendPost) => mapPostToLaporan(item))
        : []

      setLaporanData(mapped)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan jaringan"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchLaporan()
  }, [fetchLaporan])

  const createReport = useCallback(async (payloadInput: CreateReportPayload) => {
    const payload = new FormData()
    payload.append("title", payloadInput.title)
    payload.append("category", payloadInput.category)
    payload.append("description", payloadInput.description)

    const userIdentity = getUserIdentity()
    if (userIdentity?.nik) payload.append("userNik", String(userIdentity.nik))
    if (userIdentity?.username) payload.append("username", userIdentity.username)

    if (payloadInput.lampiranFoto) {
      payload.append("lampiranFoto", payloadInput.lampiranFoto)
    }

    setIsSubmitting(true)
    try {
      const result = await api.post<{ message?: string; data?: BackendPost }>(
        "/api/report",
        payload,
        {
          headers: {
            ...getAuthHeaders(),
          },
        },
        {
          fallbackMessage: "Gagal membuat laporan",
          showErrorToast: true,
        }
      )

      if (result.data) {
        const createdReport = mapPostToLaporan(result.data)
        setLaporanData((prev) => [createdReport, ...prev])
      }

      toast.success(result.message || "Laporan berhasil dibuat")
      return true
    } catch (error) {
      if (!isHandledApiError(error)) {
        toast.error(error instanceof Error ? error.message : "Gagal membuat laporan")
      }
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const deleteReport = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      const result = await api.delete<{ message?: string }>(
        `/api/report/${id}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        },
        {
          fallbackMessage: "Gagal menghapus laporan",
          showErrorToast: true,
        }
      )

      setLaporanData((prev) => prev.filter((item) => item.id !== id))
      toast.success(result.message || "Laporan berhasil dihapus")
      return true
    } catch (error) {
      if (!isHandledApiError(error)) {
        toast.error(error instanceof Error ? error.message : "Gagal menghapus laporan")
      }
      return false
    } finally {
      setDeletingId(null)
    }
  }, [])

  const updateReportStatus = useCallback(
    async (report: Laporan, status: Laporan["status"], catatan: string) => {
      setIsUpdatingStatus(true)
      try {
        const result = await api.put<{ message?: string }>(
          `/api/report/${report.id}`,
          JSON.stringify({
            title: report.complaint.title,
            category: report.complaint.category,
            description: report.complaint.description,
            status,
            catatanAdmin: catatan,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          },
          {
            fallbackMessage: "Gagal memperbarui status laporan",
            showErrorToast: true,
          }
        )

        setLaporanData((prev) =>
          prev.map((item) =>
            item.id === report.id
              ? {
                  ...item,
                  status,
                }
              : item
          )
        )

        toast.success(result.message || "Status laporan berhasil diperbarui")
        return true
      } catch (error) {
        if (!isHandledApiError(error)) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat memperbarui status"
          )
        }
        return false
      } finally {
        setIsUpdatingStatus(false)
      }
    },
    []
  )

  const summary = useMemo(
    () => ({
      total: laporanData.length,
      menunggu: laporanData.filter((item) => item.status === "menunggu").length,
      diproses: laporanData.filter((item) => item.status === "diproses").length,
      selesai: laporanData.filter((item) => item.status === "selesai").length,
      ditolak: laporanData.filter((item) => item.status === "ditolak").length,
    }),
    [laporanData]
  )

  return {
    laporanData,
    isLoading,
    isSubmitting,
    isUpdatingStatus,
    deletingId,
    errorMessage,
    summary,
    fetchLaporan,
    createReport,
    deleteReport,
    updateReportStatus,
  }
}
