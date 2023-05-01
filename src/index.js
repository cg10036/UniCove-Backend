const express = require("express");
const cors = require("cors");

const {
  addCustomAsyncErrorHandler,
  errorHandler,
} = require("./util/errorHandler");
const router = require("./routes");

addCustomAsyncErrorHandler();
const app = express();

app.use(cors());
app.use(
  express.json({
    limit: "100mb",
  })
);
app.use("/api", router);

app.use(errorHandler);

app.listen(8080, () => console.log("listening!"));
