import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import type { Page, PageRequest, TagsOnPages } from "$lib/types";
import { calcReadTime } from "$lib/readtime";
import { validate } from "$lib/schema/validation";

export async function getPage(slug: string, draft = false) {
  return prisma.page.findFirst({
    where: { slug, draft },
    include: {
      caseStudy: true,
      chapter: {
        include: {
          authors: true
        }
      },
      tags: {
        include: {
          tag: true,
        }
      },
    }
  });
}

export async function getRecommendedPages (page: Page & {tags: TagsOnPages[]}) {
  return await prisma.page.findMany({
    where: {
        tags: {
          some: {
            OR:page.tags.map(t => ({
              tagId: t.tagId
            }))
          },
        },
        NOT: {
          id: page.id
        }
    },
    orderBy:{
      tags: {
        _count: 'asc'
      }
    },
    select: {
      tags: {
        include : {
          tag: true
        },
      },
      img: true,
      title: true,
      slug: true,
    }
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