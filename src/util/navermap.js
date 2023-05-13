const fetch = require("node-fetch");

let page_uid = "",
  NNB = "";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const setNNB = async () => {
  let resp = await fetch("https://lcs.naver.com/m", {
    headers: {
      "user-agent": userAgent,
    },
  });
  NNB = resp.headers.raw()["set-cookie"].map((e) => e.split(";")[0])[0];
};
setNNB();

const getSearchResult = async (type, query, options = {}, retry = 5) => {
  try {
    let boundary = "";
    if (options?.boundary) {
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
      `https://map.naver.com/v5/api/search?caller=pcweb&lang=ko&${new URLSearchParams(
        {
          type,
          query,
          searchCoord: options?.coord
            ? `${options.coord.lng};${options.coord.lat}`
            : "",
          page: options?.page ?? 1,
          displayCount: options?.displayCount ?? 20,
          boundary,
        }
      )}`,
      {
        headers: {
          "user-agent": userAgent,
          cookie: [page_uid, NNB].join("; "),
        },
      }
    );
    page_uid = resp.headers.raw()["set-cookie"].map((e) => e.split(";")[0])[0];
    let json = await resp.json();
    return json;
  } catch (err) {
    if (retry === 1) throw err;
    page_uid = "";
    setNNB();
    await sleep(5000);
    return await getSearchResult(type, query, options, retry - 1);
  }
};

const getPlaceSearchResult = async (query, coord, options = {}) => {
  let json = await getSearchResult("place", query, { ...options, coord });
  return json.result?.place?.list ?? [];
};

const getAddressSearchResult = async (query, options = {}) => {
  let json = await getSearchResult("address", query, options);
  let address = json.result?.address;
  if (!address) return [];
  address = address.roadAddress ?? address.jibunsAddress;
  if (address.isExtendedSearch) return [];
  return address.list ?? [];
};

const getCoordFromAddress = async (query) => {
  let address = await getAddressSearchResult(query);
  if (!address.length) return false;

  let { x, y } = address[0];
  return { lat: y, lng: x };
};

const getPlaceDetail = async (place, retry = 5) => {
  try {
    let resp = await fetch(
      `https://map.naver.com/v5/api/sites/summary/${place}?lang=ko`,
      {
        headers: {
          "user-agent": userAgent,
          cookie: NNB,
        },
      }
    );
    let json = await resp.json();
    return json;
  } catch (err) {
    if (retry === 1) throw err;
    await sleep(5000);
    setNNB();
    return await getPlaceDetail(place, retry - 1);
  }
};

module.exports = {
  getPlaceSearchResult,
  getPlaceDetail,
  getCoordFromAddress,
};
