"use client";

import { StoredUser } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: StoredUser | null;
  setUser: (user: StoredUser | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("sp-user");
    const accessToken = localStorage.getItem("sp-access-token");

    if (!storedUser || !accessToken) {
      const encodedPath = encodeURIComponent(pathname);
      router.push(`/auth/signin?redirect=${encodedPath}`);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid stored user:", error);
      // router.push(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
