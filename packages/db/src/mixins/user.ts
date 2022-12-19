import type { MpaDatabase } from '../db';
import type { APIRequests } from '../types';
import { validate } from '../validation';
import type { LogConfig } from './mixin';
import { DBMixin } from './mixin';

export class UserMixin extends DBMixin {
  constructor(db: MpaDatabase) {
    const logCfg: LogConfig<UserMixin> = {
      update: ([id, user], result) => [[id, JSON.stringify(user)], !!result],
      delete: ([id], result) => [id, result]
    };
    super('user', db, logCfg);
  }

  async update(id: number, user: APIRequests.User) {
    validate('user', user);
    const { name, role } = user;
    return this.db.prisma.user.update({ where: { id }, data: { name, role } });
  }

  async delete(id: number) {
    return this.db.prisma.user.delete({ where: { id } }).then(() => true);
  }
}
