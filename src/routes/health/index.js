const { Router } = require('express');
const info = require('./info');
const readiness = require('./readiness');

const router = Router();

router.get('/info', info);
router.get('/readiness', readiness);

module.exports = router;
