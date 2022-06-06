import { authMiddleware } from "$lib/auth";
import { updatePage } from "$lib/prisma/wrappers";
import { prisma } from "$lib/prisma";
import type { PageRequest } from "$lib/types";

export const patch = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request, params }) => {

    const body = await request.json() as PageRequest;

    const page = await updatePage(parseInt(params.id), body);

    return {
      status: 200,
      body: page
    };

  }
);

export const del = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ params }) => {
    const pageId = parseInt(params.id);

    const page = await prisma.page.findFirst({
      where: {id: pageId},
      include: {
        chapter: true,
        caseStudy: true
      }
    });

    const cascade = prisma.page.update({
      where: { id: pageId },
      data: {
        chapter: page.chapter ? { delete: true } : undefined,
        caseStudy: page.caseStudy ? { delete: true } : undefined,
        search: { delete: true },
        tags: {
          deleteMany: {
            OR: [
              { pageId: { equals: parseInt(params.id) } },
            ]
          }
        }
      }
    });

    const deletePage = prisma.page.delete({ where: { id: pageId } });

    await prisma.$transaction([cascade, deletePage]);

    return {
      status: 200
    };
  }
);
