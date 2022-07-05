import { pageForCollectionCard } from "$lib/prisma/queries";
import { searchPages, searchTags } from "$lib/prisma/wrappers";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler<{ slug: string }> = async ({ locals, url }) => {
  const search_text = url.searchParams.get('q');

  const pages = await searchPages(search_text, pageForCollectionCard);
  const tagHighlights = await searchTags(search_text);

  locals.cacheKey ??= new Set();

  pages.forEach(page => {
    locals.cacheKey.add(`page-${page.id}`);
    page.tags.forEach(tag => locals.cacheKey.add(`tag-${tag.tag.id}`));
  });

  console.log('cacheKey:', locals.cacheKey);
  
  return {
    status: 200,
    body: {
      search: search_text,
      pages,
      tagHighlights
    }
  };
};
