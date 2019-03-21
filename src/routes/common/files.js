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

  return { get };
};
