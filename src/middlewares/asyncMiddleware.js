const singleAsyncMiddleware = fn => (req, res, next) => Promise.resolve(fn(req, res, next))
  .catch(next);

const asyncMiddleware = (wrap) => {
  if (Array.isArray(wrap)) {
    return wrap.map(singleAsyncMiddleware);
  }

  return singleAsyncMiddleware(wrap);
};

module.exports = asyncMiddleware;
