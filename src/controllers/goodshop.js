const db = require("../db");

const find = async (req, res, next) => {
  let { boundary } = req.body;
  let lats = [],
    lngs = [];
  boundary.forEach((e) => {
    lats.push(e.lat);
    lngs.push(e.lng);
  });
  lats = lats.sort();
  lngs = lngs.sort();

  let result = await db.query(
    "SELECT `id`, `name`, `industry_code` AS `industryCode`, `address`, `phone`, `info`, `lat`, `lng` FROM `goodshop` WHERE `lat` IS NOT NULL AND `lat`>=? AND `lat`<=? AND `lng`>=? AND `lng`<=?",
    [...lats, ...lngs]
  );

  return res.json(result);
};

module.exports = {
  find,
};
