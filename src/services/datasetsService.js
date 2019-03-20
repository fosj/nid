const { minio: { DATASETS } } = require('../config');
const { storage } = require('../dataaccess');

const instance = storage[DATASETS];

module.exports = instance;
