const { HttpException } = require("../util/exception");
const navermap = require("../util/navermap");

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

  if (only24) {
    result = result.filter((e) => e.businessStatus?.status?.code === 8);
  }

  return res.json(result);
};

module.exports = {
  find,
};
