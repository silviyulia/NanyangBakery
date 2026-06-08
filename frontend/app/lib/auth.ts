export type UserRole = "owner" | "kasir" | "waitres";

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

//fungsi untuk login
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const res = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user as User;
}

//fungsi untuk register
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}): Promise<{ message: string; user_id: number } | null> {
  const res = await fetch("http://127.0.0.1:8000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) return null;

  return await res.json();
}
