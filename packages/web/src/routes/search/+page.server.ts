import { Queries } from '@mpa/db';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals, url }) => {
  const search = url.searchParams.get('q') || '';

  const pages = await db.page.search(search, Queries.pageForCollectionCard);

  pages.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const tagHighlights = await db.tag.search(search);

  locals.cacheKeys.add('pages');
  locals.cacheKeys.add(`tags`);
  pages.forEach(p =>
    p.chapter?.authors.forEach(a => {
      locals.cacheKeys.add(`author-${a.id}`);
    })
  );

  return {
    search,
    title: '"' + search + '"',
    pages,
    tagHighlights
  };
};
