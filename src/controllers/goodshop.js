const db = require("../db");

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
    "SELECT `id`, `name`, `industry_code` AS `industryCode`, `address`, `phone`, `info`, `lat`, `lng` FROM `goodshop` " +
      "WHERE (`lat` IS NOT NULL) " +
      (boundary
        ? "AND (`lat` BETWEEN ? AND ?) AND (`lng` BETWEEN ? AND ?) "
        : "") +
      "ORDER BY (POW((`lat` - ?) * 100000, 2) + POW((`lng` - ?) * 100000, 2)) ASC " +
      "LIMIT ?",
    [...lats, ...lngs, coord.lat, coord.lng, count]
  );

  return res.json(result);
};

module.exports = {
  find,
};
