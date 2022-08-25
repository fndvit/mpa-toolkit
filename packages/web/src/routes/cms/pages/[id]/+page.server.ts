import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const authors = await db.author.all();
  const allTags = await db.tag.all();
  const pageId = parseInt(id);
  const page = !isNaN(pageId) && (await db.page.get({ id: pageId }));

  if (!page) throw error(404, 'Page not found');

  return { authors, page, allTags };
};
