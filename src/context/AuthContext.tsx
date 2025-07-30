"use client";

import { getLoggedInUser, setLoggedInUser } from "@/hooks/auth";
import { StoredUser } from "@/types/user";
import { API_ROUTES } from "@/constants/apiRoutes";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextType = {
  user: StoredUser | null;
  login: (emailAddress: string, password: string) => Promise<boolean>;
  signup: (
    username: string,
    password: string,
    emailAddress: string
  ) => Promise<boolean>;
  setUser: React.Dispatch<React.SetStateAction<StoredUser | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  useEffect(() => {
    const savedUser = getLoggedInUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (
    emailAddress: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(API_ROUTES.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAddress, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const safeUser: StoredUser = {
        username: data.user.username,
        emailAddress: data.user.emailAddress,
      };
      setLoggedInUser(safeUser);
      setUser(safeUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (
    username: string,
    password: string,
    emailAddress: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(API_ROUTES.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, emailAddress }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const safeUser: StoredUser = {
        username: data.user.username,
        emailAddress: data.user.emailAddress,
      };
      setLoggedInUser(safeUser);
      setUser(safeUser);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
