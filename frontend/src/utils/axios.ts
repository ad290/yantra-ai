import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { BACKEND_API_URL } from "../constants";
import { clearAccessToken, getAccessToken, setAccessToken } from "../features/auth/token";

export const axiosInstance = axios.create({
    baseURL: BACKEND_API_URL,
    withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post<{ accessToken: string }>(`${BACKEND_API_URL}/auth/refresh`, {}, { withCredentials: true })
            .then((res) => {
                setAccessToken(res.data.accessToken);
                return res.data.accessToken;
            })
            .catch(() => {
                clearAccessToken();
                return null;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }
        const url = originalRequest.url || "";
        const isAuthRoute =
            url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/refresh") ||
            url.includes("/auth/logout");
        if (isAuthRoute || originalRequest._retry) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();
        if (!newToken) {
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
    }
);
