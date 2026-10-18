const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    url: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true, index: true },
    ip: String,
    userAgent: String,
    referrer: { type: String, default: "direct" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Click", clickSchema);