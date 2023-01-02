import type { TokenPayload } from 'google-auth-library';
import type { LogConfig } from '../base';
import { DBMixin } from '../base';
import * as Queries from '../queries';

export class SessionMixin extends DBMixin {
  readonly name = 'session';

  logConfig: LogConfig<SessionMixin> = {
    start: ([payload], result) => [payload.email, !!result],
    end: ([userId], result) => [userId, result]
  };

  async start(payload: TokenPayload) {
    const firstUser = (await this.db.prisma.user.count()) === 0;
    return this.db.prisma.session.create({
      data: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        user: {
          connectOrCreate: {
            where: { googleId: payload.sub },
            create: {
              name: payload.name,
              email: payload.email,
              googleId: payload.sub,
              role: firstUser ? 'ADMIN' : 'USER'
            }
          }
        }
      },
      ...Queries.session
    });
  }

  async end(userId: number) {
    return this.db.prisma.session.deleteMany({ where: { userId } }).then(() => true);
  }

  async get(sessionId: string) {
    return this.db.prisma.session.findUnique({ where: { id: sessionId }, ...Queries.session });
  }
}
