const express = require("express");
const cors = require("cors");
const { cacheGet, cacheSet, cacheDel } = require("./config/redis");

const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");
const { redirectToOriginal } = require("./controllers/urlController");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { authLimiter, apiLimiter, redirectLimiter } = require("./middleware/rateLimiter");

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/urls", apiLimiter, urlRoutes);

// Must stay AFTER /api routes
app.get("/:shortCode", redirectLimiter, redirectToOriginal);

app.use(notFound);
app.use(errorHandler);

module.exports = app;