import winston from 'winston';
import { config } from '../config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const meta = info.metadata && Object.keys(info.metadata).length
      ? '\n' + JSON.stringify(info.metadata, null, 2)
      : '';
    return `${info.timestamp} ${info.level}: ${info.message}${meta}`;
  }),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

export const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
});

export default logger;

