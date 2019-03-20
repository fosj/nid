const { minio: { PUBLICATIONS } } = require('../config');
const { storage } = require('../dataaccess');
const createStorageService = require('./createStorageService');

const instance = storage[PUBLICATIONS];

module.exports = {
  ...createStorageService(instance),
};
