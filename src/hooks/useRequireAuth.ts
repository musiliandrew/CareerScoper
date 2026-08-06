"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/api";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

export function useRequireAuth(): AuthState {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (!token) {
      setAuthState({ isAuthenticated: false, isLoading: false, user: null });
      router.replace("/login");
      return;
    }

    let isMounted = true;

    async function verifyAuth() {
      try {
        const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          if (isMounted) {
            setAuthState({ isAuthenticated: true, isLoading: false, user: userData });
          }
        } else {
          // Any non-200 response (401, 403, 404, 500, etc.) invalidates session
          console.warn(`Auth verification failed (${res.status}) - clearing session and redirecting.`);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          if (isMounted) {
            setAuthState({ isAuthenticated: false, isLoading: false, user: null });
            router.replace("/login");
          }
        }
      } catch (err) {
        console.error("Auth verification network error:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (isMounted) {
          setAuthState({ isAuthenticated: false, isLoading: false, user: null });
          router.replace("/login");
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return authState;
}
