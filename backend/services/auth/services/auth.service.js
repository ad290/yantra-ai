import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import { toPublicUser } from "../utils/userPublic.js";
import { createTokenPair, refreshSession, revokeRefreshToken, signAccessToken } from "./token.service.js";

const BCRYPT_ROUNDS = 12;
const INVALID_CREDENTIALS = "Invalid email or password";

export const registerUser = async ({ name, email, password }) => {
    const existing = await UserModel.findOne({ email });
    if (existing) {
        const err = new Error("Email is already registered");
        err.statusCode = 409;
        throw err;
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await UserModel.create({
        name,
        email,
        passwordHash,
    });
    const { accessToken, refreshToken } = await createTokenPair(user);
    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken,
        message: "User registered successfully",
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await UserModel.findOne({ email }).select("+passwordHash");
    if (!user) {
        const err = new Error(INVALID_CREDENTIALS);
        err.statusCode = 401;
        throw err;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        const err = new Error(INVALID_CREDENTIALS);
        err.statusCode = 401;
        throw err;
    }
    const { accessToken, refreshToken } = await createTokenPair(user);
    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken,
        message: "User logged in successfully",
    };
};

export const refreshAccessToken = async (refreshToken) => {
    const result = await refreshSession(refreshToken);
    if (!result.ok) {
        const err = new Error("Invalid or expired refresh token");
        err.statusCode = 401;
        throw err;
    }
    const user = await UserModel.findById(result.userId);
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 401;
        throw err;
    }
    const accessToken = signAccessToken(user);
    return {
        accessToken,
        refreshToken: result.refreshToken,
        message: "Token refreshed successfully",
    };
};

export const logoutUser = async (refreshToken) => {
    await revokeRefreshToken(refreshToken);
    return { message: "User logged out successfully" };
};
