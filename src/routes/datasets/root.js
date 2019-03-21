const { json } = require('body-parser');
const { Validator } = require('express-json-validator-middleware');
const datasetsService = require('../../services/datasetsService');

const validator = new Validator({ allErrors: true });

async function get(req, res) {
  try {
    const response = await datasetsService.listAll();

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

    const entity = await datasetsService.addMetadata(body);
    const publishUrl = `${protocol}://${hostname}/datasets/${entity}/`;

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
});

module.exports = {
  get,
  post: [
    json(),
    bodyValidator,
    post,
  ],
};
