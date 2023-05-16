const db = require("../db");

const list = async (req, res, next) => {
  let { page } = req.body; // page : 0-based idx
  let cnt = 5;
  let board = await db.query(
    "SELECT `id`, `title`, `content`, `cnt_like` FROM `board` ORDER BY `id` desc limit ?, ?",
    [Number(page) * cnt, Number(cnt)]
  );
  let ret = await Promise.all(
    board.map(async (elem) => {
      let [comment] = await db.query(
        "SELECT COUNT(*) as cnt_comment FROM `comment` WHERE `boardid` = ?",
        [Number(elem.id)]
      );
      return { ...elem, ...comment };
    })
  );
  return res.send(ret);
};

const search = async (req, res, next) => {
  let { query, page } = req.body; // page : 0-based idx
  let cnt = 5;
  let board = await db.query(
    "SELECT `id`, `title`, `content`, `cnt_like` FROM `board` WHERE `title` LIKE ? ORDER BY `id` desc limit ?, ?",
    ["%" + query + "%", Number(page) * cnt, Number(cnt)]
  );
  let ret = await Promise.all(
    board.map(async (elem) => {
      let [comment] = await db.query(
        "SELECT COUNT(*) as cnt_comment FROM `comment` WHERE `boardid` = ?",
        [Number(elem.id)]
      );
      return { ...elem, ...comment };
    })
  );
  return res.send(ret);
};

const write = async (req, res, next) => {
  let { title, content } = req.body;

  try {
    await db.query(
      "INSERT INTO `board` (`userid`, `title`, `content`, `cnt_like`) VALUES (?, ?, ?, 0)",
      [req.id, title, content]
    );
  } catch (err) {
    return next(err);
  }

  return res.send("write success!");
};

///// article Controller /////

const article = {};

article.comment = async (req, res, next) => {
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

article.like = async (req, res, next) => {
  let { boardid } = req.body;
  await db.query("UPDATE board SET cnt_like = cnt_like+1 WHERE `id` = ?", [
    boardid,
  ]);
  return res.send("like success!");
};

article.unlike = async (req, res, next) => {
  let { boardid } = req.body;
  await db.query("UPDATE board SET cnt_like = cnt_like-1 WHERE `id` = ?", [
    boardid,
  ]);
  return res.send("lunlike success!");
};

article.read = async (req, res, next) => {
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

module.exports = {
  list,
  write,
  search,
  article,
};
