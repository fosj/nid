const { ValidationError } = require('express-json-validator-middleware');
const { logger } = require('../config');

const errorMiddleware = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err instanceof ValidationError) {
    return res.status(400).json(err);
  }

  if (!err.status || err.status === 500) {
    logger.error(err.message || JSON.stringify(err));
    return res.status(500).json({ message: 'Error accessing API' });
  }

  const { message, status } = err;

  return res.status(status).json({ message, status });
};

module.exports = errorMiddleware;
