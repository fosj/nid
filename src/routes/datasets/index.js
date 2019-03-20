const { Router } = require('express');
const root = require('./root');

const router = Router();

router.get('/', root.get);

module.exports = router;
