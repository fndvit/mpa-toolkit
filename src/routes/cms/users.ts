import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const get = authMiddleware(
  { role: 'ADMIN', redirect: '/cms' },
  async () => {
  return {
    body: {
      users: await prisma.user.findMany()
    }
  };
});
