const { json } = require('body-parser');
const { Validator } = require('express-json-validator-middleware');

module.exports = (props) => {
  const { name, jsonSchema, service } = props;
  const { validate } = new Validator({ allErrors: true });

  async function get(req, res) {
    try {
      const response = await service.listAll();

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

      const entity = await service.addMetadata(body);
      const publishUrl = `${protocol}://${hostname}/${name}/${entity}/`;

      return res.location(publishUrl)
        .status(200)
        .end();
    } catch (err) {
      throw err;
    }
  }

  return {
    get,
    post: [
      json(),
      validate(jsonSchema),
      post,
    ],
  };
};

