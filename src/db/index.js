const mysql = require("mysql");
const db = {
  host: "127.0.0.1",
  port: 3306,
  user: "publicdata",
  password: "1234",
  database: "publicdata",
};

let connector;

const handleDisconnect = () => {
  connector = mysql.createConnection(db);

  connector.connect((err) => {
    if (err) {
      console.log("connect err: " + err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  connector.on("error", (err) => {
    console.log("db err: " + err);
    if (err.code == "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
};

handleDisconnect();

const query = (sql, arr = []) => {
  return new Promise((res, rej) => {
    connector.query(sql, arr, (err, rows, fields) => {
      if (err) return rej(err);
      res(rows);
    });
  });
};

module.exports = {
  connector,
  query,
};
