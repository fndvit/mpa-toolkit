import type { RequestHandler } from "@sveltejs/kit";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { pageForCollectionPage } from "$lib/prisma/queries";

export const get: RequestHandler<{ id: string }> = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) return error404('Page not found');

  const pages = await prisma.page.findMany({
    where: {
      tags : { some: { tagId: id } },
      draft: false,
    },
    ...pageForCollectionPage
  });

  return pages
    ? { body: { pages } }
    : error404('Page not found');
};
