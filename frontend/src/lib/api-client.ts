import { toast } from "sonner"

export type ApiEnvelope<TData = unknown> = {
  message?: string
  data?: TData
}

type ApiRequestConfig = {
  fallbackMessage?: string
  showErrorToast?: boolean
}

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() || ""

export class ApiError extends Error {
  status: number
  handled: boolean

  constructor(message: string, status: number, handled = false) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.handled = handled
  }
}

export const isHandledApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError && error.handled

export const toApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  if (!API_BASE_URL) {
    return normalizedPath
  }

  const normalizedBase = API_BASE_URL.replace(/\/+$/, "")
  const baseEndsWithApi = /\/api$/i.test(normalizedBase)
  const pathStartsWithApi = normalizedPath.startsWith("/api/")

  if (baseEndsWithApi && pathStartsWithApi) {
    return `${normalizedBase}${normalizedPath.replace(/^\/api/, "")}`
  }

  return `${normalizedBase}${normalizedPath}`
}

export const parseApiResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || ""
  const rawText = await response.text()

  if (!rawText) {
    return {}
  }

  if (!contentType.includes("application/json")) {
    const preview = rawText.trim().slice(0, 120)
    throw new ApiError(
      `Response API bukan JSON (status ${response.status}). Kemungkinan endpoint salah atau API URL belum benar. Preview: ${preview}`,
      response.status
    )
  }

  try {
    return JSON.parse(rawText)
  } catch {
    throw new ApiError(
      `Gagal parse JSON dari API (status ${response.status}). Pastikan backend mengembalikan JSON valid.`,
      response.status
    )
  }
}

const request = async <TResponse extends ApiEnvelope>(
  path: string,
  options: RequestInit,
  config: ApiRequestConfig = {}
) => {
  // Otomatis pasang Authorization header jika user login
  let authHeaders: Record<string, string> = {}
  try {
    const rawUser = localStorage.getItem("user")
    if (rawUser) {
      const parsedUser = JSON.parse(rawUser) as { token?: string }
      if (parsedUser.token) {
        authHeaders.Authorization = `Bearer ${parsedUser.token}`
      }
    }
  } catch {}

  const mergedOptions = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(toApiUrl(path), mergedOptions)
  const result = (await parseApiResponse(response)) as TResponse

  if (!response.ok) {
    const message = result.message || config.fallbackMessage || "Permintaan API gagal"
    const handled = Boolean(config.showErrorToast)

    if (handled) {
      toast.error(message)
    }

    throw new ApiError(message, response.status, handled)
  }

  return result
}

export const api = {
  get: <TResponse extends ApiEnvelope>(
    path: string,
    config?: ApiRequestConfig
  ) => request<TResponse>(path, {}, config),
  post: <TResponse extends ApiEnvelope>(
    path: string,
    body: BodyInit | null,
    options?: Omit<RequestInit, "method" | "body">,
    config?: ApiRequestConfig
  ) =>
    request<TResponse>(
      path,
      {
        ...options,
        method: "POST",
        body,
      },
      config
    ),
  put: <TResponse extends ApiEnvelope>(
    path: string,
    body: BodyInit | null,
    options?: Omit<RequestInit, "method" | "body">,
    config?: ApiRequestConfig
  ) =>
    request<TResponse>(
      path,
      {
        ...options,
        method: "PUT",
        body,
      },
      config
    ),
  delete: <TResponse extends ApiEnvelope>(
    path: string,
    options?: Omit<RequestInit, "method">,
    config?: ApiRequestConfig
  ) =>
    request<TResponse>(
      path,
      {
        ...options,
        method: "DELETE",
      },
      config
    ),
}
