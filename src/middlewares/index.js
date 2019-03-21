const asyncMiddleware = require('./asyncMiddleware');
const dropHeaderMiddleware = require('./dropHeaderMiddleware');
const errorMiddleware = require('./errorMiddleware');

module.exports = {
  asyncMiddleware,
  dropHeaderMiddleware,
  errorMiddleware,
};
