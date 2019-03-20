const { Client } = require('minio');
const environment = require('./environment');

const DATASETS = 'datasets';
const PUBLICATIONS = 'publications';

const STORAGE = Object.freeze({
  [DATASETS]: {
    name: DATASETS,
    metadataLoc: `${DATASETS}-metadata`,
    client: new Client({
      endPoint: environment.get('datasetsEndpoint'),
      port: environment.get('datasetsPort'),
      accessKey: environment.get('datasetsAccessKey'),
      secretKey: environment.get('datasetsSecretKey'),
      useSSL: false,
    }),
  },
  [PUBLICATIONS]: {
    name: PUBLICATIONS,
    metadataLoc: `${PUBLICATIONS}-metadata`,
    client: new Client({
      endPoint: environment.get('publicationsEndpoint'),
      port: environment.get('publicationsPort'),
      accessKey: environment.get('publicationsAccessKey'),
      secretKey: environment.get('publicationsSecretKey'),
      useSSL: false,
    }),
  },
});

const getStorageClient = name => STORAGE[name];

module.exports = {
  DATASETS,
  PUBLICATIONS,
  getStorageClient,
};
