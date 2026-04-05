import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

let accessToken: string | null = null;

export const API_BASE_URLS = {
  user: process.env.NEXT_PUBLIC_API_USER_BASE_URL || "",
  blog: process.env.NEXT_PUBLIC_API_BLOG_BASE_URL || "",
  author: process.env.NEXT_PUBLIC_API_AUTHOR_BASE_URL || "",
} as const;

export type ApiService = keyof typeof API_BASE_URLS;

declare module "axios" {
  interface AxiosRequestConfig {
    service?: ApiService;
  }
}

type RequestConfigWithService = InternalAxiosRequestConfig & {
  service?: ApiService;
  _retry?: boolean;
};

export const setAxiosAccessToken = (token: string | null) => {
  accessToken = token;
};

export const isRequestCanceled = (error: unknown) =>
  axios.isCancel(error) ||
  (error instanceof Error && "code" in error && error.code === "ERR_CANCELED") ||
  (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: unknown }).status === "ERR_CANCELED"
  );

const AUTH_PAGES = new Set(["/Login", "/SignUp"]);

const api = axios.create({
  baseURL: API_BASE_URLS.user,
  timeout: 60000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const clearFrontendAuthState = () => {
  setAxiosAccessToken(null);

  if (typeof window !== "undefined") {
    document.cookie = "isAuth=; path=/; max-age=0; SameSite=Lax";
  }
};

api.interceptors.request.use(
  (config) => {
    const service = (config as RequestConfigWithService).service;
    const selectedBaseUrl = service ? API_BASE_URLS[service] : API_BASE_URLS.user;

    if (selectedBaseUrl) {
      config.baseURL = selectedBaseUrl;
    }

    config.headers["x-client-type"] = "web";
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    const originalRequest = error.config as
      | RequestConfigWithService
      | undefined;

    // If 401 and not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URLS.user}/refreshToken`,
          {},
          {
            withCredentials: true,
            headers: {
              "x-client-type": "web",
            },
          },
        );

        const newToken = res.data?.accessToken;

        if (newToken) {
          setAxiosAccessToken(newToken);
        }

        processQueue(null, newToken);

        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearFrontendAuthState();

        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          if (!AUTH_PAGES.has(path)) {
            window.location.href = "/Login";
          }
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message || "Something went wrong",
      status: error.response?.status,
      data: error.response?.data,
    });
  },
);

export default api;
