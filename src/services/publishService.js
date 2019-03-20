const { minio: { PUBLICATIONS } } = require('../config');
const { storage } = require('../dataaccess');

const instance = storage[PUBLICATIONS];

module.exports = instance;
