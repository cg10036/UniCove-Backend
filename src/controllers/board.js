const db = require("../db");

const list = async (req, res, next) => {
  let { page } = req.query; // page : 0-based idx
  if (!page) page = 1;

  let [num] = await db.query(
    "SELECT FLOOR((COUNT(*)-1)/10)+1 AS `cnt_article` FROM `board`"
  );
  let board = await db.query(
    "SELECT `id`, `title`, `content`, `created_time` FROM `board` ORDER BY `id` desc limit ?, 10",
    [(Number(page) - 1) * 10]
  );
  let list = await Promise.all(
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
  return res.send({ ...num, list });
};

const search = async (req, res, next) => {
  let { query, page } = req.query; // page : 0-based idx
  if (!page) page = 1;
  let [num] = await db.query(
    "SELECT FLOOR((COUNT(*)-1)/10)+1 AS `cnt_article` FROM `board` WHERE `title` LIKE ?",
    ["%" + query + "%"]
  );
  let board = await db.query(
    "SELECT `id`, `title`, `content`, `created_time` FROM `board` WHERE `title` LIKE ? ORDER BY `id` desc limit ?, 10",
    ["%" + query + "%", (Number(page) - 1) * 10]
  );
  let list = await Promise.all(
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
  return res.send({ ...num, list });
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
  let { queryid } = req.query;
  let [user] = await db.query(
    "SELECT `username`, `profile` FROM `user` WHERE `id`=?",
    [queryid]
  );
  return res.send(user);
};

module.exports = { list, write, search, getUser };
