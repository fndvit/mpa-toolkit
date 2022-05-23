import type { RequestHandler } from "@sveltejs/kit";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { pageForCollectionCard } from "$lib/prisma/queries";

export const get: RequestHandler<{ id: string }> = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) return error404('Page not found');

  const pages = await prisma.page.findMany({
    where: {
      chapter: { authors: { some: { id: id } } },
      draft: false,
    },
    ...pageForCollectionCard
  });

  return pages
    ? { body: { pages } }
    : error404('Page not found');
};
