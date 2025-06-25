// context/UserContext.tsx
"use client";
import { createContext, useState, useEffect, useContext } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
  gender?: string;
}

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: decoded.name,
          email: decoded.email,
          avatar: decoded.avatar,
          gender: decoded.gender || "other",
        });
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
