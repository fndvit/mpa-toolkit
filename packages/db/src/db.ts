import { logger } from '@mpa/log';
import { Prisma, PrismaClient } from '@prisma/client';
import expand from 'brace-expansion';
import { env } from './env';
import { authorMixin } from './mixins/author';
import { homepageMixin } from './mixins/homepage';
import { pageMixin } from './mixins/page';
import { sessionMixin } from './mixins/session';
import { tagMixin } from './mixins/tag';
import { userMixin } from './mixins/user';

const log = logger('DB');

export const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export class MpaDatabase {
  prisma: PrismaClient;
  user: ReturnType<typeof userMixin>;
  page: ReturnType<typeof pageMixin>;
  tag: ReturnType<typeof tagMixin>;
  author: ReturnType<typeof authorMixin>;
  session: ReturnType<typeof sessionMixin>;
  homepage: ReturnType<typeof homepageMixin>;

  constructor(url: string) {
    const LOG_DB_QUERIES = env.LOG_DB_QUERIES === 'true';
    const QUERY_LOGGING = LOG_DB_QUERIES ? ([{ emit: 'event', level: 'query' }] as const) : [];
    const prisma = new PrismaClient({
      datasources: { db: { url } },
      log: [...QUERY_LOGGING, 'info', 'warn', 'error']
    });

    if (LOG_DB_QUERIES) {
      prisma.$on('query', e => log.debug(e.query));
    }

    this.prisma = prisma;

    this.tag = tagMixin(this);
    this.page = pageMixin(this);
    this.author = authorMixin(this);
    this.user = userMixin(this);
    this.session = sessionMixin(this);
    this.homepage = homepageMixin(this);

    this._logWrapFunctions();
  }

  private _logWrapFunctions = () => {
    // this wraps all non-read-only database functions with logging
    const logFunctions = [
      'homepage.updateComponents',
      ...expand('session.{start,end}'),
      ...expand('{author,page,tag}.{update,create,delete}'),
      ...expand('user.{update,delete}')
    ];
    const logArgs = {
      'page.create': async (_, ret: ReturnType<typeof this.page.create>) => ret.then(p => p.id),
      'page.update': ([id]: Parameters<typeof this.page.update>) => id,
      'session.start': ([payload]: Parameters<typeof this.session.start>) => payload.email,
      default: (args: unknown[]) => args.map(a => JSON.stringify(a)).join(', ')
    };
    log.debug(`Log wrapping MpaDatabase fns: ${logFunctions.join(', ')}`);
    logFunctions
      .map(fn => fn.split('.'))
      .filter(([model, action]) => {
        if (!this[model] || !this[model][action]) {
          log.warn(`${model}.${action} is not a valid fn to wrap for logging`);
          return false;
        }
        return true;
      })
      .map(([model, action]) => {
        const fnName = `${model}.${action}`;
        const _fn = this[model][action] as (...args: unknown[]) => unknown;
        this[model][action] = async (...args) => {
          const logArgsFn = logArgs[fnName] || logArgs.default;
          const ret = _fn.apply(this, args);
          log.debug(`${fnName}(${await logArgsFn(args, ret)})`);
          return ret;
        };
      });
  };

  disconnect = () => this.prisma.$disconnect();
}
