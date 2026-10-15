import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export async function clearRedisCache() {
    return redis.flushdb();
}

redis.on("connect", () => {
    console.log("Redis client connected");
});

export default redis;