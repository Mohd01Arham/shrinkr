const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: 1,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err.message));

// If Redis is down, the app still works (just without cache)
const cacheGet = async (key) => {
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

const cacheSet = async (key, value, seconds = 3600) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", seconds);
  } catch {}
};

const cacheDel = async (key) => {
  try {
    await redis.del(key);
  } catch {}
};

module.exports = { redis, cacheGet, cacheSet, cacheDel };