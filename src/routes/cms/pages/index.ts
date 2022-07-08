import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { pageForCollectionCard, pageFull } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async () => {
  return {
    body: {
      allPages: await prisma.page.findMany({
        ...pageFull 
      }),
      pages: await prisma.page.findMany({
        ...pageForCollectionCard
      }),
      allTags: await prisma.tag.findMany()
    }
  };
});
