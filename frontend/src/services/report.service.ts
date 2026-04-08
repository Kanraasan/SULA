const getAuthHeader = (): Record<string, string> => {
  const user = localStorage.getItem("user");
  if (user) {
    const { token } = JSON.parse(user);
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const reportService = {
  create: async (formData: FormData) => {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal membuat laporan");
    }
    return result;
  },

  getAll: async () => {
    const response = await fetch("/api/report");
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal memuat laporan");
    }
    return result.data;
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/report/${id}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal memuat detail laporan");
    }
    return result.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await fetch(`/api/report/${id}`, {
      method: "PUT",
      headers: { ...getAuthHeader() },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal memperbarui laporan");
    }
    return result;
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/report/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus laporan");
    }
    return result;
  },
};
