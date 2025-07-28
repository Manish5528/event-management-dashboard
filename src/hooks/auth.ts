const LOGGED_IN_USER_KEY = "loggedInUser";

export type StoredUser = {
  username: string;
  password: string;
};

export const getLoggedInUser = (): StoredUser | null => {
  const data = localStorage.getItem(LOGGED_IN_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setLoggedInUser = (user: StoredUser) => {
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
};

export const removeLoggedInUser = () => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
};
