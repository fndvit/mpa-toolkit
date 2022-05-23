import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import type { Page, PageRequest, SubTypes, TagsOnPages } from "$lib/types";
import { calcReadTime } from "$lib/readtime";
import { validate } from "$lib/schema/validation";
import { pageForContentCard, pageFull } from "./queries";

export async function getPage(slug: string, draft = false) {
  return prisma.page.findFirst({
    where: { slug, draft },
    ...pageFull
  });
}

export async function getRecommendedPages(page: Pick<SubTypes.Page.Full, 'id' | 'tags'>) {
  return await prisma.page.findMany({
    where: {
      draft: false,
      tags: { some: { OR: page.tags.map(t => ({ tagId: t.tag.id })) } },
      NOT: { id: page.id }
    },
    orderBy: { tags: { _count: 'asc' } },
    ...pageForContentCard
  });
};

export async function getPageComponentProps(slug: string, draft = false) {

  const page = await getPage(slug, draft);

  if (!page) return error404('Page not found');

  const recommendedPages = await getRecommendedPages(page);

  return {
    body: {
      page,
      recommendedPages
    }
  };
};

export async function updatePage(id: number, page: PageRequest) {

  validate('page', page);

  const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

  return await prisma.page.update({
    where: { id },
    data: {
      title, slug, content, img, draft,
      readTime: calcReadTime(content),
      tags: {
        deleteMany: { OR: [ { pageId: { equals: id } }, ] },
        createMany: {
          data: tags.map(({id: tagId, category}) => ({ tagId, category }))
        },
      },
      caseStudy: caseStudy && { update: caseStudy },
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
}

export async function createPage(page: PageRequest) {

  validate('page', page);

  const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

  return await prisma.page.create({
    data: {
      title, slug, content, img, draft,
      readTime: calcReadTime(content),
      tags: {
        createMany: {
          data: tags.map(({id: tagId, category}) => ({ tagId, category }))
        },
      },
      caseStudy: caseStudy && { create: caseStudy },
      chapter: chapter && {
        create: {
          summary: chapter.summary,
          keyTakeaways: chapter.keyTakeaways,
          authors: { connect: chapter.authors.map(id => ({id})) }
        }
      }
    }
  });
}