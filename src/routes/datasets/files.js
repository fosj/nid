const datasetsService = require('../../services/datasetsService');

async function get(req, res) {
  try {
    const { params: { entity } } = req;

    const response = await datasetsService.listFiles(entity);

    res.status(200);
    return response.pipe(res);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  get,
};
