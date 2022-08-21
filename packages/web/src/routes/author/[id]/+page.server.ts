import { Queries } from '@mpa/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id);

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

  if (!pages) throw error(404, 'Page not found');

  return { pages, title: author.name, bio: author.bio };
};
