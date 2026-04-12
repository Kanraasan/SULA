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

export const authService = {
  login: async (identifier: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).message || "Login gagal");
    }
    
    // Simpan ke localStorage
    if ((result as any).data) {
      localStorage.setItem("user", JSON.stringify((result as any).data));
    }
    
    return (result as any).data;
  },

  register: async (data: any) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await parseJsonResponse(response)
    if (!response.ok) {
      throw new Error((result as any).error || (result as any).message || "Registrasi gagal");
    }
    return result;
  },

  logout: () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};
