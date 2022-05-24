import { authMiddleware } from "$lib/auth";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { pageFull, userBasic } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'CONTENT_MANAGER' },
  async ({ params }) => {

    const { id } = params;
    const users = await prisma.user.findMany(userBasic);
    const allTags = await prisma.tag.findMany();
    const pageId = parseInt(id);
    const page = !isNaN(pageId) && await prisma.page.findUnique({
      where: { id: pageId },
      ...pageFull
    });

    if (!page) return error404('Page not found');

    return { body: { users, page, allTags } };
  }
);
