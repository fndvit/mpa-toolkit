import { schema } from "$lib/Editor/schema";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { Node } from "prosemirror-model";
import type { Page, TagsOnPages } from "$lib/types";
import { calcReadTime } from "$lib/readtime";

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

  const contentNode = Node.fromJSON(schema, page.content as any);

  return {
    body: {
      page,
      recommendedPages,
      readTime: calcReadTime(contentNode),
    }
  };
};
