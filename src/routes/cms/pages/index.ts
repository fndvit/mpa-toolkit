import { authMiddleware } from '$lib/auth';
import { prisma } from '$lib/prisma';
import { pageForCmsList } from '$lib/prisma/queries';

export const GET = authMiddleware({ role: 'ADMIN' }, async () => {
  return {
    body: {
      pages: await prisma.page.findMany(pageForCmsList),
      allTags: await prisma.tag.findMany()
    }
  };
});
