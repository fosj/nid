const { listAll } = require('../../services/datasetsService');

async function get(req, res) {
  const response = await listAll();

  return res.status(200)
    .json(response);
}

module.exports = {
  get,
};
