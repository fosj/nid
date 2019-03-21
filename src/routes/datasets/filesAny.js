const datasetsService = require('../../services/datasetsService');

async function get(req, res) {
  try {
    const { params: { bucketName, 0: filename } } = req;

    const response = await datasetsService.createEgressStream(bucketName, filename);

    res.status(200);
    return response.pipe(res);
  } catch (err) {
    throw err;
  }
}

async function put(req, res) {
  try {
    const { params: { bucketName, 0: filename } } = req;
    const size = req.get('content-length');
    const type = req.get('content-type');

    await datasetsService.createIngressStream(bucketName, filename, req, size, type);

    return res.status(201)
      .end();
  } catch (err) {
    throw err;
  }
}

module.exports = {
  get,
  put,
};
