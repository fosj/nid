const express = require('express');
const listEndpoints = require('express-list-endpoints');
const { environment, logger } = require('./config');
const { errorMiddleware } = require('./middlewares');
const configureRoutes = require('./routes');

const app = express();

app.use('/', configureRoutes());
app.use(errorMiddleware);
app.get('/', (req, res) => res.json(listEndpoints(app)).end);

const listen = async () => {
  try {
    const port = environment.get('port');
    app.listen(port, () => logger.info(`Server listening on port ${port}`));
  } catch (err) {
    logger.error(err);
  }
};

listen();
