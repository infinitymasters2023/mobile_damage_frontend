export const saveUser = (user: {
  name: string;
  email: string;
  password: string;
}) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const isUserRegistered = () => {
  return localStorage.getItem("user") !== null;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};