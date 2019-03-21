const { Router } = require('express');
const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const files = require('./files');
const root = require('./root');

const router = Router();

router.get('/', asyncMiddleware(root.get));
router.post('/', asyncMiddleware(root.post));
router.get('/:bucketName/files', asyncMiddleware(files.get));
router.post('/:bucketName/files/*', asyncMiddleware(files.post));

module.exports = router;
