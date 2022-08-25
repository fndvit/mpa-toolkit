import { Queries } from '@mpa/db';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
  return {
    pages: await db.prisma.page.findMany(Queries.pageForCmsList),
    allTags: await db.prisma.tag.findMany()
  };
};
