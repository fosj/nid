module.exports = ({ service }) => {
  async function get(req, res) {
    try {
      const { params: { entity } } = req;

      const response = await service.listFiles(entity);

      res.status(200);
      return response.pipe(res);
    } catch (err) {
      throw err;
    }
  }

  async function deleteMethod(req, res) {
    try {
      const { params: { entity } } = req;

      await service.deleteMetadata(entity);

      return res.status(200).end();
    } catch (err) {
      throw err;
    }
  }

  return {
    delete: deleteMethod,
    get,
  };
};
