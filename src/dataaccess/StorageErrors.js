class ErrorWithStatus extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
  }
}

class BadRequest extends ErrorWithStatus {
  constructor(message) {
    super(message, 400);
  }
}

class InternalError extends ErrorWithStatus {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = {
  BadRequest,
  InternalError,
};
