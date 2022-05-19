import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { validate } from "$lib/schema/validation";
import type { PageRequest } from "$lib/types";

export const patch = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request, params }) => {

    const body = await request.json() as PageRequest;

    validate('page', body);

    const { title, slug, content, img, caseStudy, chapter, tags, draft } = body;

    const page = await prisma.page.update({
      where: { id: parseInt(params.id) },
      data: {
        title, slug, content, img, draft,

        caseStudy: caseStudy && {
          update: {
            ...caseStudy
          }
        },
        tags: {
          deleteMany: {
            OR: [
              { pageId: { equals: parseInt(params.id) } },
            ]
          },
          createMany: {
            data: tags.map(({id, category}) => ({
              tagId: id,
              category
            }))
          },
        },
        chapter: chapter && {
          update: {
            summary: { set: chapter.summary },
            keyTakeaways: { set: chapter.keyTakeaways },
            authors: { set: chapter.authors.map(id => ({id})) },
          }
        },

        editedAt: new Date()
      }
    });

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
