const bcrypt = require("bcrypt");
const db = require("../db");
const { HttpException } = require("../util/exception");

const login = async (req, res, next) => {
  let { username, password } = req.body;
  let [user] = await db.query(
    "SELECT `id`, `password` FROM `user` WHERE `username`=?",
    [username]
  );
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new HttpException(400, { code: "WRONG_USERNAME_OR_PASSWORD" }));
  }

  //   let token = `Bearer ${genToken(id)}`;
  //   return res.json({ token }); // jwt
  return res.send("login success!");
};
const register = async (req, res, next) => {
  let { username, password } = req.body;
  try {
    await db.query(
      "INSERT INTO `user` (`username`, `password`) VALUES (?, ?)",
      [username, await bcrypt.hash(password, 10)]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return next(new HttpException(400, { code: "ALREADY_REGISTERED" }));
    }
    return next(err);
  }

  //   let token = `Bearer ${genToken(id)}`;
  //   return res.json({ token }); // jwt
  return res.send("register success!");
};

module.exports = { login, register };
