module.exports = ({ service }) => {
  async function get(req, res) {
    try {
      const { params: { entity, 0: filename } } = req;

      const response = await service.createEgressStream(entity, filename);

      res.status(200);
      return response.pipe(res);
    } catch (err) {
      throw err;
    }
  }

  async function put(req, res) {
    try {
      const { params: { entity, 0: filename } } = req;
      const size = req.get('content-length');
      const type = req.get('content-type');

      await service.createIngressStream(entity, filename, req, size, type);

      return res.status(201)
        .end();
    } catch (err) {
      throw err;
    }
  }

  async function deleteMethod(req, res) {
    try {
      const { params: { entity, 0: filename } } = req;

      await service.deleteFile(entity, filename);

      return res.status(200).end();
    } catch (err) {
      throw err;
    }
  }

  return {
    delete: deleteMethod,
    get,
    put,
  };
};
