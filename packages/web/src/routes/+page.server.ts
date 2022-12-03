import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
  const tagsForSearch = await db.tag.searchBarTags();

  const components = await db.homepage.getComponents();

  locals.cacheKeys.add(`pages`);
  locals.cacheKeys.add(`tags`);
  locals.cacheKeys.add(`homepage`);

  return {
    tags: tagsForSearch,
    components
  };
};
