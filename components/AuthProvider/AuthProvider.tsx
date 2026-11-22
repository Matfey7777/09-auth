"use client";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await checkSession();
        const user = await getMe();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
};
