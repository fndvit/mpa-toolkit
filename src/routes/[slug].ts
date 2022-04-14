import { schema } from "$lib/Editor/schema";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { Node } from "prosemirror-model";
import type { RequestHandler } from "@sveltejs/kit";
import type { ContentDocument } from "$lib/types";
import { calcReadTime } from "$lib/readtime";

export const get: RequestHandler = async ({ params }) => {
  const slug = params['slug'];
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      caseStudy: true,
      chapter: {
        include: {
          authors: true
        }
      }
    }
  });
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
      readTime: calcReadTime(contentNode),
    }
  };
};
