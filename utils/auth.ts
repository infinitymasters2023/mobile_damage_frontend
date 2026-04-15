export interface User {
  name?: string;
  email: string;
  password?: string;
}

// Writes user data to browser storage
export const saveUser = (userData: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_node_data", JSON.stringify(userData));
  }
};

// Reads user data from browser storage
export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user_node_data");
    return data ? (JSON.parse(data) as User) : null;
  }
  return null;
};