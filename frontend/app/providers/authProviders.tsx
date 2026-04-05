"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { setAxiosAccessToken } from "../api/axiosInstance";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
  signup as signupRequest,
} from "../api/auth";
import type {
  AuthCredentials,
  AuthUser,
  SignupPayload,
} from "../context/authContext";

const setMiddlewareAuthCookie = () => {
  document.cookie = "isAuth=true; path=/; max-age=604800; SameSite=Lax";
};

const clearMiddlewareAuthCookie = () => {
  document.cookie = "isAuth=; path=/; max-age=0; SameSite=Lax";
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((nextToken: string | null, nextUser: AuthUser | null) => {
    setAccessToken(nextToken);
    setUser(nextUser);
    setAxiosAccessToken(nextToken);

    if (nextToken && nextUser) {
      setMiddlewareAuthCookie();
      return;
    }

    clearMiddlewareAuthCookie();
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await refreshSession();
      applySession(res.data?.accessToken ?? null, res.data?.user ?? null);
      return res.data?.accessToken ?? null;
    } catch {
      applySession(null, null);
      return null;
    }
  }, [applySession]);

  const login = async (credentials: AuthCredentials) => {
    const res = await loginRequest(credentials.email, credentials.password);
    const nextUser = res.data?.user as AuthUser | null;
    const nextToken = res.data?.accessToken ?? null;

    applySession(nextToken, nextUser);

    if (!nextUser) {
      throw new Error("User details were not returned by the server.");
    }

    return nextUser;
  };

  const signup = async (payload: SignupPayload) => {
    const res = await signupRequest(payload.name, payload.email, payload.password);
    const nextUser = res.data?.user as AuthUser | null;
    const nextToken = res.data?.accessToken ?? null;

    applySession(nextToken, nextUser);

    if (!nextUser) {
      throw new Error("User details were not returned by the server.");
    }

    return nextUser;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear local auth state even if the server session is already gone.
    }

    applySession(null, null);

    window.location.href = "/Login";
  };

  const initAuth = useCallback(async () => {
    try {
      const token = await refresh();

      if (!token) {
        return;
      }

      const me = await getCurrentUser();

      if (me.data?.user) {
        applySession(token, me.data.user as AuthUser);
      }
    } catch {
      applySession(null, null);
    } finally {
      setLoading(false);
    }
  }, [applySession, refresh]);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated: Boolean(accessToken && user),
        login,
        signup,
        logout,
        refresh,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
