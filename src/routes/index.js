const { Router } = require('express');
const health = require('./health');

const router = Router();

router.use((req, res, next) => {
  res.removeHeader('x-powered-by');
  return next();
});

router.use('/health', health);

module.exports = router;
