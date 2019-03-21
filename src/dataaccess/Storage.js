const { Client } = require('minio');
const { zip } = require('lodash');
const { Transform } = require('stream');
const { logger } = require('../config');
const StorageErrors = require('./StorageErrors');

/* eslint-disable no-underscore-dangle */
class Storage {
  constructor({ name, client, metadataFields, metadataParsers }) {
    this._client = new Client({ ...client, useSSL: false });
    this._name = name;
    this.addMetadata = this.addMetadata.bind(this);
    this.createEgressStream = this.createEgressStream.bind(this);
    this.createIngressStream = this.createIngressStream.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.deleteMetadata = this.deleteMetadata.bind(this);
    this.listAll = this.listAll.bind(this);
    this.listFiles = this.listFiles.bind(this);
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

    function nameToMetadata(entity) {
      return zip(fields, entity.split('.'))
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

  _collectFiles(entity) {
    const itemStream = this._client.listObjects(entity, '', true);

    return new Promise((resolve, reject) => {
      const items = [];

      itemStream.on('data', item => items.push(item));
      itemStream.on('error', err => reject(err));
      itemStream.on('end', () => resolve(items));
    });
  }

  async addMetadata(metadata) {
    try {
      this._logger.debug(JSON.stringify(metadata));
      const metadataId = this._metadataToName(metadata);

      const exists = await this._client.bucketExists(metadataId);

      if (exists) {
        const metadataList = await this.listAll();
        const idExists = metadataList.map(({ id }) => id).includes(metadata.id);

        if (idExists) {
          throw new StorageErrors.BadRequest('Duplicated id values, new id must be unique.');
        }
      }

      this._logger.info(`creating bucket (${metadataId})`);
      await this._client.makeBucket(metadataId);

      return metadataId;
    } catch (err) {
      throw err;
    }
  }

  async deleteMetadata(entity) {
    try {
      this._logger.debug(JSON.stringify({ entity }));
      const exists = await this._client.bucketExists(entity);

      if (!exists) {
        throw new StorageErrors.NotFound(`Storage not found (${entity})`);
      }

      const files = await this._collectFiles(entity);
      await Promise.all(files.map(({ name }) => this.deleteFile(entity, name)));

      this._logger.info(`deleting bucket (${entity})`);
      return this._client.removeBucket(entity);
    } catch (err) {
      throw err;
    }
  }

  async listAll() {
    try {
      const nameToMetadata = this._nameToMetadata;
      const entities = await this._client.listBuckets();

      this._logger.debug('retrieving metadata');
      return entities.map(({ name, creationDate }) => ({
        creationDate,
        location: `${this._name}/${name}`,
        ...nameToMetadata(name),
      }));
    } catch (err) {
      throw err;
    }
  }

  async listFiles(entity) {
    try {
      const exists = await this._client.bucketExists(entity);

      if (!exists) {
        throw new StorageErrors.NotFound(`Storage not found (${entity})`);
      }

      this._logger.debug(`retrieving file list from bucket "${entity}"`);
      const itemStream = this._client.listObjects(entity, '', true);

      const parent = this;

      let first = true;
      const toJson = new Transform({
        objectMode: true,
        transform(item, _, callback) {
          let transformedItem = JSON.stringify({
            ...item,
            location: `${parent._name}/${entity}/${item.name}`,
            etag: undefined,
          });

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

  async deleteFile(entity, filename) {
    try {
      this._logger.debug(JSON.stringify({ entity, filename }));
      const entityExists = await this._client.bucketExists(entity);

      if (!entityExists) {
        throw new StorageErrors.NotFound(`Storage not found (${entity})`);
      }

      const files = await this._collectFiles(entity);
      this._logger.debug(JSON.stringify(files));
      const fileExists = files.map(({ name }) => name).includes(filename);

      if (!fileExists) {
        throw new StorageErrors.NotFound(`Object not found (${filename})`);
      }

      this._logger.info(`deleting object (${entity}/${filename})`);
      return this._client.removeObject(entity, filename);
    } catch (err) {
      throw err;
    }
  }

  async createIngressStream(entity, filename, reqStream, size, type) {
    try {
      this._logger.debug(JSON.stringify({ entity, filename, size, type }));
      const exists = await this._client.bucketExists(entity);

      if (!exists) {
        throw new StorageErrors.NotFound(`Storage not found (${entity})`);
      }

      this._logger.info(`creating object (${entity}/${filename})`);

      return this._client.putObject(entity, filename, reqStream, size, { type });
    } catch (err) {
      throw err;
    }
  }

  async createEgressStream(entity, filename) {
    try {
      this._logger.debug(JSON.stringify({ entity, filename }));
      const exists = await this._client.bucketExists(entity);

      if (!exists) {
        throw new StorageErrors.NotFound(`Storage not found (${entity})`);
      }

      const files = await this._collectFiles(entity);
      const fileExists = files.map(({ name }) => name).includes(filename);

      if (!fileExists) {
        throw new StorageErrors.NotFound(`Object not found (${filename})`);
      }

      return this._client.getObject(entity, filename);
    } catch (err) {
      throw (err);
    }
  }
}
/* eslint-enable no-underscore-dangle */

module.exports = Storage;
