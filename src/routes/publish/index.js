const { Router } = require('express');
const root = require('./root');

const router = Router();

router.get('/', root.get);
router.post('/', root.post);

module.exports = router;
