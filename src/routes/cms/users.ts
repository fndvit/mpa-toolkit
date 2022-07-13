import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { userForCMS } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async () => {
  return {
    body: {
      users: await prisma.user.findMany({
        ...userForCMS,
        orderBy: [
          { role: 'desc' },
          { id: 'asc'}
        ]
      })
    },
  };
});


