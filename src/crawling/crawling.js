const { getGoodShop } = require("../util/openapi");
const db = require("../db");
const { sha256 } = require("../util/hash");
const fs = require("fs");
const process = require("process");
const navermap = require("../util/navermap");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const disconnectDatabase = () => {
  db.connector.end();
};

const crawling = async () => {
  for (let data of await getGoodShop()) {
    for (let key of Object.keys(data)) {
      if (typeof data[key] === "string") {
        data[key] = data[key].trim();
      }
    }
    let {
      SH_ID: id,
      SH_NAME: name,
      INDUTY_CODE_SE: industryCode,
      SH_ADDR: address,
      SH_PHONE: phone,
      SH_INFO: info,
    } = data;
    let hash = sha256(JSON.stringify(data));
    let [shop] = await db.query(
      "SELECT `id`, `hash` FROM `goodshop` WHERE `id`=?",
      [id]
    );
    if (shop) {
      if (shop.hash === hash) continue;
      await db.query("DELETE FROM `goodshop` WHERE `id`=?", [id]);
    }
    await db.query(
      "INSERT INTO `goodshop` (`id`, `name`, `industry_code`, `address`, `phone`, `info`, `hash`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        name,
        industryCode,
        address,
        phone.length < 5 ? null : phone,
        info,
        hash,
      ]
    );
  }
};

const addLatLng = async () => {
  for (let { id, address } of await db.query(
    "SELECT `id`, `address` FROM `goodshop` WHERE `lat` IS NULL"
  )) {
    address = address.replace("서울특별시 서울특별시", "서울특별시");
    address = address.replace("서울특별시 서울시", "서울특별시");
    address = address.replace("서울특별시 서울", "서울특별시");
    process.stdout.write(address.padEnd(60, " ") + "\r");
    let result = await navermap.getCoordFromAddress(address);
    if (!result) {
      process.stdout.write("\n");
      continue;
    }
    let { lat, lng } = result;

    await db.query("UPDATE `goodshop` SET `lat`=?, `lng`=? WHERE `id`=?", [
      lat,
      lng,
      id,
    ]);
  }
};

const extractLatLngFromDatabase = async () => {
  let datas = await db.query(
    "SELECT * FROM `goodshop` WHERE `lat` IS NOT NULL"
  );
  fs.writeFileSync("./data.json", JSON.stringify(datas));
};

(async () => {
  // await crawling();
  // await addLatLng();
  // await extractLatLngFromDatabase();
  disconnectDatabase();
})();
