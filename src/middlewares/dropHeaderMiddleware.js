const dropHeaderMiddleware = (req, res, next) => {
  res.removeHeader('x-powered-by');
  return next();
};

module.exports = dropHeaderMiddleware;
