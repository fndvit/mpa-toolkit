import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals: { withMetadata }, params: { slug } }) => {
  const page = await db.page.get({ slug, draft: true });
  if (!page) throw error(404, 'Page not found');
  return withMetadata({ page });
};
