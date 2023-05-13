const fetch = require("node-fetch");
const config = require("./config");
const navermap = require("./navermap");

const getGoodShop = async (start = 1, arr = []) => {
  let resp = await fetch(
    `http://openAPI.seoul.go.kr:8088/${
      config.AUTH.openapiKey
    }/json/ListPriceModelStoreService/${start}/${start + 999}`
  );
  let { ListPriceModelStoreService: json } = await resp.json();
  if (!json?.row) return arr;
  return await getGoodShop(start + 1000, [...arr, ...json.row]);
};

module.exports = {
  getGoodShop,
};
