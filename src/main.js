const express = require('express');
const { environment, logger } = require('./config');
const router = require('./routes');
const { storage } = require('./dataaccess');

const app = express();

app.use('/', router);

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (!err.status || err.status === 500) {
    logger.error(err.message || JSON.stringify(err));
    return res.status(500).json({ message: 'Error accessing API' });
  }
  return res.status(err.status).json(err);
});

const listen = async () => {
  try {
    for (const instance of Object.values(storage)) {
      await instance.init(); // eslint-disable-line no-await-in-loop
    }

    const port = environment.get('port');
    app.listen(port, () => logger.info(`Server listening on port ${port}`));
  } catch (err) {
    logger.error(err);
  }
};

listen();
