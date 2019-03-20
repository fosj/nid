const { Readable } = require('stream');
const Promise = require('bluebird');
const StorageErrors = require('./StorageErrors');
const { logger } = require('../config');

/* eslint-disable no-underscore-dangle */
class Storage {
  constructor(props) {
    this._client = props.client;
    this._asyncClient = Promise.promisifyAll(props.client);
    this._metadataLoc = props.metadataLoc;
    this.addMetadata = this.addMetadata.bind(this);
    this.init = this.init.bind(this);
    this._createLogger(props.name);
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

  async _countItemStream(itemStream) {
    return new Promise((resolve, reject) => {
      let count = 0;

      return itemStream
        .on('data', (item) => {
          this._logger.debug(JSON.stringify(item));
          count += 1;
        })
        .on('error', err => reject(err))
        .on('end', () => resolve(count));
    });
  }

  async _matchItemName(name, itemStream) {
    return new Promise((resolve, reject) => {
      const matches = [];

      return itemStream
        .on('data', (item) => {
          this._logger.debug(JSON.stringify(item));
          const { name: currentName } = item;
          if (currentName === name) {
            matches.push(item);
          }
        })
        .on('error', err => reject(err))
        .on('end', () => resolve(matches));
    });
  }

  async _collectItems(itemStream) { // eslint-disable-line class-methods-use-this
    return new Promise((resolve, reject) => {
      const items = [];

      return itemStream
        .on('data', item => items.push(item))
        .on('error', err => reject(err))
        .on('end', () => resolve(items));
    });
  }

  async init() {
    try {
      const client = this._asyncClient;

      const exists = await client.bucketExistsAsync(this._metadataLoc);

      if (exists) {
        this._logger.info(`metadata bucket exists (${this._metadataLoc})`);
        const fileStream = client.listObjects(this._metadataLoc, '', true);
        const count = await this._countItemStream(fileStream);
        this._logger.info(`found ${count} metadata`);
      } else {
        this._logger.info(`creating metadata bucket (${this._metadataLoc})`);
        await client.makeBucketAsync(this._metadataLoc);
        this._logger.info('successfully created metadata bucket');
      }
    } catch (err) {
      throw err;
    }
  }

  async addMetadata(id, metadata) {
    try {
      const client = this._asyncClient;
      const name = `${id}.json`;

      const fileStream = client.listObjects(this._metadataLoc, '', true);
      const matchedFiles = await this._matchItemName(name, fileStream);
      const bucketExists = await client.bucketExistsAsync(id);

      this.logger.debug(JSON.stringify(matchedFiles));

      if (matchedFiles.length > 1 && bucketExists) {
        throw new StorageErrors.BadRequest(`Metadata exists for id (${id}), use patch/put to update metadata`);
      }

      const writer = new Readable({ objectMode: false });
      writer.push(JSON.stringify(metadata));
      writer.push(null);

      this.logger.info(`creating bucket (${id})`);
      this.logger.debug(JSON.stringify(metadata));

      return Promise.all([
        client.putObject(this._metadataLoc, name, writer),
        client.makeBucketAsync(id),
      ]);
    } catch (err) {
      throw err;
    }
  }

  async listAll() {
    try {
      const client = this._asyncClient;

      const fileStream = client.listObjects(this._metadataLoc, '', true);
      const files = await this._collectItems(fileStream);

      return files.map(({ name }) => name);
    } catch (err) {
      throw err;
    }
  }

  // listAllForUser(userId) {}

  // getMetadata(id) {}

  // patchMetadata(metadata) {}

  // createIngressStream(id, filename) {}

  // createEgressStream(id, filename) {}
}
/* eslint-enable no-underscore-dangle */

module.exports = Storage;
