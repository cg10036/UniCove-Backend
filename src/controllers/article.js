const db = require("../db");
const { HttpException } = require("../util/exception");

const comment = async (req, res, next) => {
  let { boardid, content } = req.body;
  try {
    await db.query(
      "INSERT INTO `comment` (`userid`, `boardid`, `content`) VALUES (?, ?, ?)",
      [req.id, boardid, content]
    );
  } catch (err) {
    return next(err);
  }
  return res.send("comment success!");
};

const like = async (req, res, next) => {
  let { boardid } = req.body;
  try {
    await db.query("INSERT INTO `like` (`userid`, `boardid`) VALUES (?, ?)", [
      req.id,
      boardid,
    ]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return next(new HttpException(400, { code: "ALREADY_LIKED" }));
    }
    return next(err);
  }
  return res.send("like success!");
};

const unlike = async (req, res, next) => {
  let { boardid } = req.body;
  let ret = await db.query(
    "DELETE FROM `like` WHERE `userid` = ? AND `boardid` = ?",
    [req.id, boardid]
  );

  if (ret.affectedRows == 0) {
    return next(new HttpException(400, { code: "ALREADY_UNLIKED" }));
  }
  return res.send("unlike success!");
};

const read = async (req, res, next) => {
  let { boardid } = req.body;

  let [content] = await db.query("SELECT * FROM `board` WHERE `id` = ?", [
    boardid,
  ]);
  let comment = await db.query("SELECT * FROM `comment` WHERE `boardid` = ?", [
    boardid,
  ]);

  let [like] = await db.query(
    "SELECT COUNT(*) as cnt_like FROM `like` WHERE `boardid` = ?",
    [Number(elem.id)]
  );

  content = { ...content, cnt_comment: comment.length, ...like };
  return res.send({ content, comment });
};

module.exports = { comment, like, unlike, read };