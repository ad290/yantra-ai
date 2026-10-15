import asyncHandler from "express-async-handler";
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
} from "../services/auth.service.js";
import {
    clearRefreshCookieOptions,
    getRefreshCookieOptions,
    refreshCookieName,
} from "../utils/cookieOptions.js";

const setRefreshCookie = (res, refreshToken) => {
    res.cookie(refreshCookieName, refreshToken, getRefreshCookieOptions());
};

const clearRefreshCookie = (res) => {
    res.clearCookie(refreshCookieName, clearRefreshCookieOptions());
};

export const register = asyncHandler(async (req, res) => {
    const result = await registerUser(req.validated);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
        message: result.message,
    });
});

export const login = asyncHandler(async (req, res) => {
    const result = await loginUser(req.validated);
    setRefreshCookie(res, result.refreshToken);
    res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
        message: result.message,
    });
});

export const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[refreshCookieName];
    try {
        const result = await refreshAccessToken(refreshToken);
        setRefreshCookie(res, result.refreshToken);
        res.status(200).json({
            accessToken: result.accessToken,
            message: result.message,
        });
    } catch (error) {
        clearRefreshCookie(res);
        throw error;
    }
});

export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[refreshCookieName];
    const result = await logoutUser(refreshToken);
    clearRefreshCookie(res);
    res.status(200).json(result);
});
