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
module.exports = { list, write, search };
