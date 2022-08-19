import { Queries } from '@mpa/db';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals, url }) => {
  const search = url.searchParams.get('q') || '';

  const pages = await db.page.search(search, Queries.pageForCollectionCard);
  const tagHighlights = await db.searchTags(search);

  locals.cacheKeys.add('pages');
  locals.cacheKeys.add('tags');

  return {
    search,
    title: search,
    pages,
    tagHighlights
  };
};
