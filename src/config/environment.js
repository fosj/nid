const convict = require('convict');

module.exports = convict({
  logLevel: {
    doc: 'logging level',
    format: 'String',
    default: 'info',
    env: 'LOG_LEVEL',
  },
  port: {
    doc: 'port for API',
    format: 'port',
    default: 8000,
    env: 'PORT',
  },
});
