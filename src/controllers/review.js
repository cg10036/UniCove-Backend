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
  let review = await db.query(
    "SELECT `id`, `userid`, `score`, `content`, `created_time` FROM `review` WHERE `placeid` = ? ORDER BY `id` desc limit ?, ?",
    [placeid, Number(page) * cnt, Number(cnt)]
  );
  return res.send(review);
};

const avg = async (req, res, next) => {
  let { placeid } = req.body;
  let [ret] = await db.query(
    "SELECT ROUND(AVG(`score`), 1) as `avg` FROM `review` WHERE `placeid` = ?",
    [placeid]
  );
  return res.send(ret);
};

module.exports = { write, list, avg };
