const datasetsService = require('../../services/datasetsService');

async function get(req, res) {
  try {
    const { params: { bucketName } } = req;

    const response = await datasetsService.listFiles(bucketName);

    res.status(200);
    return response.pipe(res);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  get,
};
