import { Queries } from '@mpa/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { slugify } from '$lib/utils';
import { db } from '$lib/db';

async function getTagsIdBySlug(slug: string) {
  // can't directly query db by slug using prisma
  // so doing the query client-side

  const allTags = await db.prisma.tag.findMany({
    select: { id: true, value: true }
  });

  const tags: number[] = [];
  const slugTags = slug.split('+');
  slugTags.forEach(s => {
    const tag = allTags.find(t => slugify(t.value) === s);
    if (tag) tags.push(tag.id);
  });

  return tags;
}

export const load: PageServerLoad = async ({ locals, params }) => {
  const slug = params.slug.toLowerCase();

  if (slug !== params.slug) throw redirect(301, `/recommended/${slug}`);

  const ids: number[] = await getTagsIdBySlug(slug);

  if (ids.length === 0) throw error(404, 'Tag not found');

  const pages = await db.prisma.page.findMany({
    where: {
      tags: { some: { tag: { id: { in: ids } } } }
    },
    ...Queries.pageForCollectionCard
  });

  const sortedPages = pages
    .map(page => ({
      numTags: page.tags.filter(t => ids.includes(t.tag.id)).length,
      page
    }))
    .sort((a, b) => {
      if (a.numTags > b.numTags) return -1;
      else if (a.numTags < b.numTags) return 1;
      return a.page.createdAt.getTime() - b.page.createdAt.getTime();
    });

  sortedPages.slice(0, 10).forEach(({ page, numTags }) => console.log(`(${numTags}) ${page.createdAt} `));

  pages.map(p => p.tags.map(t => locals.cacheKeys.add(`tag-${t.tag.id}`)));
  locals.cacheKeys.add('pages');

  return { pages, highlightTagIds: ids };
};
