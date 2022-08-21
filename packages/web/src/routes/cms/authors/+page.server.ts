import { Queries } from '@mpa/db';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
  return {
    authors: await db.prisma.author.findMany({
      ...Queries.authorForCMS,
      orderBy: [{ name: 'desc' }, { id: 'asc' }]
    })
  };
};
