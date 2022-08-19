import pino from 'pino';
import env from '@mpa/env';
import type PinoPretty from 'pino-pretty';
import { pinoLambdaDestination } from 'pino-lambda';

function getPino(transport: string) {
  switch (transport) {
    case 'pretty':
      return pino({
        level: env.LOG_LEVEL || 'info',
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
      p.warn('Unknown log transport: ' + transport);
      return p;
    }
  }
}

const _pino = getPino(env.LOG_TRANSPORT);

export const logger = (name: string) => {
  return _pino.child({ name });
};
