const bcrypt = require("bcrypt");
const db = require("../db");
const { genToken, verifyToken } = require("../util/auth");
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

  let token = `Bearer ${genToken(user.id)}`;
  return res.json({ token }); // jwt
};

const register = async (req, res, next) => {
  let { name, phone, address, username, password } = req.body;
  try {
    await db.query(
      "INSERT INTO `user` (`name`, `phone`, `address`, `username`, `password`) VALUES (?, ?, ?, ?, ?)",
      [name, phone, address, username, await bcrypt.hash(password, 10)]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return next(new HttpException(400, { code: "ALREADY_REGISTERED" }));
    }
    return next(err);
  }

  let [user] = await db.query("SELECT `id` FROM `user` WHERE `username`=?", [
    username,
  ]);

  let token = `Bearer ${genToken(user.id)}`;
  return res.json({ token }); // jwt
};

const changeDB = async (req, res, next) => {
  let allowedVar = ["name", "username", "address", "profile", "phone"];
  // let { varient, new_data } = req.body;

  // if (!allowedVar.includes(varient)) {
  //   return next(new HttpException(400, { code: "PERMISSION_DENIED_VARIENT" }));
  // }

  // try {
  //   await db.query("UPDATE `user` SET ?? = ? WHERE `id` = ?", [
  //     varient,
  //     new_data,
  //     req.id,
  //   ]);
  // } catch (err) {
  //   return next(err);
  // }

  let datas = [];
  for (let i of allowedVar) {
    if (typeof req.body[i] === "string") {
      datas.push(i, req.body[i]);
    }
  }

  try {
    await db.query(
      "UPDATE `user` SET " +
        Array(keys.length).fill("?? = ?").join(", ") +
        "WHERE `id`=?",
      [...datas, req.id]
    );
  } catch (err) {
    return next(err);
  }

  return res.send("changeDB success!");
};

const changePW = async (req, res, next) => {
  let { password, new_password } = req.body;

  let [user] = await db.query("SELECT `password` FROM `user` WHERE `id`=?", [
    req.id,
  ]);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new HttpException(400, { code: "WRONG_PASSWORD" }));
  }

  await db.query("UPDATE `user` SET `password` = ? WHERE `id` = ?", [
    await bcrypt.hash(new_password, 10),
    req.id,
  ]);

  return res.send("changePW success!");
};

const getUser = async (req, res, next) => {
  let { queryid } = req.body;
  let [user] = await db.query("SELECT * FROM `user` WHERE `id`=?", [queryid]);
  return res.send(user);
};

module.exports = { login, register, changeDB, changePW, getUser };
