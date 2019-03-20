const { minio } = require('../config');
const Storage = require('./Storage');

const { DATASETS, PUBLICATIONS, getStorageClient } = minio;

module.exports = {
  storage: {
    [DATASETS]: new Storage(getStorageClient(DATASETS)),
    [PUBLICATIONS]: new Storage(getStorageClient(PUBLICATIONS)),
  },
};
