import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals: { withMetadata, cacheKeys }, params }) => {
  const slug = params.slug.toLowerCase();
  if (slug !== params.slug) throw redirect(301, `/tag/${slug}`);

  const tag = await db.tag.get(slug);
  if (!tag) {
    cacheKeys.add('tags');
    throw error(404, { message: 'Tag not found', model: 'tag' });
  }

  const pages = await db.page.getByTag(tag.id);

  pages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  pages.flatMap(p => p.tags).forEach(t => cacheKeys.add(`tag-${t.tag.id}`));

  cacheKeys.add('pages');

  return withMetadata({ pages, tag, highlightTagIds: [tag.id] });
};
