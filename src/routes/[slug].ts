import { schema } from "$lib/Editor/schema";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { Node } from "prosemirror-model";
import type { RequestHandler } from "@sveltejs/kit";
import type { Page, ContentDocument, TagsOnPages } from "$lib/types";
import { calcReadTime } from "$lib/readtime";

export const get: RequestHandler<{slug: string}> = async ({ params: { slug } }) => {
  const page = await prisma.page.findUnique({
    where: { slug },
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

  const recommendedPages = await getRecommendedPages(page);

  if (!page) {
    return error404('Page not found');
  }

  const contentNode = Node.fromJSON(schema, page.content as any);

  const headings = [...Array(contentNode.childCount).keys()]
    .map(i => contentNode.child(i))
    .filter(node => node.type.name === 'heading')
    .map(node => ({
      text: node.textContent,
    }));

  const document = page.content as ContentDocument;

  return {
    body: {
      page,
      document,
      headings,
      recommendedPages,
      readTime: calcReadTime(contentNode),
    }
  };
};

const getRecommendedPages = async (page: Page & {tags: TagsOnPages[]}) => {
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
