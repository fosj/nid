const { json } = require('body-parser');
const { Validator } = require('express-json-validator-middleware');
const publicationsService = require('../../services/publicationsService');

const validator = new Validator({ allErrors: true });

async function get(req, res) {
  try {
    const response = await publicationsService.listAll();

    return res.status(200)
      .json(response);
  } catch (err) {
    throw err;
  }
}

async function post(req, res) {
  try {
    const { body, protocol } = req;
    const hostname = req.get('host');

    const bucketName = await publicationsService.addMetadata(body);
    const publishUrl = `${protocol}://${hostname}/publications/${bucketName}/files`;

    return res.location(publishUrl)
      .status(200)
      .end();
  } catch (err) {
    throw err;
  }
}

const bodyValidator = validator.validate({
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
});

module.exports = {
  get,
  post: [
    json(),
    bodyValidator,
    post,
  ],
};
