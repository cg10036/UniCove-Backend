const fetch = require("node-fetch");

const getSearchResult = async (type, query, options = {}) => {
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
    )}`
  );
  let json = await resp.json();
  return json;
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

const getPlaceDetail = async (place) => {
  let resp = await fetch(
    `https://map.naver.com/v5/api/sites/summary/${place}?lang=ko`
  );
  let json = await resp.json();
  return json;
};

module.exports = {
  getPlaceSearchResult,
  getPlaceDetail,
  getCoordFromAddress,
};
