import { type LogConfig, DBMixin } from '../base';
import type { APIRequests } from '../types';
import { validate } from '../validation';

export class UserMixin extends DBMixin {
  readonly name = 'user';

  logConfig: LogConfig<UserMixin> = {
    update: ([id, user], result) => [[id, JSON.stringify(user)], !!result],
    delete: ([id], result) => [id, result]
  };

  async update(id: number, user: APIRequests.User) {
    validate('user', user);
    const { name, role } = user;
    return this.db.prisma.user.update({ where: { id }, data: { name, role } });
  }

  async delete(id: number) {
    return this.db.prisma.user.delete({ where: { id } }).then(() => true);
  }
}
