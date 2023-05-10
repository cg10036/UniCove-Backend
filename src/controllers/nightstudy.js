const { HttpException } = require("../util/exception");
const navermap = require("../util/navermap");

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

  let result = await navermap.getPlaceSearchResult("카페", coord, {
    boundary,
    displayCount: count,
  });
  return res.json(result);
};

module.exports = {
  find,
};
