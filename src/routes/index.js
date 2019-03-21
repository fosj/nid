const { Router } = require('express');
const { constants, routes: { getParameters } } = require('../config');
const { dropHeaderMiddleware } = require('../middlewares');
const { storageService } = require('../services');
const createCommonRoutes = require('./common');
const health = require('./health');

module.exports = () => {
  const router = Router();

  router.use(dropHeaderMiddleware);
  router.use('/health', health);

  Object.values(constants)
    .map(value => ({ ...getParameters(value), service: storageService[value], path: `/${value}` }))
    .forEach(({ path, ...props }) => router.use(path, createCommonRoutes(props)));

  return router;
};
