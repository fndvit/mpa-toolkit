import type { MpaDatabase } from '../db';
import type { APIRequests } from '../types';
import { validate } from '../validation';

export const userMixin = (db: MpaDatabase) => ({
  update: async (id: number, user: APIRequests.User) => {
    validate('user', user);
    const { name, role } = user;
    return db.prisma.user.update({ where: { id }, data: { name, role } });
  },
  delete: async (id: number) => db.prisma.user.delete({ where: { id } }).then(() => true)
});
