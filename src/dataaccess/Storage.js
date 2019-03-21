const { Client } = require('minio');
const { zip } = require('lodash');
// const Promise = require('bluebird');
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
      const name = this._metadataToName(metadata);

      const bucketExists = await this._client.bucketExists(name);

      if (bucketExists) {
        const bucketMetadata = await this.listAll();

        if (!bucketMetadata.includes(({ id }) => id === metadata.id)) {
          throw new StorageErrors.BadRequest('Duplicated id values, new id must be unique.');
        }
      }

      this._logger.info(`creating bucket (${name})`);
      await this._client.makeBucket(name);

      return name;
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

  // listFiles(id)) {}

  // createIngressStream(id, filename) {}

  // createEgressStream(id, filename) {}
}
/* eslint-enable no-underscore-dangle */

module.exports = Storage;
