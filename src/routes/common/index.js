const { Router } = require('express');
const { asyncMiddleware } = require('../../middlewares');
const createFilesPath = require('./files');
const createFilesNestedPath = require('./filesNested');
const createRootPath = require('./root');

module.exports = (props) => {
  const router = Router();

  const root = createRootPath(props);
  const filesPath = createFilesPath(props);
  const filesNestedPath = createFilesNestedPath(props);

  router.get('/', asyncMiddleware(root.get));
  router.post('/', asyncMiddleware(root.post));
  router.delete('/:entity/', asyncMiddleware(filesPath.delete));
  router.get('/:entity/', asyncMiddleware(filesPath.get));
  router.delete('/:entity/*', asyncMiddleware(filesNestedPath.delete));
  router.get('/:entity/*', asyncMiddleware(filesNestedPath.get));
  router.put('/:entity/*', asyncMiddleware(filesNestedPath.put));

  return router;
};
