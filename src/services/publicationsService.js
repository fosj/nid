const { storage: { PUBLICATIONS, getParameters } } = require('../config');
const { Storage } = require('../dataaccess');

module.exports = new Storage(getParameters(PUBLICATIONS));
