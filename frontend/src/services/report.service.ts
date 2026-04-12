const getAuthHeader = (): Record<string, string> => {
  const user = localStorage.getItem("user");
  if (user) {
    const { token } = JSON.parse(user);
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const parseJsonResponse = async (response: Response) => {
  const text = await response.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Invalid JSON response from server (${response.status})`)
  }
}

export const reportService = {
  create: async (formData: FormData) => {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });

    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Gagal membuat laporan");
    }
    return result;
  },

  getAll: async (limit = 100, offset = 0) => {
    const response = await fetch(`/api/report?limit=${limit}&offset=${offset}`, {
      headers: { ...getAuthHeader() },
    });
    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Gagal memuat laporan");
    }
    return (result as any).data; // You may want to return {data, pagination} if you need total count, but keeping this for backward compatibility
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/report/${id}`, {
      headers: { ...getAuthHeader() },
    });
    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Gagal memuat detail laporan");
    }
    return (result as any).data;
  },

  update: async (id: string, data: FormData | any) => {
    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = { ...getAuthHeader() };
    
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`/api/report/${id}`, {
      method: "PUT",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Gagal memperbarui laporan");
    }
    return result;
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/report/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });

    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Gagal menghapus laporan");
    }
    return result;
  },

  getLeaderboard: async () => {
    const response = await fetch("/api/leaderboard");
    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Gagal memuat leaderboard");
    }
    return (result as any).data;
  },

  upvote: async (id: string) => {
    const response = await fetch(`/api/report/${id}/upvote`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });

    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Gagal mendukung laporan");
    }
    return (result as any).data;
  },
};

