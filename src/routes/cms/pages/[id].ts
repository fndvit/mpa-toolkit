import { authMiddleware } from "$lib/auth";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";

export const get = authMiddleware(
  { role: 'CONTENT_MANAGER', redirect: '/cms' },
  async ({ params }) => {
  const { id } = params;
  const users = await prisma.user.findMany();
  if (id === 'newCH') {
    return { body: { users, cs: false } };
  }
  else if (id === 'newCS'){
    return { body: { users, cs: true } };
  }
  else {
    const pageId = parseInt(id);
    const page = !isNaN(pageId) && await prisma.page.findUnique({
      where: { id: pageId },
      include: { authors: true }
    });
    return page
      ? { body: { users, page } }
      : error404('Page not found');
  }
});
