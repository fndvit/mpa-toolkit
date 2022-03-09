import { schema } from "$lib/Editor/schema";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { DOMSerializer, Node } from "prosemirror-model";
import { JSDOM } from 'jsdom';
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ params }) => {
  const slug = params['slug'];
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { authors: true }
  });
  if (!page) {
    return error404('Page not found');
  }

  // some crude promsemirror node -> HTML conversion
  const dom = new JSDOM();
  const contentNode = Node.fromJSON(schema, page.content as any);
  const serializer = DOMSerializer.fromSchema(schema);

  const content = [...Array(contentNode.childCount).keys()]
    .map(i => contentNode.child(i))
    .map(node => {
      const customTypes = [];
      if (customTypes.indexOf(node.type.name) === -1) {
        const nodeEl = serializer.serializeNode(node, { document: dom.window.document }) as Element;
        return {
          type: 'html',
          value: nodeEl.outerHTML
        };
      }
      throw new Error('Not implemented');
    });

  return {
    body: {
      page,
      content
    }
  };
};
