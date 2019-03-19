const { createLogger, format, transports } = require('winston');
const chalk = require('chalk');
const environment = require('./environment');

const colourBg = text => chalk.bgBlue(chalk.black(text));
const colourFg = text => chalk.blue(text);

module.exports = createLogger({
  level: environment.get('logLevel'),
  format: format.combine(
    format.timestamp(),
    format.label({ label: 'NID' }),
    format.colorize(),
    format.printf(info => `${info.timestamp} ${colourBg(`[${info.label}]`)} ${info.level}: ${colourFg(info.message)}`),
  ),
  transports: [
    new transports.Console(),
  ],
});
