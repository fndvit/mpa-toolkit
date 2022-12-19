import { logger } from '@mpa/log';
import { isFunction } from '@mpa/utils';
import type { MpaDatabase } from 'src';

const _log = logger('DB');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownFn = (...args: any[]) => any;

export type CustomLogFn<T extends UnknownFn = UnknownFn> = (
  args: Parameters<T>,
  result?: Awaited<ReturnType<T>>
) => [unknown] | [unknown, unknown];

export type LogConfig<T extends DBMixin> = {
  [K in keyof T]?: T[K] extends UnknownFn ? CustomLogFn<T[K]> : never;
};

export abstract class DBMixin {
  constructor(private name: string, protected db: MpaDatabase, logConfig?: LogConfig<DBMixin>) {
    if (logConfig) this.logWrapFunctions(logConfig);
  }

  private logWrapFunctions(cfg: Record<string, CustomLogFn>) {
    _log.debug(`Log wrapping fns: ${this.name}.{${Object.keys(cfg)}}`);

    Object.entries(cfg)
      .map(([key, val]) => ({
        name: key,
        fn: this[key] as unknown,
        logFn: val
      }))
      .map(({ name, fn, logFn }) => {
        const fnName = `${this.name}.${name}`;
        if (!isFunction(fn)) {
          _log.warn(`Log function ${name} is not a function`);
        } else {
          this[name] = async function (...args: unknown[]) {
            try {
              const result = await fn.apply(this, args);
              const [logArgs, logResult] = logFn(args, result);
              _log.debug(`${fnName}(${logArgs}) => ${logResult}`);
              return result;
            } catch (e) {
              const [logArgs] = logFn(args);
              _log.error(`${fnName}(${logArgs}) => ERROR`);
              throw e;
            }
          };
        }
      });
  }
}
