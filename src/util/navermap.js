const fetch = require("node-fetch");

const getSearchResult = async (query, coord, options) => {
  let page = options.page ?? 1;
  let displayCount = options.displayCount ?? 20;
  let boundary = "";
  if (options.boundary) {
    let lats = [],
      lngs = [];
    options.boundary.forEach((e) => {
      lats.push(e.lat);
      lngs.push(e.lng);
    });
    boundary = [
      Math.min(...lngs),
      Math.min(...lats),
      Math.max(...lngs),
      Math.max(...lats),
    ].join(";");
  }
  let resp = await fetch(
    `https://map.naver.com/v5/api/search?caller=pcweb&type=place&lang=ko&${new URLSearchParams(
      {
        query,
        searchCoord: `${coord.lng};${coord.lat}`,
        page,
        displayCount,
        boundary,
      }
    )}`
  );
  let json = await resp.json();
  return json.result?.place?.list ?? [];
};

const getPlaceDetail = async (place) => {
  let resp = await fetch(
    `https://map.naver.com/v5/api/sites/summary/${place}?lang=ko`
  );
  let json = await resp.json();
  return json;
};

module.exports = {
  getSearchResult,
  getPlaceDetail,
};
