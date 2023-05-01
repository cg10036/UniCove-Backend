const crypto = require("crypto");

const sha256 = (content) =>
  crypto.createHash("sha256").update(content).digest("hex");

module.exports = { sha256 };
