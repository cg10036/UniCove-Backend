const jwt = require("jsonwebtoken");
const { sha256 } = require("./hash");
const config = require("./config");
const { HttpException } = require("./exception");

const genToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    config.AUTH.secretKey,
    {
      expiresIn: "30d",
    }
  );
};

const verifyToken = async (token) => {
  try {
    if (!token || typeof token !== "string") return false;
    if (token.includes(" ")) {
      token = token.split(" ")[1];
    }
    return jwt.verify(token, config.AUTH.secretKey);
  } catch (err) {
    return false;
  }
};

const authMiddleware = (req, res, next) => {
  if (req.id) return next();
  throw new HttpException(401, { code: "Unauthorized" });
};

const verifyTokenMiddleware = async (req, res, next) => {
  let data = await verifyToken(req.headers.authorization);
  if (data) req.id = data.id;
  return next();
};

module.exports = {
  genToken,
  verifyToken,
  authMiddleware,
  verifyTokenMiddleware,
};
