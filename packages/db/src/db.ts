import { logger } from '@mpa/log';
import { Prisma, PrismaClient } from '@prisma/client';
import expand from 'brace-expansion';
import { env } from './env';
import { pageMixin } from './mixins/page';
import { tagMixin } from './mixins/tag';
import { authorMixin } from './mixins/author';
import { userMixin } from './mixins/user';
import { sessionMixin } from './mixins/session';

const log = logger('DB');

export const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export class MpaDatabase {
  prisma: PrismaClient;
  user: ReturnType<typeof userMixin>;
  page: ReturnType<typeof pageMixin>;
  tag: ReturnType<typeof tagMixin>;
  author: ReturnType<typeof authorMixin>;
  session: ReturnType<typeof sessionMixin>;

  constructor(url: string) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
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

    type _Functions = {
      [P in keyof MpaDatabase]: MpaDatabase[P] extends (...args: any) => any ? P : never;
    }[keyof MpaDatabase];

    const logFunctions: _Functions[] = [
      // ...expand('{update,create,delete}{Author}'),
      ...expand('searchTags'),
      'updateUser',
      'deleteUser'
    ];

    log.debug(`Log wrapping MpaDatabase fns: ${logFunctions.join(', ')}`);
    // logFunctions.forEach(fnName => {
    //   const _fn = this[fnName];
    //   this[fnName] = async (...args) => {
    //     if (fnName === 'updatePage') {
    //       log.debug(`${fnName}(${args[0]})`);
    //       return (<any>_fn).apply(this, args);
    //     } else if (fnName === 'createPage') {
    //       const _page = (await (<any>_fn).apply(this, args)) as Page.DB;
    //       log.debug(`${fnName}(${_page.id})`);
    //       return _page;
    //     } else {
    //       log.debug(`${fnName}(${args.map(a => JSON.stringify(a)).join(', ')})`);
    //       return (<any>_fn).apply(this, args);
    //     }
    //   };
    // });
  }

  disconnect = () => this.prisma.$disconnect();

  async searchTags(searchText: string) {
    const results: { tagId: number; highlight: string }[] = await this.prisma
      .$queryRaw`SELECT * FROM tag_highlights(${searchText})`;
    const o = Object.fromEntries(results.map(r => [r.tagId, r.highlight])) as { [tagId: number]: string };
    return o;
  }
}
