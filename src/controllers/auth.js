const bcrypt = require("bcrypt");
const db = require("../db");
const { genToken, verifyToken } = require("../util/auth")
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

  let token = `Bearer ${genToken(user.id, password)}`;
  return res.json({ token }); // jwt
  return res.send("login success!");
};

const register = async (req, res, next) => {
  let { name, nickname, phone, address, username, password } = req.body;
  //console.log(req.body);
  try {
    await db.query(
      "INSERT INTO `user` (`name`, `nickname`, `phone`, `address`, `username`, `password`) VALUES (?, ?, ?, ?, ?, ?)",
      [name, nickname, phone, address, username, await bcrypt.hash(password, 10)]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return next(new HttpException(400, { code: "ALREADY_REGISTERED" }));
    }
    return next(err);
  }

  let [user] = await db.query(
    "SELECT `id` FROM `user` WHERE `username`=?",
    [username]
  );

  let token = `Bearer ${genToken(user.id,password)}`;
  return res.json({ token }); // jwt
  return res.send("register success!");
};

const changeDB = async (req, res, next) => {
  let allowedVar = ["name", "nickname", "username", "address"];
  let { token, varient, new_data } = req.body;
  let {id} = await verifyToken(token);

  if(!allowedVar.includes(varient)){
    return next(new HttpException(400, { code: "PERMISSION_DENIED_VARIENT" }));
  }

  try {
    await db.query(
      "UPDATE `user` SET ?? = ? WHERE `id` = ?",
      [varient,new_data,id]
    );
  } catch (err) {
    return next(err);
  }
  
  return res.send("changeDB success!");
}

const changePW = async (req, res, next) => {
  let {token, password, new_password} = req.body;

  let {id} = await verifyToken(token);

  let [user] = await db.query(
    "SELECT `password` FROM `user` WHERE `id`=?",
    [id]
  );
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new HttpException(400, { code: "WRONG_PASSWORD" }));
  }

  await db.query(
    "UPDATE `user` SET `password` = ? WHERE `id` = ?",
    [await bcrypt.hash(new_password, 10), id]
  );

  return res.send("changePW success!");
}

module.exports = { login, register, changeDB, changePW };
