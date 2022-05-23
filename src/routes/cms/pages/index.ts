import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { pageForCollectionPage } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async () => {
  return {
    body: {
      pages: await prisma.page.findMany({
        ...pageForCollectionPage
      })
    }
  };
});
