const { Router } = require('express');
const datasets = require('./datasets');
const health = require('./health');
const publish = require('./publish');

const router = Router();

router.use((req, res, next) => {
  res.removeHeader('x-powered-by');
  return next();
});

router.use('/datasets', datasets);
router.use('/health', health);
router.use('/publish', publish);

module.exports = router;
