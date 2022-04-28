import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { validate } from "$lib/schema/validation";
import type { CaseStudy, TagCategory, TagOnPages } from '$lib/types';

export type PageRequest = {

  title: string;
  slug: string;
  content: string;
  img: string;
  tags: string[];
  caseStudy?: Omit<CaseStudy, 'pageId'>;
  chapter?: {
    summary: string;
    authors: number[];
    keyTakeaways: string[];
  }
}

export const patch = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request, params }) => {

    const body = await request.json() as PageRequest;

    validate('page', body);

    const { title, slug, content, img, caseStudy, chapter, tags } = body;

    const page = await prisma.page.update({
      where: { id: parseInt(params.id) },
      data: {
        title, slug, content, img,

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
            data: tags.map(tag => ({
              tagId: parseInt(tag.split(':')[0]),
              category: tag.split(':')[1] as TagCategory
            }))
          },
        },
        chapter: chapter && {
          update: {
            summary: { set: chapter.summary },
            keyTakeaways: { set: chapter.keyTakeaways },
            authors: {
              set: chapter.authors.map(author => ({
                id: author
              }))
            },
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
    const page = await prisma.page.delete({
      where: { id: parseInt(params.id) }
    });

    return {
      status: 200,
      body: page
    };
  }
);
