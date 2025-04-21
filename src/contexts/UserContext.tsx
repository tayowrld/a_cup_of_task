// src/contexts/UserContext.tsx
// ----------------------------
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuid } from "uuid";

export interface User {
  id: string;
  name: string;
  avatar: string;
}

interface UserContextValue {
  user: User | null;
  register: (name: string, avatar: string) => void;
  updateUser: (name: string, avatar: string) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const register = (name: string, avatar: string) => {
    const newUser: User = { id: uuid(), name, avatar };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const updateUser = (name: string, avatar: string) => {
    if (!user) return;
    const updated: User = { ...user, name, avatar };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{ user, register, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
};
