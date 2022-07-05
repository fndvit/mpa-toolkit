import type { RequestHandler } from "@sveltejs/kit";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { pageForContentCard, tag } from "$lib/prisma/queries";
import { groupBy } from "$lib/helpers/utils";

export const get: RequestHandler<{ id: string }> = async ({locals}) => {

  const pages = await prisma.page.findMany({
    where: { draft: false },
    ...pageForContentCard
  });

  const tags = await prisma.tag.findMany({
    where: { type: "TOPIC" },
    ...tag
  });

  locals.cacheKey ??= new Set();
  
  locals.cacheKey.add(`pages`);
  locals.cacheKey.add(`tags`);

  const groups = groupBy(pages, p => p.chapter ? 'chapters' : 'caseStudies');

  return pages
    ? { body: { ...groups, tags } }
    : error404('Page not found');
};
