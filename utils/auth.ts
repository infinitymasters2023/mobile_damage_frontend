// utils/auth.ts

// 1. You must export the interface so other files can see it
export interface User {
  name: string;
  email: string;
  password?: string; // Optional if not always required
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};