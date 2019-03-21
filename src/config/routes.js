const { DATASETS, PUBLICATIONS } = require('./constants');

const ROUTES = Object.freeze({
  [DATASETS]: {
    name: DATASETS,
    jsonSchema: {
      body: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            minLength: 3,
            maxLength: 30,
          },
          name: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            minLength: 3,
            maxLength: 30,
          },
        },
      },
    },
  },
  [PUBLICATIONS]: {
    name: PUBLICATIONS,
    jsonSchema: {
      body: {
        type: 'object',
        required: ['user', 'workflowId', 'executionTime'],
        properties: {
          user: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            minLength: 3,
            maxLength: 24,
          },
          workflowId: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            minLength: 3,
            maxLength: 24,
          },
          executionTime: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
});

const getParameters = kind => ROUTES[kind];

module.exports = {
  getParameters,
  ROUTES,
};
