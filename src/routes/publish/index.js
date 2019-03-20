const { Router } = require('express');
const root = require('./root');

const router = Router();

router.get('/', root);

module.exports = router;
