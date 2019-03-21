const { Client } = require('minio');
const { zip } = require('lodash');
const { Transform } = require('stream');
const { logger } = require('../config');
const StorageErrors = require('./StorageErrors');

/* eslint-disable no-underscore-dangle */
class Storage {
  constructor({ name, client, metadataFields, metadataParsers }) {
    this._client = new Client({ ...client, useSSL: false });
    this.addMetadata = this.addMetadata.bind(this);
    this.listAll = this.listAll.bind(this);
    this._createLogger(name);
    this._createMetadataMethods(metadataFields, metadataParsers);
  }

  _createLogger(name) {
    const createLogWriter = logWriter => message => logWriter(`<${name}> ${message}`);

    this._logger = {
      debug: createLogWriter(logger.debug),
      error: createLogWriter(logger.error),
      info: createLogWriter(logger.info),
      warn: createLogWriter(logger.warn),
    };
  }

  _createMetadataMethods(fields, parsers = []) {
    function metadataToName(metadata) {
      return fields.map((field) => {
        const parser = parsers.find(({ name }) => name === field);
        let value = metadata[field];

        if (parser) {
          value = parser.toString(value);
        }

        return value;
      })
        .join('.');
    }

    function nameToMetadata(bucketName) {
      return zip(fields, bucketName.split('.'))
        .filter(([field]) => field)
        .reduce((previous, [field, currentValue]) => {
          const parser = parsers.find(({ name }) => name === field);
          let value = currentValue;

          if (parser) {
            value = parser.fromString(value);
          }

          return Object.assign(previous, { [field]: value });
        }, {});
    }

    this._metadataToName = metadataToName;
    this._nameToMetadata = nameToMetadata;
  }

  async addMetadata(metadata) {
    try {
      this._logger.debug(JSON.stringify(metadata));
      const bucketName = this._metadataToName(metadata);

      const bucketExists = await this._client.bucketExists(bucketName);

      if (bucketExists) {
        const bucketMetadata = await this.listAll();

        if (!bucketMetadata.includes(({ id }) => id === metadata.id)) {
          throw new StorageErrors.BadRequest('Duplicated id values, new id must be unique.');
        }
      }

      this._logger.info(`creating bucket (${bucketName})`);
      await this._client.makeBucket(bucketName);

      return bucketName;
    } catch (err) {
      throw err;
    }
  }

  async listAll() {
    try {
      const nameToMetadata = this._nameToMetadata;
      const buckets = await this._client.listBuckets();

      this._logger.debug('retrieving metadata');
      return buckets.map(({ name, creationDate }) => ({ creationDate, ...nameToMetadata(name) }));
    } catch (err) {
      throw err;
    }
  }

  async listFiles(bucketName) {
    try {
      const bucketExists = await this._client.bucketExists(bucketName);

      if (!bucketExists) {
        throw new StorageErrors.NotFound(`Storage not found (${bucketName})`);
      }

      this._logger.debug(`retrieving file list from bucket "${bucketName}"`);
      const itemStream = this._client.listObjects(bucketName, '', true);

      let first = true;
      const toJson = new Transform({
        objectMode: true,
        transform(item, _, callback) {
          let transformedItem = JSON.stringify({ ...item, etag: undefined });
          if (first) {
            this.push('[');
            first = false;
          } else {
            transformedItem = `, ${transformedItem}`;
          }

          return callback(null, transformedItem);
        },
        flush(callback) {
          if (first) {
            return callback(null, '[]');
          }

          return callback(null, ']');
        },
      });

      itemStream.pipe(toJson);

      return toJson;
    } catch (err) {
      throw err;
    }
  }

  async createIngressStream(bucketName, filename, readStream, size, type) {
    try {
      this._logger.debug(JSON.stringify({ bucketName, filename, size, type }));
      const bucketExists = await this._client.bucketExists(bucketName);

      if (!bucketExists) {
        throw new StorageErrors.NotFound(`Storage not found (${bucketName})`);
      }

      this._logger.info(`creating object (${bucketName}/${filename})`);

      return this._client.putObject(bucketName, filename, readStream, size, { type });
    } catch (err) {
      throw err;
    }
  }

  // createEgressStream(bucketName, filename) {}
}
/* eslint-enable no-underscore-dangle */

module.exports = Storage;
