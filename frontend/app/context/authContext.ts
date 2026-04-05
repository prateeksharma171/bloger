"use client";

import { createContext, useContext } from "react";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupPayload = AuthCredentials & {
  name: string;
};

export type AuthContextType = {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
