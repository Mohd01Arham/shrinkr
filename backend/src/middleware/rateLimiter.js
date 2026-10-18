const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { redis } = require("../config/redis");

const makeLimiter = (prefix, windowMs, max, message) =>
  rateLimit({
    windowMs,
    limit: max,
    standardHeaders: true,
    legacyHeaders: false,
    passOnStoreError: true, // if Redis is down, don't block users
    message: { message },
    store: new RedisStore({
      prefix: `rl:${prefix}:`,
      sendCommand: (...args) => redis.call(...args),
    }),
  });

// Login/register: 10 tries per 15 min
const authLimiter = makeLimiter("auth", 15 * 60 * 1000, 10, "Too many attempts, try again after 15 minutes");

// Other API calls: 100 per 15 min
const apiLimiter = makeLimiter("api", 15 * 60 * 1000, 100, "Too many requests, slow down");

// Redirects: per minute, per IP
const redirectLimiter = makeLimiter(
  "redirect",
  60 * 1000,
  Number(process.env.REDIRECT_LIMIT) || 300,
  "Too many requests, slow down"
);

module.exports = { authLimiter, apiLimiter, redirectLimiter };