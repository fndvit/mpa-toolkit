import '@mpa/env/local';
import pino from 'pino';
import { pinoLambdaDestination } from 'pino-lambda';
import type PinoPretty from 'pino-pretty';

function getPino(config: { LOG_LEVEL: string; LOG_TRANSPORT: string }) {
  switch (config.LOG_TRANSPORT) {
    case 'pretty':
      return pino({
        level: config.LOG_LEVEL,
        transport: {
          target: 'pino-pretty',
          options: {
            ignore: 'time,hostname,pid'
          } as PinoPretty.PrettyOptions
        }
      });
    case 'lambda':
      return pino(pinoLambdaDestination());
    case 'silent':
      return pino({ level: 'silent' });
    default: {
      const p = pino();
      p.warn('Unknown log transport: ' + config.LOG_TRANSPORT);
      return p;
    }
  }
}

const config = {
  LOG_TRANSPORT: process.env.LOG_TRANSPORT || 'pretty',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
const _pino = getPino(config);

['LOG_LEVEL', 'LOG_TRANSPORT']
  .filter(key => process.env[key] !== config[key])
  .map(key => `Environment variable ${key} missing. Defaulting to ${config[key]}`)
  .forEach(msg => _pino.warn(msg));

export const logger = (name: string) => {
  return _pino.child({ name });
};

export type Logger = ReturnType<typeof logger>;
