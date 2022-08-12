import { authMiddleware } from '$lib/auth';
import { prisma } from '$lib/prisma';
import { countTags } from '$lib/prisma/queries';

export const GET = authMiddleware({ role: 'CONTENT_MANAGER' }, async () => {
  return {
    body: {
      tags: await prisma.tag.findMany({
        where: { type: 'TOPIC' },
        ...countTags,
        orderBy: {
          value: 'asc'
        }
      })
    }
  };
});
