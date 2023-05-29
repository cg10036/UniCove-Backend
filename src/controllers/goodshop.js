const db = require("../db");
const { HttpException } = require("../util/exception");

const find = async (req, res, next) => {
  let { coord, boundary, count } = req.body;
  if (typeof count === "undefined") count = 100;
  if (count > 100 || count <= 0) {
    return next(
      new HttpException(400, {
        code: "COUNT_RANGE_ERROR",
        detail: "Count range must be 1~100",
      })
    );
  }

  let lats = [],
    lngs = [];
  boundary?.forEach((e) => {
    lats.push(e.lat);
    lngs.push(e.lng);
  });
  lats = lats.sort();
  lngs = lngs.sort();

  let result = await db.query(
    "SELECT `id`, `name`, `address`, `phone`, `info`, `lat`, `lng` FROM `goodshop` " +
      "WHERE (`lat` IS NOT NULL) " +
      (boundary
        ? "AND (`lat` BETWEEN ? AND ?) AND (`lng` BETWEEN ? AND ?) "
        : "") +
      "ORDER BY (POW((`lat` - ?) * 100000, 2) + POW((`lng` - ?) * 100000, 2)) ASC " +
      "LIMIT ?",
    [...lats, ...lngs, coord.lat, coord.lng, count]
  );

  for (let i = 0; i < result.length; i++) {
    let [like] = await db.query(
      "SELECT `id` FROM `goodshop_like` WHERE `goodshop_id`=? AND `user_id`=?",
      [result[i].id, req.id]
    );
    result[i].like = !!like;
  }

  return res.json(result);
};

const getLike = async (req, res, next) => {
  let data = await db.query(
    "SELECT `goodshop`.`id`, `name`, `address`, `phone`, `lat`, `lng`, `info`, `img`, `menu`, '1' AS `like` FROM `goodshop_like` LEFT JOIN `goodshop` ON `goodshop_like`.`goodshop_id`=`goodshop`.`id` WHERE `goodshop`.`id` IS NOT NULL AND `user_id`=?",
    [req.id]
  );
  return res.json(data);
};

const like = async (req, res, next) => {
  let { id } = req.body;
  try {
    await db.query(
      "INSERT INTO `goodshop_like` (`goodshop_id`, `user_id`) values (?, ?)",
      [id, req.id]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return next(new HttpException(400, { code: "ALREADY_LIKED" }));
    }
    return next(err);
  }
  return res.status(204).send("");
};

const unlike = async (req, res, next) => {
  let { id } = req.body;
  let ret = await db.query(
    "DELETE FROM `goodshop_like` WHERE `goodshop_id`=? AND `user_id`=?",
    [id, req.id]
  );
  if (!ret.affectedRows) {
    return next(new HttpException(400, { code: "ALREADY_UNLIKED" }));
  }
  return res.status(200).send("");
};

const toggleLike = async (req, res, next) => {
  let { id } = req.body;
  let [like] = await db.query(
    "SELECT `id` FROM `goodshop_like` WHERE `goodshop_id`=? AND `user_id`=?",
    [id, req.id]
  );
  if (like) {
    await db.query(
      "DELETE FROM `goodshop_like` WHERE `goodshop_id`=? AND `user_id`=?",
      [id, req.id]
    );
  } else {
    try {
      await db.query(
        "INSERT INTO `goodshop_like` (`goodshop_id`, `user_id`) values (?, ?)",
        [id, req.id]
      );
    } catch (err) {
      if (err.code !== "ER_DUP_ENTRY") {
        return next(err);
      }
    }
  }
  return res.json({ like: !like });
};

const getReviews = async (req, res, next) => {
  let { id } = req.query;
  if (!id) {
    return next(new HttpException(400, { code: "BAD_ID" }));
  }
  let [{ score }] = await db.query(
    "SELECT ROUND(AVG(`score`), 1) as `score` FROM `goodshop_review` WHERE `goodshop_id`=?",
    [id]
  );
  let reviews = await db.query(
    "SELECT `user_id`, `name`, `profile`, `score`, `created_time` AS `createdTime`, `content` FROM `goodshop_review` LEFT JOIN `user` ON `user`.`id`=`goodshop_review`.`user_id` WHERE `goodshop_id`=?",
    [id]
  );
  res.send({ score, reviews });
};

const addReview = async (req, res, next) => {
  let { id, score, content } = req.body;
  if (Number.parseInt(score) !== score || score < 1 || score > 5) {
    return next(new HttpException(400, { code: "WRONG_SCORE" }));
  }
  await db.query(
    "INSERT INTO `goodshop_review` (`goodshop_id`, `user_id`, `score`, `content`) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE `score`=?, `content`=?",
    [id, req.id, score, content, score, content]
  );
  return res.status(204).send("");
};

const delReview = async (req, res, next) => {
  let { id } = req.body;
  try {
    await db.query(
      "DELETE FROM `goodshop_review` WHERE `goodshop_id`=? AND `user_id`=?",
      [id, req.id]
    );
  } catch (err) {
    if (ret.affectedRows == 0) {
      return next(new HttpException(400, { code: "ALREADY_DELETED" }));
    }
    return next(err);
  }
  return res.status(200).send("");
};

module.exports = {
  find,
  getLike,
  like,
  unlike,
  toggleLike,
  getReviews,
  addReview,
  delReview,
};
