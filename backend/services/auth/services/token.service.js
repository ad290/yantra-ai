import crypto from "crypto";
import jwt from "jsonwebtoken";
import redis from "../../../shared/redis/redis.js";

const ACCESS_TTL_SECONDS = Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 60 * 15);
const REFRESH_TTL_SECONDS = Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7);
const REFRESH_PEPPER = process.env.REFRESH_TOKEN_PEPPER || process.env.ACCESS_TOKEN_SECRET || "dev-refresh-pepper";

const hashRefreshToken = (token) =>
    crypto.createHash("sha256").update(`${REFRESH_PEPPER}:${token}`).digest("hex");

const refreshKey = (hash) => `refresh:${hash}`;
const usedRefreshKey = (hash) => `refresh:used:${hash}`;
const familyTokensKey = (familyId) => `refresh-family:${familyId}:tokens`;
const familyRevokedKey = (familyId) => `refresh-family:${familyId}:revoked`;

export const signAccessToken = (user) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is not configured");
    }
    return jwt.sign(
        {
            sub: String(user._id),
            email: user.email,
            name: user.name,
            typ: "access",
        },
        secret,
        {
            expiresIn: ACCESS_TTL_SECONDS,
            jwtid: crypto.randomUUID(),
        }
    );
};

const storeRefreshToken = async ({ token, userId, familyId }) => {
    const hash = hashRefreshToken(token);
    const payload = JSON.stringify({ userId: String(userId), familyId });
    await redis.set(refreshKey(hash), payload, "EX", REFRESH_TTL_SECONDS);
    await redis.sadd(familyTokensKey(familyId), hash);
    await redis.expire(familyTokensKey(familyId), REFRESH_TTL_SECONDS);
    return hash;
};

export const createTokenPair = async (user) => {
    const accessToken = signAccessToken(user);
    const refreshToken = crypto.randomBytes(32).toString("base64url");
    const familyId = crypto.randomUUID();
    await storeRefreshToken({
        token: refreshToken,
        userId: user._id,
        familyId,
    });
    return { accessToken, refreshToken, familyId };
};

const revokeTokenFamily = async (familyId) => {
    await redis.set(familyRevokedKey(familyId), "1", "EX", REFRESH_TTL_SECONDS);
    const hashes = await redis.smembers(familyTokensKey(familyId));
    if (hashes.length) {
        const pipeline = redis.pipeline();
        for (const hash of hashes) {
            pipeline.del(refreshKey(hash));
        }
        pipeline.del(familyTokensKey(familyId));
        await pipeline.exec();
    }
};

const rotateRefreshToken = async ({ oldToken, record }) => {
    const oldHash = hashRefreshToken(oldToken);
    const newToken = crypto.randomBytes(32).toString("base64url");
    const newHash = await storeRefreshToken({
        token: newToken,
        userId: record.userId,
        familyId: record.familyId,
    });
    await redis.del(refreshKey(oldHash));
    await redis.srem(familyTokensKey(record.familyId), oldHash);
    await redis.set(usedRefreshKey(oldHash), record.familyId, "EX", REFRESH_TTL_SECONDS);
    return { refreshToken: newToken, newHash };
};

export const refreshSession = async (refreshToken) => {
    if (!refreshToken) {
        return { ok: false, reason: "missing" };
    }
    const hash = hashRefreshToken(refreshToken);
    const raw = await redis.get(refreshKey(hash));
    if (!raw) {
        const reusedFamilyId = await redis.get(usedRefreshKey(hash));
        if (reusedFamilyId) {
            await revokeTokenFamily(reusedFamilyId);
            return { ok: false, reason: "reuse" };
        }
        return { ok: false, reason: "invalid" };
    }
    const record = JSON.parse(raw);
    const familyRevoked = await redis.get(familyRevokedKey(record.familyId));
    if (familyRevoked) {
        return { ok: false, reason: "revoked" };
    }
    const { refreshToken: newRefreshToken } = await rotateRefreshToken({
        oldToken: refreshToken,
        record,
    });
    return { ok: true, userId: record.userId, refreshToken: newRefreshToken };
};

export const revokeRefreshToken = async (refreshToken) => {
    if (!refreshToken) return;
    const hash = hashRefreshToken(refreshToken);
    const raw = await redis.get(refreshKey(hash));
    if (!raw) return;
    const record = JSON.parse(raw);
    await revokeTokenFamily(record.familyId);
};
