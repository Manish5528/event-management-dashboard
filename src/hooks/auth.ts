import { StoredUser } from "@/types/user";

const LOGGED_IN_USER_KEY = "loggedInUser";

export const getLoggedInUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null; 
  const data = localStorage.getItem(LOGGED_IN_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setLoggedInUser = (user: StoredUser) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
  }
};

export const removeLoggedInUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
  }
};
