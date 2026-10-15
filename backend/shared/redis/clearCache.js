import redis, { clearRedisCache } from "./redis.js";

try {
    const result = await clearRedisCache();
    console.log(`Redis cache cleared (${result}).`);
} catch (error) {
    console.error("Failed to clear Redis cache:", error.message);
    process.exitCode = 1;
} finally {
    await redis.quit();
}