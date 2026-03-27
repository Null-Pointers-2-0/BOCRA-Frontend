"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProfile, logout as apiLogout } from "@/lib/api/clients/auth";
import { getTokens, clearTokens } from "@/lib/api/client";
import type { User } from "@/lib/api/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const res = await getProfile();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
        clearTokens();
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
      }
    } catch {
      setUser(null);
      clearTokens();
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [router, pathname]);

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      const { accessToken } = getTokens();
      if (!accessToken) {
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
        return;
      }
      await refreshUser();
    }

    init().finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });

    return () => controller.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      clearTokens();
    }
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
