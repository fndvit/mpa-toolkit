import { authMiddleware } from "$lib/auth";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";


export const get = authMiddleware(
  { role: 'CONTENT_MANAGER', redirect: '/cms' },
  async ({ params }) => {
  const { id } = params;
  const users = await prisma.user.findMany();
  const tags = await prisma.tag.findMany();
  if (id === 'new') {
    return { body: { users, tags } };
  }
  else {
    const pageId = parseInt(id);
    const page = !isNaN(pageId) && await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        caseStudy: true,
        chapter: {
          include: {
            authors: true
          }
        },
        tags: {include: { category: true, tag: true}}
      }
    });

    return page
      ? { body: { users, page, tags } }
      : error404('Page not found');
  }
});
