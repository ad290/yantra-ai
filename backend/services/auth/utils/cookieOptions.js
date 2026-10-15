const isProduction = process.env.NODE_ENV === "production";

export const refreshCookieName = "refreshToken";

export const getRefreshCookieOptions = () => ({
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
    path: process.env.REFRESH_COOKIE_PATH || "/api/auth",
    maxAge: Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7) * 1000,
});

export const clearRefreshCookieOptions = () => ({
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
    path: process.env.REFRESH_COOKIE_PATH || "/api/auth",
});
