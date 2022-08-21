import type { TokenPayload } from 'google-auth-library';
import type { MpaDatabase } from '../db';
import * as Queries from '../queries';

export const sessionMixin = (db: MpaDatabase) => ({
  start: async (payload: TokenPayload) => {
    const firstUser = (await db.prisma.user.count()) === 0;
    return db.prisma.session.create({
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
  },

  end: async (userId: number) => db.prisma.session.deleteMany({ where: { userId } }).then(() => true),
  get: async (sessionId: string) => db.prisma.session.findUnique({ where: { id: sessionId }, ...Queries.session })
});
