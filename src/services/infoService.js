const { environment } = require('../config');

const getInfo = () => JSON.parse(environment.toString());

module.exports = {
  getInfo,
};
