const { HttpException } = require("../util/exception");
const navermap = require("../util/navermap");
const db = require("../db");

const find = async (req, res, next) => {
  let { coord, boundary, count, only24 } = req.body;
  if (typeof count === "undefined") count = 100;
  if (count > 100 || count <= 0) {
    return next(
      new HttpException(400, {
        code: "COUNT_RANGE_ERROR",
        detail: "Count range must be 1~100",
      })
    );
  }

  let result = await navermap.getPlaceSearchResult("카페", coord, {
    boundary,
    displayCount: count,
  });

  result = result.map(
    ({
      id,
      name,
      address,
      tel,
      virtualTel,
      y: lat,
      x: lng,
      businessStatus,
      thumUrl: img,
      menuInfo: menu,
    }) => {
      let status = businessStatus?.status;
      let businessHours = businessStatus?.businessHours || null;
      if (businessHours) {
        businessHours = businessHours
          .split("~")
          .map((e) => {
            e = e.slice(8);
            return `${e.slice(0, 2)}:${e.slice(2)}`;
          })
          .join("~");
      }
      return {
        id: Number(id),
        name,
        address,
        phone: tel || virtualTel,
        lat: Number(lat),
        lng: Number(lng),
        is24: status?.code === 8,
        info: businessHours,
        img,
        menu,
      };
    }
  );

  result.forEach(
    async ({ id, name, address, phone, lat, lng, is24, info, img, menu }) => {
      await db.query(
        "INSERT INTO nightstudy (`id`, `name`, `address`, `phone`, `lat`, `lng`, `is24`, `info`, `img`, `menu`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `name`=?, `address`=?, `phone`=?, `lat`=?, `lng`=?, `is24`=?, `info`=?, `img`=?, `menu`=?",
        [
          id,
          name,
          address,
          phone,
          lat,
          lng,
          is24,
          info,
          img,
          menu,
          name,
          address,
          phone,
          lat,
          lng,
          is24,
          info,
          img,
          menu,
        ]
      );
    }
  );

  for (let i = 0; i < result.length; i++) {
    let [like] = await db.query(
      "SELECT `id` FROM `nightstudy_like` WHERE `nightstudy_id`=? AND `user_id`=?",
      [result[i].id, req.id]
    );
    result[i].like = !!like;
  }

  if (only24) {
    result = result.filter((e) => e.is24);
  }

  return res.json(result);
};

const getLike = async (req, res, next) => {
  let data = await db.query(
    "SELECT `nightstudy`.`id`, `name`, `address`, `phone`, `lat`, `lng`, `is24`, `info`, `img`, `menu`, '1' AS `like` FROM `nightstudy_like` LEFT JOIN `nightstudy` ON `nightstudy_like`.`nightstudy_id`=`nightstudy`.`id` WHERE `nightstudy`.`id` IS NOT NULL AND `user_id`=?",
    [req.id]
  );
  return res.json(data);
};

const like = async (req, res, next) => {
  let { id } = req.body;
  try {
    await db.query(
      "INSERT INTO `nightstudy_like` (`nightstudy_id`, `user_id`) values (?, ?)",
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
    "DELETE FROM `nightstudy_like` WHERE `nightstudy_id`=? AND `user_id`=?",
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
    "SELECT `id` FROM `nightstudy_like` WHERE `nightstudy_id`=? AND `user_id`=?",
    [id, req.id]
  );
  if (like) {
    await db.query(
      "DELETE FROM `nightstudy_like` WHERE `nightstudy_id`=? AND `user_id`=?",
      [id, req.id]
    );
  } else {
    try {
      await db.query(
        "INSERT INTO `nightstudy_like` (`nightstudy_id`, `user_id`) values (?, ?)",
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
    "SELECT ROUND(AVG(`score`), 1) as `score` FROM `nightstudy_review` WHERE `nightstudy_id`=?",
    [id]
  );
  let reviews = await db.query(
    "SELECT `user_id`, `name`, `profile`, `score`, `created_time` AS `createdTime`, `content` FROM `nightstudy_review` LEFT JOIN `user` ON `user`.`id`=`nightstudy_review`.`user_id` WHERE `nightstudy_id`=?",
    [id]
  );
  res.send({ score, reviews });
};

const addReview = async (req, res, next) => {
  let { id, score, content } = req.body;
  if (Number.parseInt(score) !== score || score < 1 || score > 5) {
    return next(new HttpException(400, { code: "WRONG_SCORE" }));
  }
  try {
    await db.query(
      "INSERT INTO `nightstudy_review` (`nightstudy_id`, `user_id`, `score`, `content`) VALUES (?, ?, ?, ?)",
      [id, req.id, score, content]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return next(new HttpException(400, { code: "ALREADY_REVIEWED" }));
    }
    return next(err);
  }
  return res.status(204).send("");
};

const delReview = async (req, res, next) => {
  let { id } = req.body;
  try {
    await db.query(
      "DELETE FROM `nightstudy_review` WHERE `nightstudy_id`=? AND `user_id`=?",
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
