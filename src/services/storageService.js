const { constants, storage: { getParameters } } = require('../config');
const { Storage } = require('../dataaccess');

module.exports = Object.values(constants)
  .map(value => ({ [value]: new Storage(getParameters(value)) }))
  .reduce((previous, current) => Object.assign(previous, current), {});
