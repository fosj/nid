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
  datasetsEndpoint: {
    doc: 'endpoint for datasets minio storage',
    format: 'url',
    default: 'localhost',
    env: 'DATASETS_MINIO_ENDPOINT',
  },
  datasetsPort: {
    doc: 'port for datasets minio storage',
    format: 'port',
    default: 9000,
    env: 'DATASETS_MINIO_PORT',
  },
  datasetsAccessKey: {
    doc: 'access key for datasets minio storage',
    format: 'String',
    default: 'accessKey',
    env: 'DATASETS_MINIO_ACCESS_KEY',
    sensitive: true,
  },
  datasetsSecretKey: {
    doc: 'secret key for datasets minio storage',
    format: 'String',
    default: 'secretKey',
    env: 'DATASETS_MINIO_SECRET_KEY',
    sensitive: true,
  },
  publicationsEndpoint: {
    doc: 'endpoint for publication minio storage',
    format: 'url',
    default: 'localhost',
    env: 'PUBLICATIONS_MINIO_ENDPOINT',
  },
  publicationsPort: {
    doc: 'port for publication minio storage',
    format: 'port',
    default: 9000,
    env: 'PUBLICATIONS_MINIO_PORT',
  },
  publicationsAccessKey: {
    doc: 'access key for publication minio storage',
    format: 'String',
    default: 'accessKey',
    env: 'PUBLICATIONS_MINIO_ACCESS_KEY',
    sensitive: true,
  },
  publicationsSecretKey: {
    doc: 'secret key for publication minio storage',
    format: 'String',
    default: 'secretKey',
    env: 'PUBLICATIONS_MINIO_SECRET_KEY',
    sensitive: true,
  },
});
