import { Queries } from '@mpa/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { slugify } from '$lib/utils';
import { db } from '$lib/db';

async function getAuthorBySlug(slug: string) {
  // can't directly query db by slug using prisma
  // so doing the query client-side
  const allAuthors = await db.prisma.author.findMany({
    select: { id: true, name: true}
  });
  const author = allAuthors.find(a => slugify(a.name) === slug);
  return author?.id;
}

export const load: PageServerLoad = async ({ params, locals }) => {

  const slug = params.slug.toLowerCase();

  if (slug !== params.slug) throw redirect(301, `/author/${slug}`);

  const id = await getAuthorBySlug(slug);

  if (isNaN(id)) throw error(404, 'Page not found');

  const author = await db.prisma.author.findFirst({
    where: { id },
    select: {
      ...Queries.author.select,
      chapter: {
        where: { page: { draft: false } },
        select: { page: Queries.pageForCollectionCard }
      }
    }
  });

  if (!author) throw error(404, 'Page not found');

  const pages = author.chapter.map(c => c.page);

  pages.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  pages.map(p => p.chapter.authors.map(a => locals.cacheKeys.add(`author-${a.id}`)));
  locals.cacheKeys.add('pages');
  locals.cacheKeys.add('tags');

  if (!pages) throw error(404, 'Page not found');

  return { pages, title: author.name, bio: author.bio };
};