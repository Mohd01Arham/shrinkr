const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createShortUrl,
  getMyUrls,
  getAnalytics,
  deleteUrl,
} = require("../controllers/urlController");

const router = express.Router();

router.use(protect);

router.post("/", createShortUrl);
router.get("/", getMyUrls);
router.get("/:id/analytics", getAnalytics);
router.delete("/:id", deleteUrl);

module.exports = router;