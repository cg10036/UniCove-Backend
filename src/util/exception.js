class HttpException extends Error {
  status;
  message;
  constructor(status, message) {
    super(typeof message === "string" ? message : "");
    this.status = status;
    this.message = message;
  }
}

module.exports = {
  HttpException,
};
