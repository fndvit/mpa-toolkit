import { logger } from '@mpa/log';
import { isFunction } from '@mpa/utils';
import { Prisma, PrismaClient } from '@prisma/client';
import AWSXRay from 'aws-xray-sdk-core';
import type { IterableElement, UnionToIntersection, Entries } from 'type-fest';
import { env } from './env';

const log = logger('DB');

const xrayLog = AWSXRay.getLogger();

export const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

type DBMixinConstructor<T extends DBMixin> = new (db: BaseDatabase) => T;
type DBMixinConstructors<T extends [...DBMixin[]]> = {
  [K in keyof T]: DBMixinConstructor<T[K]>;
};

type Distribute<U> = U extends DBMixin ? { [K in U['name']]: U } : never;
export type MixinMap<T extends [...DBMixin[]]> = Expand<UnionToIntersection<Distribute<IterableElement<T>>>>;

export class BaseDatabase {
  prisma = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error']
  });

  constructor() {
    this.prisma.$on('query', e => xrayLog.debug(e));

    if (env.LOG_DB_QUERIES === 'true') {
      this.prisma.$on('query', e => log.debug(e.query));
    }
  }
  disconnect = () => this.prisma.$disconnect();

  static createWithMixins<T extends [...DBMixin[]]>(opts: { mixins: DBMixinConstructors<T> }) {
    const db = new BaseDatabase() as BaseDatabase & MixinMap<T>;
    opts.mixins.forEach(M => {
      const mixin = new M(db);
      mixin.init();
      db[mixin.name] = mixin;
    });
    return db;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownFn = (...args: any[]) => any;
export type CustomLogFn<T extends UnknownFn = UnknownFn> = (
  args: Parameters<T>,
  result?: Awaited<ReturnType<T>>
) => [unknown] | [unknown, unknown];

export type LogConfig<T extends Omit<DBMixin, 'logConfig'>> = Partial<{
  [K in keyof T as K extends string ? K : never]: T[K] extends UnknownFn ? CustomLogFn<T[K]> : never;
}>;

export abstract class DBMixin<Deps extends [...DBMixin[]] = []> {
  db: BaseDatabase & { [K in Deps[number]['name']]: Deps[number] };

  constructor(_db: BaseDatabase) {
    this.db = _db as BaseDatabase & { [K in Deps[number]['name']]: Deps[number] };
  }

  abstract name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract logConfig: LogConfig<any>;

  init() {
    if (this.logConfig) this.logWrapFunctions();
  }

  private logWrapFunctions() {
    log.debug(`Log wrapping fns: ${this.name}.{${Object.keys(this.logConfig)}}`);
    const entries = Object.entries(this.logConfig) as Entries<typeof this.logConfig>;
    entries
      .map(([key, val]) => ({
        name: key,
        fn: this[key] as unknown,
        logFn: val
      }))
      .map(({ name, fn, logFn }) => {
        const fnName = `${this.name}.${name}`;
        if (!isFunction(fn)) {
          log.warn(`Log function ${name} is not a function`);
        } else if (!isFunction(logFn)) {
          log.warn(`Unexpected log config function for ${name}`);
        } else {
          this[name] = async function (...args: unknown[]) {
            try {
              const result = await fn.apply(this, args);
              const [logArgs, logResult] = logFn(args, result);
              log.debug(`${fnName}(${logArgs}) => ${logResult}`);
              return result;
            } catch (e) {
              const [logArgs] = logFn(args);
              log.error(`${fnName}(${logArgs}) => ERROR`);
              throw e;
            }
          };
        }
      });
  }
}
