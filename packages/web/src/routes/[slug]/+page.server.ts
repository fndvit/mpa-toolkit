import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals: { cacheKeys, withMetadata }, params: { slug } }) => {
  const page = await db.page.get({ slug, draft: false });
  if (!page) {
    cacheKeys.add('pages');
    throw error(404, 'Page not found');
  }
  cacheKeys.add(`page-${page.id}`);
  page.tags.forEach(tag => cacheKeys.add(`tag-${tag.tag.id}`));
  page.chapter?.authors.forEach(author => cacheKeys.add(`author-${author.id}`));
  return withMetadata({ page });
};
