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

const comment_del = async (req, res, next) => {
  let { commentid } = req.body;
  let ret = await db.query("DELETE FROM `comment` WHERE `id` = ?", [commentid]);

  if (ret.affectedRows == 0) {
    return next(new HttpException(400, { code: "DELETE_FAILED" }));
  }
  return res.send("delete comment success!");
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

  content.is_me = !!(content.userid == req.id);

  let islike = await db.query(
    "SELECT * FROM `like` WHERE `boardid` = ? AND `userid` = ?",
    [boardid, req.id]
  );

  let comment = await db.query(
    "SELECT `comment`.`id`, `userid`, `boardid`, `content`, `created_time`, `user`.`name`, `user`.`profile` FROM `comment` LEFT JOIN `user` ON `comment`.`userid`=`user`.`id` WHERE `boardid` = ?",
    [boardid]
  );

  comment = await Promise.all(
    comment.map(async (elem) => {
      let is_me = !!(elem.userid == req.id);
      return { ...elem, is_me };
    })
  );

  let [like] = await db.query(
    "SELECT COUNT(*) as cnt_like FROM `like` WHERE `boardid` = ?",
    [boardid]
  );

  content = {
    ...content,
    is_like: !!islike.length,
    cnt_comment: comment.length,
    ...like,
  };
  return res.send({ content, comment });
};

const del = async (req, res, next) => {
  let { boardid } = req.body;
  let [content] = await db.query(
    "SELECT `userid` FROM `board` WHERE `id` = ?",
    [boardid]
  );

  if (content.userid != req.id) {
    return next(new HttpException(400, { code: "INVAILD_ID" }));
  }

  await db.query("DELETE FROM `board` WHERE `id` = ?", [boardid]);
  await db.query("DELETE FROM `comment` WHERE `boardid` = ?", [boardid]);
  await db.query("DELETE FROM `like` WHERE `boardid` = ?", [boardid]);
  return res.send("delete article success!");
};

module.exports = { comment, comment_del, like, unlike, read, del };
