const Promise = require('bluebird');
const { logger } = require('../config');

/* eslint-disable no-underscore-dangle */
class Storage {
  constructor(props) {
    this._client = props.client;
    this._asyncClient = Promise.promisifyAll(props.client);
    this._metadataLoc = props.metadataLoc;
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
          this._logger.debug(item);
          count += 1;
        })
        .on('error', err => reject(err))
        .on('end', () => resolve(count));
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

  // listAll() {}

  // listAllForUser(userId) {}

  // getMetadata(id) {}

  // addMetadata(metadata) {}

  // patchMetadata(metadata) {}

  // createIngressStream(id, filename) {}

  // createEgressStream(id, filename) {}
}
/* eslint-enable no-underscore-dangle */

module.exports = Storage;
