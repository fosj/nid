const { listAll } = require('../../services/datasetsService');

async function rootHandler(req, res) {
  const response = await listAll();

  return res.status(200)
    .json(response);
}

module.exports = rootHandler;
