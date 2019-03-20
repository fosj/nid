const { minio: { DATASETS } } = require('../config');
const { storage } = require('../dataaccess');
const createStorageService = require('./createStorageService');

const instance = storage[DATASETS];

module.exports = {
  ...createStorageService(instance),
};
