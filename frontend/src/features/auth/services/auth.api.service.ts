import { axiosInstance } from "../../../utils/axios";
import { clearAccessToken, setAccessToken } from "../token";
import type { AuthResponse, UserType } from "../types";

type TokenAuthResponse = AuthResponse & { accessToken: string };

const loginService = async (email: string, password: string): Promise<TokenAuthResponse> => {
    const res = await axiosInstance.post<TokenAuthResponse>("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    return res.data;
};

const registerService = async (
    name: string,
    email: string,
    password: string
): Promise<TokenAuthResponse> => {
    const res = await axiosInstance.post<TokenAuthResponse>("/auth/register", { name, email, password });
    setAccessToken(res.data.accessToken);
    return res.data;
};

const refreshService = async (): Promise<string | null> => {
    try {
        const res = await axiosInstance.post<{ accessToken: string }>("/auth/refresh", {});
        setAccessToken(res.data.accessToken);
        return res.data.accessToken;
    } catch {
        clearAccessToken();
        return null;
    }
};

const getMeService = async (): Promise<UserType> => {
    const res = await axiosInstance.get<UserType>("/me");
    return res.data;
};

const logoutService = async (): Promise<void> => {
    try {
        await axiosInstance.post("/auth/logout", {});
    } finally {
        clearAccessToken();
    }
};

export { loginService, registerService, refreshService, getMeService, logoutService };
