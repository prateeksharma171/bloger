import api from "./axiosInstance";

export const signup = async (
  name: string,
  email: string,
  password: string,
) =>
  api.post("/signup", { name, email, password }, { service: "user" });

export const login = async (email: string, password: string) =>
  api.post("/login", { email, password }, { service: "user" });

export const refreshSession = async () =>
  api.post("/refreshToken", {}, { service: "user" });

export const logout = async () => api.post("/logout", {}, { service: "user" });

export const getCurrentUser = async () => api.get("/me", { service: "user" });
