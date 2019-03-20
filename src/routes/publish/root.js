const { Validator } = require('express-json-validator-middleware');
const uuid = require('uuid/v4');
const { listAll, addMetadata } = require('../../services/publishService');

const validator = new Validator({ allErrors: true });

async function get(req, res) {
  try {
    const response = await listAll();

    return res.status(200)
      .json(response);
  } catch (err) {
    throw err;
  }
}

async function post(req, res) {
  try {
    const { body: { id, ...rest }, protocol } = req;
    const publishId = id || uuid();
    const publishUrl = `${protocol}://${req.get('host')}/publish/${publishId}`;
    await addMetadata(publishId, rest);

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
    required: ['name'],
    properties: {
      id: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
    },
  },
});

module.exports = {
  get,
  post: [
    bodyValidator,
    post,
  ],
};
