const moment = require('moment');
const { DATASETS, PUBLICATIONS } = require('./constants');
const environment = require('./environment');

const STORAGE = Object.freeze({
  [DATASETS]: {
    name: DATASETS,
    metadataFields: ['id', 'name'],
    client: {
      endPoint: environment.get('datasetsEndpoint'),
      port: environment.get('datasetsPort'),
      accessKey: environment.get('datasetsAccessKey'),
      secretKey: environment.get('datasetsSecretKey'),
    },
  },
  [PUBLICATIONS]: {
    name: PUBLICATIONS,
    metadataFields: ['user', 'workflowId', 'executionTime'],
    metadataParsers: [
      {
        name: 'executionTime',
        toString: val => moment.utc(val).unix(),
        fromString: val => moment.unix(val).toISOString(),
      },
    ],
    client: {
      endPoint: environment.get('publicationsEndpoint'),
      port: environment.get('publicationsPort'),
      accessKey: environment.get('publicationsAccessKey'),
      secretKey: environment.get('publicationsSecretKey'),
    },
  },
});

const getParameters = kind => STORAGE[kind];

module.exports = {
  getParameters,
  STORAGE,
};
