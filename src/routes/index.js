const { Router } = require('express');
const datasets = require('./datasets');
const dropHeaderMiddleware = require('../middlewares/dropHeaderMiddleware');
const health = require('./health');
const publications = require('./publications');

const router = Router();

router.use(dropHeaderMiddleware);
router.use('/datasets', datasets);
router.use('/health', health);
router.use('/publications', publications);

module.exports = router;
