export type UserRole = "owner" | "kasir" | "waitres";

export interface UserCredential {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const userCredentials: UserCredential[] = [
  {
    id: "u1",
    name: "Owner Nanyang",
    email: "owner@nanyang.com",
    password: "owner123",
    role: "owner",
  },
  {
    id: "u2",
    name: "Kasir Emil",
    email: "kasir@nanyang.com",
    password: "kasir123",
    role: "kasir",
  },
  {
    id: "u3",
    name: "Waitres Sarah",
    email: "waitres@nanyang.com",
    password: "waitres123",
    role: "waitres",
  },
];

export async function authenticateUser(
  email: string,
  password: string,
  role: UserRole,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = userCredentials.find(
    (user) =>
      user.email === normalizedEmail &&
      user.password === password &&
      user.role === role,
  );

  return new Promise<UserCredential | null>((resolve) => {
    setTimeout(() => {
      resolve(credential ?? null);
    }, 800);
  });
}
