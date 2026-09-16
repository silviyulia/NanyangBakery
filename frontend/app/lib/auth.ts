export type UserRole = "owner" | "kasir" | "waitres";

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

const API_URL = "http://127.0.0.1:8000/api";

// ====================
// LOGIN
// ====================
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Login gagal:", data);
      return null;
    }

    // Simpan token Sanctum
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data.user as User;
  } catch (error) {
    console.error("Error koneksi ke backend:", error);
    throw error;
  }
}

// REGISTER
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}): Promise<{ message: string; user_id: number } | null> {
  try {
    const token = localStorage.getItem("token");

    // Tidak ada token → user belum login
    if (!token) {
      console.error("Token tidak ditemukan. Silakan login sebagai owner.");
      return null;
    }

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Register gagal:", result);
      return null;
    }

    return result;
  } catch (error) {
    console.error("Error koneksi ke backend:", error);
    throw error;
  }
}

// LOGOUT
export async function logoutUser(): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}