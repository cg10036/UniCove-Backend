const db = require("../db");

const write = async (req, res, next) => {
  let { placeid, score, content } = req.body;
  try {
    await db.query(
      "INSERT INTO `review` (`userid`, `placeid`, `score`, `content`) VALUES (?, ?, ?, ?)",
      [req.id, placeid, score, content]
    );
  } catch (err) {
    return next(err);
  }
  return res.send("write success!");
};

const list = async (req, res, next) => {
  let { placeid, page } = req.body; // page : 0-based idx
  let cnt = 5;
  let board = await db.query(
    "SELECT `id`, `userid`, `score`, `content`, `created_time` FROM `review` WHERE `placeid` = ? ORDER BY `id` desc limit ?, ?",
    [placeid, Number(page) * cnt, Number(cnt)]
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
  return res.send(board);
};

module.exports = { write, list };
