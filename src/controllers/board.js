const db = require("../db");

const list = async (req, res, next) => {
  let { page } = req.body; // page : 0-based idx
  let cnt = 5;
  let board = await db.query(
    "SELECT `id`, `title`, `content` FROM `board` ORDER BY `id` desc limit ?, ?",
    [Number(page) * cnt, Number(cnt)]
  );
  let ret = await Promise.all(
    board.map(async (elem) => {
      let [comment] = await db.query(
        "SELECT COUNT(*) as cnt_comment FROM `comment` WHERE `boardid` = ?",
        [Number(elem.id)]
      );
      let [like] = await db.query(
        "SELECT COUNT(*) as cnt_like FROM `like` WHERE `boardid` = ?",
        [Number(elem.id)]
      );
      return { ...elem, ...comment, ...like };
    })
  );
  return res.send(ret);
};

const search = async (req, res, next) => {
  let { query, page } = req.body; // page : 0-based idx
  let cnt = 5;
  let board = await db.query(
    "SELECT `id`, `title`, `content` FROM `board` WHERE `title` LIKE ? ORDER BY `id` desc limit ?, ?",
    ["%" + query + "%", Number(page) * cnt, Number(cnt)]
  );
  let ret = await Promise.all(
    board.map(async (elem) => {
      let [comment] = await db.query(
        "SELECT COUNT(*) as cnt_comment FROM `comment` WHERE `boardid` = ?",
        [Number(elem.id)]
      );
      let [like] = await db.query(
        "SELECT COUNT(*) as cnt_like FROM `like` WHERE `boardid` = ?",
        [Number(elem.id)]
      );
      return { ...elem, ...comment, ...like };
    })
  );
  return res.send(ret);
};

const write = async (req, res, next) => {
  let { title, content } = req.body;

  try {
    await db.query(
      "INSERT INTO `board` (`userid`, `title`, `content`) VALUES (?, ?, ?)",
      [req.id, title, content]
    );
  } catch (err) {
    return next(err);
  }

  return res.send("write success!");
};

const getUser = async (req, res, next) => {
  let { queryid } = req.body;
  let [user] = await db.query(
    "SELECT `username`, `profile` FROM `user` WHERE `id`=?",
    [queryid]
  );
  return res.send(user);
};

module.exports = { list, write, search, getUser };
