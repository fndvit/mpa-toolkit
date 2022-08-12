import pino from 'pino';
import env from './env';

const TRANSPORTS = {
  pretty: {
    target: 'pino-pretty',
    options: {
      messageFormat: '[{module}] {msg}',
      ignore: 'module'
    }
  }
};

export const logger = pino({ transport: TRANSPORTS[env.LOG_TRANSPORT] });
