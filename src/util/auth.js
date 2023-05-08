const jwt = require("jsonwebtoken");
const { sha256 } = require("./hash");
const config = require("./config")

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
    try{
        return jwt.verify(token, config.AUTH.secretKey);
    } catch (err) {
        return false;
    }
}

module.exports = { genToken, verifyToken };
