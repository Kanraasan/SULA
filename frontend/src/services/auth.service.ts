export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Login gagal");
    }
    
    // Simpan ke localStorage
    if (result.data) {
      localStorage.setItem("user", JSON.stringify(result.data));
    }
    
    return result.data;
  },

  register: async (data: any) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Registrasi gagal");
    }
    return result;
  },

  logout: () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};
