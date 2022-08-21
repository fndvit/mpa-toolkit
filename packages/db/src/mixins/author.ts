import { publishEvent } from '@mpa/events';
import type { MpaDatabase } from '../db';
import type { APIRequests } from '../types';
import { validate } from '../validation';

export const authorMixin = (db: MpaDatabase) => ({
  all: async () => db.prisma.author.findMany(),
  create: async (author: APIRequests.Author) => {
    validate('author', author);
    const { name, bio, img } = author;
    const createAuthorQuery = db.prisma.author.create({ data: { name: name!, bio, img } });
    const [_author] = await db.prisma.$transaction([createAuthorQuery]);
    await publishEvent('author-created', { id: _author.id });
    return _author;
  },

  update: async (id: number, author: APIRequests.Author) => {
    validate('author', author);
    const { name, bio, img } = author;
    const _author = await db.prisma.author.update({ where: { id }, data: { name, bio, img } });
    await publishEvent('author-updated', { id });
    return _author;
  },

  delete: async (id: number) => {
    const cascade = db.prisma.page.updateMany({
      where: { chapter: { authors: { some: { id } } } },
      data: { content: { page: { update: { authors: { delete: { id } } } } } }
    });
    const deleteAuthor = db.prisma.author.delete({ where: { id } });
    await db.prisma.$transaction([cascade, deleteAuthor]);
    await publishEvent('author-deleted', { id });
    return true;
  }
});
