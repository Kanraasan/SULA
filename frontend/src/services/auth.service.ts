export const authService = {
  login: async (identifier: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Login gagal");
    }
    return result.data;
  },

  register: async (data: any) => {
    const response = await fetch("/api/regist", {
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
};
