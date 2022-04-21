import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { validate } from "$lib/schema/validation";
import type { PageRequest } from "./[id]";

export const put = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request }) => {

    const body = await request.json() as PageRequest;

    validate('page', body);

    const { title, slug, content, img, caseStudy, chapter } = body;

    const page = await prisma.page.create({
      data: {
        title, slug, content, img,

        caseStudy: caseStudy && {
          create: {
            ...caseStudy
          }
        },

        chapter: chapter && {
          create: {
            summary: chapter.summary,
            keyTakeaways: JSON.parse(chapter.keyTakeaways),
            authors: {
              connect: chapter.authors.map(author => ({
                id: author
              }))
            }
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
