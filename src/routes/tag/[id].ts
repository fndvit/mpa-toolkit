import type { RequestHandler } from "@sveltejs/kit";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { pageForCollectionCard, tag as tagQuery } from "$lib/prisma/queries";

export const get: RequestHandler<{ id: string }> = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) return error404('Page not found');

  const tag = await prisma.tag.findFirst({
    where: { id },
    select: {
      ...tagQuery.select,
      pageTags: {
        where: { page: {draft: false } },
        select: { page: pageForCollectionCard }
      }
    }
  });

  if (!tag) return error404('Page not found');

  const pages = tag.pageTags.map(t => t.page);

  return pages
    ? { body: { pages, tag } }
    : error404('Page not found');
};
