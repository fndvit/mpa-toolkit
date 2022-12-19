import { logger } from '@mpa/log';
import { Prisma, PrismaClient } from '@prisma/client';
import AWSXRay from 'aws-xray-sdk-core';
import { env } from './env';
import { AuthorMixin } from './mixins/author';
import { HomepageMixin } from './mixins/homepage';
import { PageMixin } from './mixins/page';
import { SessionMixin } from './mixins/session';
import { TagMixin } from './mixins/tag';
import { UserMixin } from './mixins/user';

const log = logger('DB');

const xrayLog = AWSXRay.getLogger();

export const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export class MpaDatabase {
  prisma = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error']
  });
  tag = new TagMixin(this);
  user = new UserMixin(this);
  page = new PageMixin(this);
  author = new AuthorMixin(this);
  session = new SessionMixin(this);
  homepage = new HomepageMixin(this);

  constructor() {
    this.prisma.$on('query', e => xrayLog.debug(e));

    if (env.LOG_DB_QUERIES === 'true') {
      this.prisma.$on('query', e => log.debug(e.query));
    }
  }

  disconnect = () => this.prisma.$disconnect();
}
