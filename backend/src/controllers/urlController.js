const { cacheGet, cacheSet, cacheDel } = require("../config/redis");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const Click = require("../models/Click");

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

// POST /api/urls  (protected)
exports.createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ message: "Enter a valid http/https URL" });
    }

    let url;
    for (let i = 0; i < 5; i++) {
      try {
        url = await Url.create({
          originalUrl,
          shortCode: nanoid(7),
          user: req.userId,
        });
        break;
      } catch (err) {
        if (err.code !== 11000) throw err; // retry only on duplicate code
      }
    }

    if (!url) {
      return res.status(500).json({ message: "Could not generate short code, try again" });
    }

    res.status(201).json({
      id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    });
  } catch (err) {
    next(err);
  }
};

// GET /:shortCode  (public)
// GET /:shortCode  (public)
exports.redirectToOriginal = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const key = `url:${shortCode}`;

    let data = await cacheGet(key);
    const hit = !!data;

    if (!data) {
      const url = await Url.findOne({ shortCode });
      if (!url) {
        return res.status(404).json({ message: "Short URL not found" });
      }
      data = { id: url._id.toString(), originalUrl: url.originalUrl };
      await cacheSet(key, data);
    }

    // Save stats in background, user doesn't wait
    Url.updateOne({ _id: data.id }, { $inc: { clicks: 1 } }).catch((e) =>
      console.error("Click count failed:", e.message)
    );
    Click.create({
      url: data.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer || "direct",
    }).catch((e) => console.error("Click save failed:", e.message));

    res.set("X-Cache", hit ? "HIT" : "MISS");
    res.redirect(302, data.originalUrl);
  } catch (err) {
    next(err);
  }
};

// GET /api/urls  (protected)
exports.getMyUrls = async (req, res, next) => {
  try {
    const urls = await Url.find({ user: req.userId }).sort({ createdAt: -1 });

    res.json(
      urls.map((u) => ({
        id: u._id,
        originalUrl: u.originalUrl,
        shortCode: u.shortCode,
        shortUrl: `${process.env.BASE_URL}/${u.shortCode}`,
        clicks: u.clicks,
        createdAt: u.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/urls/:id/analytics  (protected)
exports.getAnalytics = async (req, res, next) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, user: req.userId });
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [clicksPerDay, topReferrers] = await Promise.all([
      Click.aggregate([
        { $match: { url: url._id, createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Click.aggregate([
        { $match: { url: url._id } },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      totalClicks: url.clicks,
      clicksPerDay: clicksPerDay.map((d) => ({ date: d._id, count: d.count })),
      topReferrers: topReferrers.map((r) => ({ referrer: r._id, count: r.count })),
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/urls/:id  (protected)
// DELETE /api/urls/:id  (protected)
exports.deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    await Click.deleteMany({ url: url._id });
    await cacheDel(`url:${url.shortCode}`);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};