const { Router } = require('express');
const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const root = require('./root');

const router = Router();

router.get('/', asyncMiddleware(root.get));
router.post('/', asyncMiddleware(root.post));

module.exports = router;
