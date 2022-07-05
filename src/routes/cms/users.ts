import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { pageForCollectionCard, userBasic } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async () => {
  return {
    body: {
      users: await prisma.user.findMany({
        orderBy: [
          {
            role: 'desc'
          },
          {
            id: 'asc'
          }
        ]
      }),
      authors: await prisma.user.findMany({
        select: {
          ...userBasic.select,
          chapter: {
            select: {
              page: pageForCollectionCard
            }
          }
        }
      })
    }
  };
});
