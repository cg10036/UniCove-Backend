const { sha256 } = require("./hash");
const { HttpException } = require("./exception");
const Layer = require("express/lib/router/layer.js");

const addCustomAsyncErrorHandler = () => {
  if (
    sha256(Layer.prototype.handle_request.toString().replace(/\s+/g, " ")) !==
    "8d8db5a0f72db8745f084a9d2d352d7ff7b61589b4e91871e1aef7e6ca5d7889"
  ) {
    throw new Error(
      "Layer.prototype.handle_request function changed! Custom async handler will not work."
    );
  }
  Layer.prototype.handle_request = function handle(req, res, next) {
    let fn = this.handle;

    if (fn.length > 3) {
      // not a standard request handler
      return next();
    }

    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (err) {
      next(err);
    }
  };
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    res.status(err.status);
    if (typeof err.message === "string") {
      return res.send(err.message);
    }
    return res.json(err.message);
  }
  //   if (err instanceof ValidationError) {
  //     return res
  //       .status(400)
  //       .send({ code: "VALIDATION_ERROR", errors: err.errors });
  //   }
  if (
    err instanceof SyntaxError &&
    err.type === "entity.parse.failed" &&
    err.message.indexOf("JSON") !== -1
  ) {
    return res.status(400).send({
      code: "JSON_PARSE_FAILED",
      detail:
        "Failed to parse json. Please make sure your json syntax is correct",
    });
  }
  console.log(err);
  if (res.headersSent) {
    return res.end();
  }
  return res.status(500).send("");
};

module.exports = {
  addCustomAsyncErrorHandler,
  errorHandler,
};
