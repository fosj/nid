const { storage: { DATASETS, getParameters } } = require('../config');
const { Storage } = require('../dataaccess');

module.exports = new Storage(getParameters(DATASETS));
