import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async () => {
  return {
    body: {
      users: await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          chapter: {
            select: { _count: true }
          }
        },
        orderBy: [
          {
            role: 'desc'
          },
          {
            id: 'asc'
          }
        ]
      })
    },
  };
});
