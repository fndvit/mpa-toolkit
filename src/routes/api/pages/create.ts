import type { PageRequest } from "$lib/types";
import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { validate } from "$lib/schema/validation";

export const put = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request }) => {

    const body = await request.json() as PageRequest;

    validate('page', body);

    const { title, slug, content, img, caseStudy, chapter, tags } = body;

    const page = await prisma.page.create({
      data: {
        title, slug, content, img,

        tags: {
          createMany: {
            data: tags.map(({id, category}) => ({
              tagId: id,
              category
            }))
          },
        },

        caseStudy: caseStudy && {
          create: {
            ...caseStudy
          }
        },

        chapter: chapter && {
          create: {
            summary: chapter.summary,
            keyTakeaways: chapter.keyTakeaways,
            authors: { connect: chapter.authors.map(id => ({id})) }
          }
        }
      }
    });

    return {
      status: 200,
      body: page
    };

  }
);
