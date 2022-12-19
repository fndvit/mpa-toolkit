import { publishEvent } from '@mpa/events';
import type { MpaDatabase } from '../db';
import type { APIRequests } from '../types';
import { validate } from '../validation';
import type { LogConfig } from './mixin';
import { DBMixin } from './mixin';

export class AuthorMixin extends DBMixin {
  constructor(db: MpaDatabase) {
    const logCfg: LogConfig<AuthorMixin> = {
      create: ([author], result) => [author.name, result?.id],
      update: ([id], result) => [id, !!result],
      delete: ([id], result) => [id, result]
    };
    super('author', db, logCfg);
  }

  async all() {
    return this.db.prisma.author.findMany();
  }

  async create(author: APIRequests.Author) {
    validate('author', author);
    const { name, bio, img } = author;
    const createAuthorQuery = this.db.prisma.author.create({ data: { name: name!, bio, img } });
    const [_author] = await this.db.prisma.$transaction([createAuthorQuery]);
    await publishEvent('author-created', { id: _author.id });
    return _author;
  }

  async update(id: number, author: APIRequests.Author) {
    validate('author', author);
    const { name, bio, img } = author;
    const _author = await this.db.prisma.author.update({ where: { id }, data: { name, bio, img } });
    await publishEvent('author-updated', { id });
    return _author;
  }

  async delete(id: number) {
    const cascade = this.db.prisma.page.updateMany({
      where: { chapter: { authors: { some: { id } } } },
      data: { content: { page: { update: { authors: { delete: { id } } } } } }
    });
    const deleteAuthor = this.db.prisma.author.delete({ where: { id } });

    await this.db.prisma.$transaction([cascade, deleteAuthor]);
    await publishEvent('author-deleted', { id });
    return true;
  }
}
