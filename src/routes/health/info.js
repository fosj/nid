const { getInfo } = require('../../services/infoService');

function infoHandler(req, res) {
  return res.status(200)
    .json(getInfo());
}

module.exports = infoHandler;
