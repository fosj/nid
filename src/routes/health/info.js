const { getInfo } = require('../../services/infoService');

function get(req, res) {
  return res.status(200)
    .json(getInfo());
}

module.exports = {
  get,
};
