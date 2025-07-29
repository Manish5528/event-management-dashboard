"use client";

import {
  getLoggedInUser,
  removeLoggedInUser,
  setLoggedInUser,
} from "@/hooks/auth";
import { API_ROUTES } from "@/utils/route";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  username: string;
  emailAddress: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (emailAddress: string, password: string) => Promise<boolean>;
  signup: (
    username: string,
    password: string,
    emailAddress: string
  ) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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
      setLoggedInUser(data.user);
      setUser(data.user);
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
      setLoggedInUser(data.user);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    removeLoggedInUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
