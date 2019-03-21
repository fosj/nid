const { Router } = require('express');
const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const files = require('./files');
const filesAny = require('./filesAny');
const root = require('./root');

const router = Router();

router.get('/', asyncMiddleware(root.get));
router.post('/', asyncMiddleware(root.post));
router.get('/:bucketName/files', asyncMiddleware(files.get));
router.get('/:bucketName/files/*', asyncMiddleware(filesAny.get));
router.put('/:bucketName/files/*', asyncMiddleware(filesAny.put));

module.exports = router;
