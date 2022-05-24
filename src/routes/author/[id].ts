import type { RequestHandler } from "@sveltejs/kit";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { pageForCollectionCard, userBasic } from "$lib/prisma/queries";

export const get: RequestHandler<{ id: string }> = async ({ params }) => {
  const id = parseInt(params.id);

  if (isNaN(id)) return error404('Page not found');

  const author = await prisma.user.findFirst({
    where: { id },
    select: {
      ...userBasic.select,
      chapter: {
        where: {
          page: {
            draft: false,
          }
        },
        select: {
          page: pageForCollectionCard
        }
      }
    }
  });

  if (!author) return error404('Page not found');

  const pages = author.chapter.map(c => c.page);

  return pages
    ? { body: { pages, author } }
    : error404('Page not found');
};
