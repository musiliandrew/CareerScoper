"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/api";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

let cachedUser: any | null = null;
let hasVerifiedSession = false;
let verifyPromise: Promise<any> | null = null;

export function useRequireAuth(redirectToLogin: boolean = true): AuthState {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(() => {
    return {
      isAuthenticated: hasVerifiedSession ? cachedUser !== null : false,
      isLoading: !hasVerifiedSession,
      user: hasVerifiedSession ? cachedUser : null,
    };
  });

  useEffect(() => {
    // If we already verified in this session (e.g. jumping between tabs), use the cache
    if (hasVerifiedSession) {
      if (authState.isLoading) {
        setAuthState({ isAuthenticated: cachedUser !== null, isLoading: false, user: cachedUser });
      }
      if (cachedUser === null && redirectToLogin) {
        router.replace("/login");
      }
      return;
    }

    let isMounted = true;

    async function verifyAuth() {
      try {
        if (!verifyPromise) {
          verifyPromise = fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me/`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Send the HttpOnly cookie
          }).then(async (res) => {
            if (!res.ok) throw new Error("Not authenticated");
            return res.json();
          });
        }

        const userData = await verifyPromise;
        cachedUser = userData;
        hasVerifiedSession = true;
        
        if (isMounted) {
          setAuthState({ isAuthenticated: true, isLoading: false, user: userData });
        }
      } catch (err) {
        console.warn("Auth verification status: unauthenticated");
        cachedUser = null;
        hasVerifiedSession = true;
        verifyPromise = null;
        if (isMounted) {
          setAuthState({ isAuthenticated: false, isLoading: false, user: null });
          if (redirectToLogin) {
            router.replace("/login");
          }
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [router, authState.isLoading, redirectToLogin]);

  return authState;
}

// Helper to completely clear the client session cache on logout
export function clearAuthCache() {
  cachedUser = null;
  hasVerifiedSession = false;
  verifyPromise = null;
}
