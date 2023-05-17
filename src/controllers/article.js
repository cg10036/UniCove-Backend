const db = require("../db");

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
  await db.query("UPDATE board SET cnt_like = cnt_like+1 WHERE `id` = ?", [
    boardid,
  ]);
  return res.send("like success!");
};

const unlike = async (req, res, next) => {
  let { boardid } = req.body;
  await db.query("UPDATE board SET cnt_like = cnt_like-1 WHERE `id` = ?", [
    boardid,
  ]);
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

  content = { ...content, cnt_comment: comment.length };
  return res.send({ content, comment });
};

module.exports = { comment, like, unlike, read };
