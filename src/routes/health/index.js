const { Router } = require('express');
const info = require('./info');
const readiness = require('./readiness');

const router = Router();

router.get('/info', info.get);
router.get('/readiness', readiness.get);

module.exports = router;
